import { useFetcher } from "@remix-run/react";

interface UpvoteProps {
  postId: number;
  votes: number;
}

export function Upvote({ postId, votes }: UpvoteProps) {
  const fetcher = useFetcher();
  const isUpvoting = Number(fetcher.formData?.get("postId")) === postId;
  const Form = fetcher.Form;

  return (
    <Form method="post" action="/api/upvote">
      <input type="hidden" name="postId" value={postId} />
      <button type="submit" disabled={isUpvoting}>
        ▲ {isUpvoting ? votes + 1 : votes}
      </button>
    </Form>
  );
}
