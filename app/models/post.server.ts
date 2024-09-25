import { eq, sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { db } from "~/db.server";
import { comments, posts } from "~/db/schema.server";
import { Comment } from "./comment.server";

export const PostSchema = createSelectSchema(posts);
export type Post = z.infer<typeof PostSchema>;

export const PostCommentsSchema = createSelectSchema(posts).extend({
  commentCount: z.number(),
});
export type PostComments = z.infer<typeof PostCommentsSchema>;

export type PostWithComments = {
  post: PostComments;
  comments: Comment[];
};

export async function readPosts(n: number = 1): Promise<PostComments[]> {
  const rawPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      text: posts.text,
      score: posts.score,
      userId: posts.userId,
      createdAt: posts.createdAt,
      commentCount: sql<number>`COALESCE(COUNT(${comments.id}), 0)`.as(
        "commentCount"
      ),
    })
    .from(posts)
    .leftJoin(comments, eq(comments.postId, posts.id))
    .groupBy(posts.id)
    .orderBy(sql`${posts.createdAt} DESC`)
    .limit(n)
    .all();

  return z.array(PostCommentsSchema).parse(rawPosts);
}

// Read a post with all its comments.
export async function readFullPost(postId: number): Promise<PostWithComments> {
  const postItem = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      text: posts.text,
      score: posts.score,
      userId: posts.userId,
      createdAt: posts.createdAt,
      commentCount: sql<number>`COALESCE(COUNT(${comments.id}), 0)`.as(
        "commentCount"
      ),
    })
    .from(posts)
    .leftJoin(comments, eq(comments.postId, posts.id))
    .where(eq(posts.id, postId))
    .groupBy(posts.id)
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

export type CreatePostParams = Pick<Post, "title" | "url" | "text">;

export async function createPost({
  title,
  url,
  text,
}: CreatePostParams): Promise<Post> {
  const newPost = await db
    .insert(posts)
    .values({
      title,
      url,
      text,
      userId: "~zod", // XX implement auth
    })
    .returning()
    .get();

  return PostSchema.parse(newPost);
}
