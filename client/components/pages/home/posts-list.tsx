"use client";

import { usePosts } from "@/contexts/posts-context";
import { Post, PostContent, PostFooter, PostHeader } from "@/components/post";

export default function PostsList() {
  const { posts } = usePosts();

  return (
    <ul className="flex w-full flex-col items-center gap-4 py-8">
      {posts.map((post) => (
        <Post key={post.id} {...post}>
          <PostHeader {...post} />
          <PostContent {...post} />
          <PostFooter {...post} />
        </Post>
      ))}
    </ul>
  );
}
