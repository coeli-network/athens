import { eq, sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { db } from "~/db.server";
import { users } from "~/db/schema.server";

export const UserSchema = createSelectSchema(users);
export type User = z.infer<typeof UserSchema>;

type CreateUserParams = {
  id: string;
  address: string;
};

export async function createUser({
  id,
  address,
}: CreateUserParams): Promise<User> {
  const existingUser = await readUser(id);
  if (existingUser) {
    throw new Error(`User with id ${id} already exists`);
  }
  console.log("Creating user", id, address);
  try {
    const user = await db
      .insert(users)
      .values({ id, address })
      .returning()
      .get();
    console.log("User created successfully", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    } else {
      throw new Error("Failed to create user: Unknown error");
    }
  }
}

export async function readUser(id: string): Promise<User | undefined> {
  return db.select().from(users).where(eq(users.id, id)).get();
}

export async function updateUser(id: string, address: string): Promise<User> {
  const existingUser = await readUser(id);
  if (!existingUser) {
    throw new Error(`User with id ${id} does not exist`);
  }
  return db
    .update(users)
    .set({ address })
    .where(eq(users.id, id))
    .returning()
    .get();
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}
