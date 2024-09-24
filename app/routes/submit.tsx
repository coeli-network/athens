import { useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/cloudflare";
import type { ActionFunction } from "@remix-run/cloudflare";

import { createPost } from "~/models/post.server";

type ActionData = {
  errors?: {
    title?: string;
    text?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const text = formData.get("text");
  const url = formData.get("url");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (
    (typeof text !== "string" || text.length === 0) &&
    (typeof url !== "string" || url.length === 0)
  ) {
    return json<ActionData>(
      { errors: { text: "Either URL or text is required" } },
      { status: 400 }
    );
  }

  const post = await createPost({
    title,
    text: text?.toString() || null,
    url: url?.toString() || null,
  });

  return redirect("/");
};

export default function NewPost() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Submit</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-black dark:text-white mb-1"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-black dark:text-white"
            required
          />
          {actionData?.errors?.title && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.title}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-black dark:text-white mb-1"
          >
            URL
          </label>
          <input
            type="url"
            name="url"
            id="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-black dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="text"
            className="block text-sm font-medium text-black dark:text-white mb-1"
          >
            Text
          </label>
          <textarea
            name="text"
            id="text"
            rows={10}
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-black dark:text-white"
          ></textarea>
        </div>
        {actionData?.errors?.text && (
          <p className="text-red-500 text-sm mt-1">{actionData.errors.text}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
        >
          {isSubmitting ? "Creating..." : "Post"}
        </button>
      </Form>
    </div>
  );
}
