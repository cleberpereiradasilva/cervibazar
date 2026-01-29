create table if not exists "db_dumps" (
  "id" text primary key not null,
  "name" text not null,
  "size" integer not null,
  "content" text not null,
  "created_at" timestamp with time zone default now() not null
);
