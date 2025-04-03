"use client";

import { usePosts } from "@/contexts/posts-context";
import Post from "../post";
import clsx, { ClassValue } from "clsx";
import PostHeader from "../post/post-header";
import PostContent from "../post/post-content";
import PostFooter from "../post/post-footer";
import {
  CalendarArrowDown,
  CalendarArrowUp,
  Crown,
  HeartCrack,
} from "lucide-react";

export default function PostsList() {
  const { posts } = usePosts();

  const mostLikedClass: ClassValue = "border-amber-500 bg-amber-50";
  const leastLikedClass: ClassValue = "border-red-500 bg-red-50";
  const newestClass: ClassValue = "border-green-500 bg-green-50";
  const oldestClass: ClassValue = "border-blue-500 bg-blue-50";

  let mostLikedIndex = -1;
  let leastLikedIndex = -1;
  let newestIndex = -1;
  let oldestIndex = -1;

  posts.forEach((post, index) => {
    if (mostLikedIndex < 0 || post.likes > posts[mostLikedIndex].likes) {
      mostLikedIndex = index;
    }

    if (leastLikedIndex < 0 || post.likes < posts[leastLikedIndex].likes) {
      leastLikedIndex = index;
    }

    if (newestIndex < 0 || post.date > posts[newestIndex].date) {
      newestIndex = index;
    }

    if (oldestIndex < 0 || post.date < posts[oldestIndex].date) {
      oldestIndex = index;
    }
  });

  function getClassName(index: number): ClassValue {
    switch (index) {
      case mostLikedIndex:
        return mostLikedClass;

      case leastLikedIndex:
        return leastLikedClass;

      case newestIndex:
        return newestClass;

      case oldestIndex:
        return oldestClass;
    }
  }

  return (
    <ul className="flex w-full flex-col items-center gap-4 py-8">
      {posts.map((post, index) => (
        <Post
          key={post.id}
          className={clsx("border-2", getClassName(index))}
          {...post}
        >
          <div className="flex items-center gap-8 px-6">
            {index === mostLikedIndex && (
              <h1 className="flex items-center gap-2 font-bold text-amber-600">
                <Crown />
                Most Liked
              </h1>
            )}

            {index === leastLikedIndex && (
              <h1 className="flex items-center gap-2 font-bold text-red-600">
                <HeartCrack />
                Least Liked
              </h1>
            )}

            {index === newestIndex && (
              <h1 className="flex items-center gap-2 font-bold text-green-600">
                <CalendarArrowUp />
                Newest
              </h1>
            )}

            {index === oldestIndex && (
              <h1 className="flex items-center gap-2 font-bold text-blue-600">
                <CalendarArrowDown />
                Oldest
              </h1>
            )}
          </div>

          <PostHeader {...post} />
          <PostContent {...post} />
          <PostFooter {...post} />
        </Post>
      ))}
    </ul>
  );
}
