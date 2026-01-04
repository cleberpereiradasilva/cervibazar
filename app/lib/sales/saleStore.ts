import { isNull } from "drizzle-orm";
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
  customer: { name: string; phone: string; birthDate?: string };
  items: SaleItemInput[];
  payments: { credito: number; debito: number; dinheiro: number; pix: number };
  userId: string;
};

const normalizePhone = (phone: string) => phone.replace(/\D/g, "");

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
    if (!normalizedPhone) {
      throw new Error("Informe o telefone do cliente.");
    }

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

      const existingClient = clientsResult.find(
        (client) => normalizePhone(client.phone) === normalizedPhone
      );

      let clientId = existingClient?.id;

      if (!clientId) {
        if (!input.customer.name.trim()) {
          throw new Error("Informe o nome do cliente.");
        }
        if (!input.customer.birthDate) {
          throw new Error("Informe a data de nascimento do cliente.");
        }

        const newClientId = generateShortId();
        const createdAt = new Date();
        await tx.insert(clients).values({
          id: newClientId,
          name: input.customer.name.trim(),
          phone: normalizedPhone,
          birthday: new Date(input.customer.birthDate),
          createdBy: input.userId,
          createdAt,
          updatedAt: createdAt,
        });
        clientId = newClientId;
      }

      const saleId = generateShortId();
      const createdAt = new Date();

      await tx.insert(sales).values({
        id: saleId,
        clientId,
        createdBy: input.userId,
        totalAmount: totalAmount.toFixed(2),
        creditAmount: payments.credito.toFixed(2),
        debitAmount: payments.debito.toFixed(2),
        cashAmount: payments.dinheiro.toFixed(2),
        pixAmount: payments.pix.toFixed(2),
        changeAmount: changeAmount.toFixed(2),
        pendingAmount: pendingAmount.toFixed(2),
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
          createdAt,
        }))
      );

      return { saleId };
    });
  };

  return { create };
}
