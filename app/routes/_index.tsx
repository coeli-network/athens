import { json, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { readPosts, type Post, PostSchema } from "~/models/post.server";

type LoaderData = {
  posts: Post[];
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ posts: await readPosts(10) });
};

function hoursAgo(date: string) {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  return `${hours} hours ago `;
}

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();

  return (
    <div>
      <ol className="list-decimal list-outside ml-6">
        {posts.map(post => (
          <li key={post.id} className="mb-2">
            <Link to={post.url || `/post/${post.id}`} className="inline-block">
              {post.title}
            </Link>
            <div className="text-sm text-gray-500 ml-0">
              {post.score} points by{" "}
              <Link to={`/user/${post.userId}`}>{post.userId}</Link>{" "}
              {hoursAgo(post.createdAt)}
              <Link to={`/post/${post.id}`}>{post.commentCount} comments</Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
