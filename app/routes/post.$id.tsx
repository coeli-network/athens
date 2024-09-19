import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  getPostWithComments,
  type Post,
  type Comment,
  type PostWithComments,
} from "~/models/post.server";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

type LoaderData = PostWithComments;

export const loader: LoaderFunction = async ({ params }) => {
  const post: LoaderData = await getPostWithComments(Number(params.id));
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }
  return json<LoaderData>(post);
};

export default function Post() {
  const { post, comments } = useLoaderData<LoaderData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.createdAt}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{post.text}</p>
      </CardContent>
    </Card>
  );
}
