import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  readFullPost,
  type PostComments,
  type PostWithComments,
} from "~/models/post.server";
import { createComment } from "~/models/comment.server";

type LoaderData = PostWithComments;

export const loader: LoaderFunction = async ({ params, request }) => {
  const post: LoaderData = await readFullPost(Number(params.id));
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }
  return json<LoaderData>(post);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const postId = Number(formData.get("postId"));
  const commentText = formData.get("comment");

  if (!postId) {
    return json({ error: "Post ID is required" }, { status: 400 });
  }
  if (typeof commentText !== "string") {
    return json({ error: "Comment is required" }, { status: 400 });
  }

  await createComment(postId, commentText, "~zod"); // XX
  return redirect(`/post/${postId}`);
};

export default function Post() {
  const { post, comments } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold">
          <Link to={post.url || `/post/${post.id}`}>{post.title}</Link>
        </h1>
        <div className="mt-4">
          <p>{post.text}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Leave a Comment</h2>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="postId" value={post.id} />
          <textarea
            name="comment"
            className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-black dark:text-white"
            rows={4}
            placeholder="Write your comment here..."
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </Form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          comments.map(comment => (
            <div
              key={comment.id}
              className="mb-4 p-4 border border-gray-300 dark:border-gray-700"
            >
              <p className="font-semibold">
                {comment.userId}{" "}
                <span className="text-sm text-gray-500">
                  at {new Date(comment.createdAt).toLocaleString()}
                </span>
              </p>
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
