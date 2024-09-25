import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { getOwnedIds } from "~/utils/coinbaseWallet.server";
import { createUser, readUser } from "~/models/user.server";
import { redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (userId) {
    const user = await readUser(userId);
    if (user) {
      return json({ user });
    }
  }

  return json({ user: null });
};

export const action: ActionFunction = async ({ request }) => {
  console.log("action /auth");
  const formData = await request.formData();
  const address = formData.get("address") as string;

  if (!address) {
    console.log("Address is required");
    return json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const ids = await getOwnedIds(address);
    const userId = ids[0]; // XX implement ID picker
    console.log("userId", userId);

    let user = await readUser(userId);
    if (!user) {
      user = await createUser({ id: userId, address });
    }

    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
};
