import { getPool } from "@/app/lib/db/client";
import { generateShortId } from "@/app/lib/id/generateShortId";
import { createZip } from "@/app/lib/dumps/zip";
import fs from "node:fs/promises";
import path from "node:path";

export type DumpEntry = {
  id: string;
  name: string;
  size: number;
  createdAt: Date;
};

const MAX_DUMPS = 7;

export async function listDumps(): Promise<DumpEntry[]> {
  const pool = getPool();
  const result = await pool.query(
    `select id, name, size, created_at as "createdAt"
     from db_dumps
     order by created_at desc`
  );
  return result.rows as DumpEntry[];
}

function formatTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${y}${m}${d}_${hh}${mm}${ss}`;
}

export async function createDump() {
  const timestamp = formatTimestamp(new Date());
  const baseName = `dump_${timestamp}`;
  const schemaContent = await generateSchemaDump();
  const dataContent = await generateDataDump();
  const zipBuffer = createZip([
    {
      name: `${baseName}.schema.sql`,
      data: Buffer.from(schemaContent, "utf8"),
    },
    {
      name: `${baseName}.inserts.sql`,
      data: Buffer.from(dataContent, "utf8"),
    },
  ]);
  const filename = `${baseName}.zip`;
  const size = zipBuffer.byteLength;
  const contentBase64 = zipBuffer.toString("base64");

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("begin");
    const id = generateShortId();
    await client.query(
      `insert into db_dumps (id, name, size, content, created_at)
       values ($1, $2, $3, $4, now())`,
      [id, filename, size, contentBase64]
    );
    await client.query(
      `delete from db_dumps
       where id in (
         select id from db_dumps
         order by created_at desc
         offset $1
       )`,
      [MAX_DUMPS]
    );
    await client.query("commit");
    return { id, filename };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteDump(id: string) {
  if (!id) {
    throw new Error("Identificador inválido.");
  }
  const pool = getPool();
  await pool.query("delete from db_dumps where id = $1", [id]);
  return true;
}

export async function getDumpContent(id: string) {
  if (!id) return null;
  const pool = getPool();
  const result = await pool.query(
    `select name, content from db_dumps where id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

async function generateDataDump() {
  const pool = getPool();
  const { rows: tables } = await pool.query(
    `select table_name
     from information_schema.tables
     where table_schema = 'public'
       and table_type = 'BASE TABLE'
       and table_name not like '__drizzle%'
       and table_name <> 'db_dumps'
     order by table_name`
  );

  const header = [
    "-- Dump de dados (data-only)",
    `-- Gerado em ${new Date().toISOString()}`,
    "begin;",
  ];
  const statements: string[] = [];

  for (const { table_name } of tables) {
    const { rows: columns } = await pool.query(
      `select column_name, data_type, udt_name
       from information_schema.columns
       where table_schema = 'public' and table_name = $1
       order by ordinal_position`,
      [table_name]
    );
    const columnNames = columns.map((col: any) => col.column_name);
    if (!columnNames.length) continue;

    const { rows: pkRows } = await pool.query(
      `select a.attname as column_name
       from pg_index i
       join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any(i.indkey)
       where i.indrelid = $1::regclass and i.indisprimary`,
      [table_name]
    );
    const pkColumns = pkRows.map((row: any) => row.column_name);

    const result = await pool.query(`select * from "${table_name}"`);
    if (!result.rows.length) continue;

    const colList = columnNames.map(quoteIdent).join(", ");
    const valueChunks: string[] = [];

    for (const row of result.rows) {
      const values = columns.map((col: any) =>
        formatValue(row[col.column_name], col.data_type, col.udt_name)
      );
      valueChunks.push(`(${values.join(", ")})`);
    }

    let conflictClause = "";
    if (pkColumns.length) {
      const pkList = pkColumns.map(quoteIdent).join(", ");
      const nonPk = columnNames.filter((name: any) => !pkColumns.includes(name));
      if (nonPk.length) {
        const updates = nonPk
          .map((name: any) => `${quoteIdent(name)} = excluded.${quoteIdent(name)}`)
          .join(", ");
        conflictClause = ` on conflict (${pkList}) do update set ${updates}`;
      } else {
        conflictClause = ` on conflict (${pkList}) do nothing`;
      }
    }

    statements.push(
      `insert into ${quoteIdent(table_name)} (${colList}) values\n${valueChunks.join(",\n")}${conflictClause};`
    );
  }

  return [...header, ...statements, "commit;"].join("\n");
}

async function generateSchemaDump() {
  const drizzleDir = path.resolve(process.cwd(), "drizzle");
  const entries = await fs.readdir(drizzleDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();

  const header = [
    "-- Schema (migrations concatenadas)",
    `-- Gerado em ${new Date().toISOString()}`,
  ];
  const parts: string[] = [...header];

  for (const file of files) {
    const content = await fs.readFile(path.join(drizzleDir, file), "utf8");
    parts.push(`\n-- Migration: ${file}\n`);
    parts.push(content.trimEnd());
  }

  return parts.join("\n");
}

function quoteIdent(name: string) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

function escapeString(value: string) {
  return value.replace(/'/g, "''");
}

function formatValue(value: any, dataType?: string, udtName?: string) {
  if (value === null || value === undefined) return "null";
  if (Buffer.isBuffer(value)) {
    return `'\\\\x${value.toString("hex")}'::bytea`;
  }
  if (value instanceof Date) {
    return `'${escapeString(value.toISOString())}'`;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "null";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (Array.isArray(value)) {
    return `'${escapeString(JSON.stringify(value))}'::jsonb`;
  }
  if (typeof value === "object") {
    const cast = dataType === "json" || dataType === "jsonb" || udtName === "jsonb";
    return `'${escapeString(JSON.stringify(value))}'${cast ? "::jsonb" : ""}`;
  }
  const text = escapeString(String(value));
  if (dataType === "json" || dataType === "jsonb" || udtName === "jsonb") {
    return `'${text}'::jsonb`;
  }
  return `'${text}'`;
}
