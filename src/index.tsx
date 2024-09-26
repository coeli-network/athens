import { Hono } from "hono";
import { renderer } from "@/middleware/renderer";

const app = new Hono();

app.get("*", renderer);

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
        <p>No posts yet...</p>
      </div>
    </>
  );
});

export default app;
