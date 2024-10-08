import { Hono } from "hono";
import { renderer } from "@/middleware/renderer";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { sign } from "hono/jwt";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

app.use("/auth/*", jwt({ secret: "secret" }));

app.get("*", renderer);

app.get("/logout", (c) => {
  // Set headers to clear the JWT cookie and redirect
  c.header("Set-Cookie", "jwt=; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
  c.header("Location", "/");

  return c.render(
    <>
      <div className="container mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Logout</h2>
        <p>
          You have been logged out successfully.{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Go home
          </a>
        </p>
      </div>
    </>
  );
});

app.post("/login", async (c) => {
  const { urbitId, signedChallenge } = await c.req.parseBody();

  if (!urbitId || !signedChallenge) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  // TODO: Verify the signed challenge and authenticate the user
  // This would involve checking the signature against the user's public key

  // For now, we'll just create a simple JWT
  const token = await sign({ urbitId }, "secret");

  // Set the JWT as an HTTP-only cookie
  c.header("Set-Cookie", `jwt=${token}; HttpOnly; Secure; SameSite=Strict`);

  return c.json({ success: true });
});

app.get("/login", (c) => {
  const challenge = crypto.randomUUID();
  return c.render(
    <>
      <div className="container mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Login with Urbit ID</h2>
        <form className="space-y-4" data-challenge={challenge}>
          <div>
            <label
              htmlFor="urbitId"
              className="block text-sm font-medium text-gray-700"
            >
              Urbit ID
            </label>
            <input
              type="text"
              id="urbitId"
              name="urbitId"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="~sampel-palnet"
              required
            />
          </div>
          <div>
            <label
              htmlFor="masterTicket"
              className="block text-sm font-medium text-gray-700"
            >
              Master Ticket
            </label>
            <input
              type="password"
              id="masterTicket"
              name="masterTicket"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your master ticket"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
      <script src="/static/loginWithUrbit.js"></script>
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

export default app;
