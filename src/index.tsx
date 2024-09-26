import { Hono } from "hono";
import { renderer } from "@/middleware/renderer";

const app = new Hono();

app.get("*", renderer);

import { initDb } from "@/db/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";

app.get("/posts", async (c) => {
  const db = initDb(c.env);
  const allPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(30);

  return c.render(
    <>
      {allPosts.length > 0 ? (
        <ul className="space-y-4">
          {allPosts.map((post) => (
            <li key={post.id} className="border-b pb-2">
              <a
                href={post.url ?? "#"}
                className="text-blue-600 hover:underline"
              >
                {post.title}
              </a>
              <p className="text-sm text-gray-500">
                by {post.userId} | {new Date(post.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet...</p>
      )}
    </>
  );
});

app.get("/", (c) => {
  return c.render(
    <>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Athens</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/submit">submit</a>
            </li>
            <li>
              <a href="/new">new</a>
            </li>
            <li>
              <a href="/comments">comments</a>
            </li>
            <li>
              <a href="/login">login</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container mx-auto px-4 mt-8">
        <div hx-get="/posts" hx-trigger="load" hx-swap="innerHTML">
          <p>Loading posts...</p>
        </div>
      </div>
    </>
  );
});

app.get("/posts", async (c) => {
  const db = initDb(c.env);
  const allPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(30);

  return c.render(
    <>
      {allPosts.length > 0 ? (
        <ul className="space-y-4">
          {allPosts.map((post) => (
            <li key={post.id} className="border-b pb-2">
              <a
                href={post.url ?? "#"}
                className="text-blue-600 hover:underline"
              >
                {post.title}
              </a>
              <p className="text-sm text-gray-500">
                by {post.userId} | {new Date(post.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet...</p>
      )}
    </>
  );
});

export default app;
