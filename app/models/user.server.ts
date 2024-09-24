import { eq, sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { db } from "~/db.server";
import { users } from "~/db/schema.server";

export const UserSchema = createSelectSchema(users);
export type User = z.infer<typeof UserSchema>;

type CreateUserParams = {
  id: string;
  email: string | undefined;
  address: string;
};

export async function createUser({
  id,
  email,
  address,
}: CreateUserParams): Promise<User> {
  const existingUser = await readUser(id);
  if (existingUser) {
    throw new Error(`User with id ${id} already exists`);
  }
  return db.insert(users).values({ id, email, address }).returning().get();
}

export async function readUser(id: string): Promise<User | undefined> {
  return db.select().from(users).where(eq(users.id, id)).get();
}

export async function updateUser(
  id: string,
  email: string | undefined,
  address: string
): Promise<User> {
  const existingUser = await readUser(id);
  if (!existingUser) {
    throw new Error(`User with id ${id} does not exist`);
  }
  return db
    .update(users)
    .set({ email, address })
    .where(eq(users.id, id))
    .returning()
    .get();
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}
