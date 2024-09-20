import { json } from "@remix-run/node";
import { db } from "~/db.server";
import { comments, users } from "~/db/schema.server";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const CommentSchema = createSelectSchema(comments);
export type Comment = z.infer<typeof CommentSchema>;

export async function readComments(postId: number): Promise<Comment[]> {
  const commentItems = await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId));
  return z.array(CommentSchema).parse(commentItems);
}

export async function createComment(
  postId: number,
  text: string,
  userId: string
) {
  return db.insert(comments).values({
    postId,
    text,
    userId,
  });
}

export async function deleteComment(id: number): Promise<boolean> {
  const result = await db.delete(comments).where(eq(comments.id, id));
  return result.changes > 0;
}

export async function updateComment(
  id: number,
  text: string
): Promise<boolean> {
  const result = await db
    .update(comments)
    .set({ text })
    .where(eq(comments.id, id));
  return result.changes > 0;
}
