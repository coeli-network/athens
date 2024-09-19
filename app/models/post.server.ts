import { json } from "@remix-run/node";
import { db } from "~/db.server";
import { comments, posts } from "~/db/schema.server";
import { eq, sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const CommentSchema = createSelectSchema(comments);
export type Comment = z.infer<typeof CommentSchema>;

export const PostSchema = createSelectSchema(posts).extend({
  commentCount: z.number(),
});
export type Post = z.infer<typeof PostSchema>;

export type PostWithComments = {
  post: Post;
  comments: Comment[];
};

export async function getPost(postId: number): Promise<Post> {
  const postItem = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      text: posts.text,
      score: posts.score,
      userId: posts.userId,
      createdAt: posts.createdAt,
      commentCount: sql<number>`(
          SELECT COUNT(*)
          FROM ${comments}
          WHERE ${comments.postId} = ${posts.id}
        )`.as("commentCount"),
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .get();

  if (!postItem) {
    throw new Response("Post not found", { status: 404 });
  }

  return postItem;
}

export async function getPostWithComments(
  postId: number
): Promise<PostWithComments> {
  const postItem = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      text: posts.text,
      score: posts.score,
      userId: posts.userId,
      createdAt: posts.createdAt,
      commentCount: sql<number>`(
          SELECT COUNT(*)
          FROM ${comments}
          WHERE ${comments.postId} = ${posts.id}
        )`.as("commentCount"),
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .get();

  if (!postItem) {
    throw new Response("Post not found", { status: 404 });
  }

  const commentItems: Comment[] = await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postItem.id))
    .orderBy(comments.createdAt)
    .all();

  return { post: postItem, comments: commentItems };
}

export async function getPosts(limit: number = 10): Promise<Post[]> {
  const rawPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      text: posts.text,
      score: posts.score,
      userId: posts.userId,
      createdAt: posts.createdAt,
      commentCount: sql<number>`(
          SELECT COUNT(*)
          FROM ${comments}
          WHERE ${comments.postId} = ${posts.id}
        )`.as("commentCount"),
    })
    .from(posts)
    .orderBy(posts.createdAt)
    .limit(limit)
    .all();

  return z.array(PostSchema).parse(rawPosts);
}
