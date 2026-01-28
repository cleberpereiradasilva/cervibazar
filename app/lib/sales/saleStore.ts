import { eq, isNull } from "drizzle-orm";
import { clients } from "../db/schema/clients";
import { saleItems } from "../db/schema/saleItems";
import { sales } from "../db/schema/sales";
import { getDb } from "../db/client";
import { generateShortId } from "../id/generateShortId";

type SaleItemInput = {
  categoryId: string;
  quantity: number;
  price: number;
};

type SaleInput = {
  customer: { name: string; phone?: string | null; birthDate?: string | null };
  items: SaleItemInput[];
  payments: { credito: number; debito: number; dinheiro: number; pix: number };
  saleDate: string;
  sellerId: string;
  userId: string;
};

type SaleUpdateInput = SaleInput & {
  saleId: string;
};

const normalizePhone = (phone?: string | null) => (phone ?? "").replace(/\D/g, "");

const parseSaleDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) {
    throw new Error("Data da venda inválida.");
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(date.getTime())) {
    throw new Error("Data da venda inválida.");
  }
  return date;
};

export function saleStore() {
  const db = getDb();

  const create = async (input: SaleInput) => {
    const itemsToSave = input.items.filter((item) => item.quantity > 0 && item.price > 0);
    if (!itemsToSave.length) {
      throw new Error("Adicione pelo menos um item na venda.");
    }

    const totalAmount = itemsToSave.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const payments = {
      credito: Math.max(0, Number(input.payments.credito) || 0),
      debito: Math.max(0, Number(input.payments.debito) || 0),
      dinheiro: Math.max(0, Number(input.payments.dinheiro) || 0),
      pix: Math.max(0, Number(input.payments.pix) || 0),
    };
    const totalPaid = payments.credito + payments.debito + payments.dinheiro + payments.pix;
    const changeAmount = Math.max(0, totalPaid - totalAmount);
    const pendingAmount = Math.max(0, totalAmount - totalPaid);

    const normalizedPhone = normalizePhone(input.customer.phone);

    const now = new Date();
    const saleDay = parseSaleDate(input.saleDate);

    return db.transaction(async (tx) => {
      const clientsResult = await tx
        .select({
          id: clients.id,
          name: clients.name,
          phone: clients.phone,
          birthday: clients.birthday,
          deletedAt: clients.deletedAt,
        })
        .from(clients)
        .where(isNull(clients.deletedAt));

      const existingClient = normalizedPhone
        ? clientsResult.find((client) => normalizePhone(client.phone) === normalizedPhone)
        : undefined;

      let clientId = existingClient?.id;

      if (!clientId) {
        if (!input.customer.name.trim()) {
          throw new Error("Informe o nome do cliente.");
        }
        const newClientId = generateShortId();
        const createdAt = new Date();
        await tx.insert(clients).values({
          id: newClientId,
          name: input.customer.name.trim(),
          phone: normalizedPhone || null,
          birthday: input.customer.birthDate ? new Date(input.customer.birthDate) : null,
          createdBy: input.userId,
          createdAt,
          updatedAt: createdAt,
        });
        clientId = newClientId;
      }

      const saleId = generateShortId();
      const createdAt = now;

      await tx.insert(sales).values({
        id: saleId,
        clientId,
        createdBy: input.userId,
        sellerId: input.sellerId,
        totalAmount: totalAmount.toFixed(2),
        creditAmount: payments.credito.toFixed(2),
        debitAmount: payments.debito.toFixed(2),
        cashAmount: payments.dinheiro.toFixed(2),
        pixAmount: payments.pix.toFixed(2),
        changeAmount: changeAmount.toFixed(2),
        pendingAmount: pendingAmount.toFixed(2),
        saleDate: saleDay,
        day: saleDay,
        createdAt,
        updatedAt: createdAt,
      });

      await tx.insert(saleItems).values(
        itemsToSave.map((item) => ({
          id: generateShortId(),
          saleId,
          categoryId: item.categoryId,
          quantity: item.quantity,
          unitPrice: item.price.toFixed(2),
          lineTotal: (item.quantity * item.price).toFixed(2),
          saleDate: saleDay,
          day: saleDay,
          createdAt,
        }))
      );

      return { saleId };
    });
  };

  const update = async (input: SaleUpdateInput) => {
    const itemsToSave = input.items.filter((item) => item.quantity > 0 && item.price > 0);
    if (!itemsToSave.length) {
      throw new Error("Adicione pelo menos um item na venda.");
    }

    const totalAmount = itemsToSave.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const payments = {
      credito: Math.max(0, Number(input.payments.credito) || 0),
      debito: Math.max(0, Number(input.payments.debito) || 0),
      dinheiro: Math.max(0, Number(input.payments.dinheiro) || 0),
      pix: Math.max(0, Number(input.payments.pix) || 0),
    };
    const totalPaid = payments.credito + payments.debito + payments.dinheiro + payments.pix;
    const changeAmount = Math.max(0, totalPaid - totalAmount);
    const pendingAmount = Math.max(0, totalAmount - totalPaid);

    const normalizedPhone = normalizePhone(input.customer.phone);

    const saleDay = parseSaleDate(input.saleDate);
    const now = new Date();

    return db.transaction(async (tx) => {
      const [existingSale] = await tx
        .select({ id: sales.id, clientId: sales.clientId })
        .from(sales)
        .where(eq(sales.id, input.saleId));

      if (!existingSale) {
        throw new Error("Venda não encontrada.");
      }

      const clientsResult = await tx
        .select({
          id: clients.id,
          name: clients.name,
          phone: clients.phone,
          birthday: clients.birthday,
          deletedAt: clients.deletedAt,
        })
        .from(clients)
        .where(isNull(clients.deletedAt));

      const existingClient = normalizedPhone
        ? clientsResult.find((client) => normalizePhone(client.phone) === normalizedPhone)
        : undefined;

      let clientId = existingClient?.id ?? existingSale.clientId;

      if (!clientId || (normalizedPhone && !existingClient)) {
        if (!input.customer.name.trim()) {
          throw new Error("Informe o nome do cliente.");
        }
        const newClientId = generateShortId();
        const createdAt = new Date();
        await tx.insert(clients).values({
          id: newClientId,
          name: input.customer.name.trim(),
          phone: normalizedPhone || null,
          birthday: input.customer.birthDate ? new Date(input.customer.birthDate) : null,
          createdBy: input.userId,
          createdAt,
          updatedAt: createdAt,
        });
        clientId = newClientId;
      } else {
        await tx
          .update(clients)
          .set({
            name: input.customer.name.trim(),
            phone: normalizedPhone || null,
            birthday: input.customer.birthDate ? new Date(input.customer.birthDate) : null,
            updatedAt: now,
          })
          .where(eq(clients.id, clientId));
      }

      await tx
        .update(sales)
        .set({
          clientId,
          sellerId: input.sellerId,
          totalAmount: totalAmount.toFixed(2),
          creditAmount: payments.credito.toFixed(2),
          debitAmount: payments.debito.toFixed(2),
          cashAmount: payments.dinheiro.toFixed(2),
          pixAmount: payments.pix.toFixed(2),
          changeAmount: changeAmount.toFixed(2),
          pendingAmount: pendingAmount.toFixed(2),
          saleDate: saleDay,
          day: saleDay,
          updatedAt: now,
        })
        .where(eq(sales.id, input.saleId));

      await tx.delete(saleItems).where(eq(saleItems.saleId, input.saleId));

      await tx.insert(saleItems).values(
        itemsToSave.map((item) => ({
          id: generateShortId(),
          saleId: input.saleId,
          categoryId: item.categoryId,
          quantity: item.quantity,
          unitPrice: item.price.toFixed(2),
          lineTotal: (item.quantity * item.price).toFixed(2),
          saleDate: saleDay,
          day: saleDay,
          createdAt: now,
        }))
      );

      return { saleId: input.saleId };
    });
  };

  const remove = async (saleId: string) => {
    return db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ id: sales.id })
        .from(sales)
        .where(eq(sales.id, saleId));

      if (!existing) {
        throw new Error("Venda não encontrada.");
      }

      await tx.delete(saleItems).where(eq(saleItems.saleId, saleId));
      await tx.delete(sales).where(eq(sales.id, saleId));
      return true;
    });
  };

  return { create, update, remove };
}
