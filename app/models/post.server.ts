import { eq, sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { db } from "~/db.server";
import { comments, posts } from "~/db/schema.server";
import { Comment } from "./comment.server";

export const PostSchema = createSelectSchema(posts).extend({
  commentCount: z.number(),
});
export type Post = z.infer<typeof PostSchema>;

export type PostWithComments = {
  post: Post;
  comments: Comment[];
};

export async function readPosts(n: number = 1): Promise<Post[]> {
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

  return z.array(PostSchema).parse(rawPosts);
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
