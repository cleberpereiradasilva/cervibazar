import { createHash, randomUUID } from "crypto";

type StoredUser = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "caixa";
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const memoryUsers: StoredUser[] = [
  {
    id: randomUUID(),
    name: "Ana Silva",
    username: "ana.silva",
    role: "caixa",
    passwordHash: createHash("sha256").update("senha123").digest("hex"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: randomUUID(),
    name: "Roberto Costa",
    username: "roberto.costa",
    role: "admin",
    passwordHash: createHash("sha256").update("senha123").digest("hex"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function userStore() {
  const list = async () =>
    memoryUsers.map(({ passwordHash, ...rest }) => ({
      ...rest,
    }));

  const add = async (input: {
    name: string;
    username: string;
    role: "admin" | "caixa";
    password: string;
  }) => {
    const now = new Date();
    const newUser: StoredUser = {
      id: randomUUID(),
      name: input.name,
      username: input.username,
      role: input.role,
      passwordHash: createHash("sha256").update(input.password).digest("hex"),
      createdAt: now,
      updatedAt: now,
    };
    memoryUsers.push(newUser);
    const { passwordHash, ...publicUser } = newUser;
    return publicUser;
  };

  const update = async (input: {
    id: string;
    name: string;
    username: string;
    role: "admin" | "caixa";
    password?: string;
  }) => {
    const index = memoryUsers.findIndex((user) => user.id === input.id);
    if (index === -1) {
      return null;
    }

    const current = memoryUsers[index];
    const passwordHash =
      input.password && input.password.length > 0
        ? createHash("sha256").update(input.password).digest("hex")
        : current.passwordHash;

    const updated: StoredUser = {
      ...current,
      name: input.name,
      username: input.username,
      role: input.role,
      passwordHash,
      updatedAt: new Date(),
    };

    memoryUsers[index] = updated;
    const { passwordHash: _, ...publicUser } = updated;
    return publicUser;
  };

  const remove = async (id: string) => {
    const index = memoryUsers.findIndex((user) => user.id === id);
    if (index === -1) {
      return false;
    }
    memoryUsers.splice(index, 1);
    return true;
  };

  return { list, add, remove, update };
}
