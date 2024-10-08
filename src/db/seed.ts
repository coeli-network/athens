import "dotenv/config";
import { db } from "./db";
import { posts, users, comments, votes } from "./schema";
import { sql } from "drizzle-orm";

const ids = [
  "zod",
  "mastyr-bottec",
  "lagrev-nocfep",
  "wolrus-ridrup",
  "master-morzod",
  "tiller-tolbus",
  "sorreg-namtyv",
  "finmep-lanteb",
  "rovnys-ricfer",
  "hanfel-dovned",
  "dorreg-lantep",
];
const submissions = [
  { title: "Urbit: A clean slate OS", url: "https://urbit.org" },
  { title: "Signal: Speak Freely ", url: "https://signal.org" },
  { title: "X (formerly known as Twitter)", url: "https://x.com" },
  { title: "GitHub: Let's build from here", url: "https://github.com" },
  { title: "Farcaster", url: "https://farcaster.xyz" },
  { title: "Bluesky", url: "https://bsky.app" },
  { title: "Hacker News", url: "https://news.ycombinator.com" },
  { title: "Lobste.rs", url: "https://lobste.rs" },
  { title: "Reddit - Dive into anything", url: "https://reddit.com" },
  { title: "DeepNewz", url: "https://deepnewz.com" },
];

async function seed() {
  for (let id of ids) {
    await db
      .insert(users)
      .values({
        id: `~${id}`,
        address: `0x${ids.indexOf(id).toString(16).padStart(2, "0")}`,
      })
      .onConflictDoNothing();
  }
  console.log(`Added ${ids.length} users`);

  for (let post of submissions) {
    await db
      .insert(posts)
      .values({
        title: post.title,
        url: post.url,
        text: "This is a test post",
        userId: `~${ids[Math.floor(Math.random() * ids.length)]}`,
      })
      .onConflictDoNothing();
  }
  console.log(`Added ${submissions.length} posts`);
  console.log("Seeding complete");
}

seed();
