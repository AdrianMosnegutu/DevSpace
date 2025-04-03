"use client";

import { usePosts } from "@/contexts/posts-context";
import Post from "../post";

export default function PostsList() {
  const { posts } = usePosts();

  return (
    <ul className="flex w-full flex-col items-center gap-4">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </ul>
  );
}
