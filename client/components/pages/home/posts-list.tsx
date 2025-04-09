"use client";

import { usePosts } from "@/contexts/posts-context";
import clsx, { ClassValue } from "clsx";
import {
  CalendarArrowDown,
  CalendarArrowUp,
  Crown,
  HeartCrack,
} from "lucide-react";
import { TPost } from "common";
import { useEffect, useState } from "react";
import {
  serverGetLeastLikedPost,
  serverGetMostLikedPost,
  serverGetNewestPost,
  serverGetOldestPost,
} from "@/lib/services/post-service";
import { errorToast } from "@/lib/toasts";
import { Post, PostContent, PostFooter, PostHeader } from "@/components/post";

export default function PostsList() {
  const { posts, createPost, updatePost, deletePost } = usePosts();

  const [newestPost, setNewestPost] = useState<TPost>();
  const [oldestPost, setOldestPost] = useState<TPost>();
  const [mostLikedPost, setMostLikedPost] = useState<TPost>();
  const [leastLikedPost, setLeastLikedPost] = useState<TPost>();

  useEffect(() => {
    Promise.all([
      serverGetNewestPost,
      serverGetOldestPost,
      serverGetMostLikedPost,
      serverGetLeastLikedPost,
    ])
      .then(
        ([
          newestPostResponse,
          oldestPostResponse,
          mostLikedPostResponse,
          leastLikedPostResponse,
        ]) => {
          newestPostResponse()
            .then((post) => setNewestPost(post))
            .catch((error) =>
              errorToast("Could not parse newest post!", error),
            );
          oldestPostResponse()
            .then((post) => setOldestPost(post))
            .catch((error) =>
              errorToast("Could not parse oldest post!", error),
            );
          mostLikedPostResponse()
            .then((post) => setMostLikedPost(post))
            .catch((error) =>
              errorToast("Could not parse most liked post!", error),
            );
          leastLikedPostResponse()
            .then((post) => setLeastLikedPost(post))
            .catch((error) =>
              errorToast("Could not parse least liked post!", error),
            );
        },
      )
      .catch((error) => errorToast("Could not get statistical posts!", error));
  }, [createPost, updatePost, deletePost]);

  const mostLikedClass: ClassValue = "border-amber-500 bg-amber-50";
  const leastLikedClass: ClassValue = "border-red-500 bg-red-50";
  const newestClass: ClassValue = "border-green-500 bg-green-50";
  const oldestClass: ClassValue = "border-blue-500 bg-blue-50";

  function getClassName(id: string): ClassValue {
    switch (id) {
      case mostLikedPost?.id:
        return mostLikedClass;

      case leastLikedPost?.id:
        return leastLikedClass;

      case newestPost?.id:
        return newestClass;

      case oldestPost?.id:
        return oldestClass;
    }
  }

  return (
    <ul className="flex w-full flex-col items-center gap-4 py-8">
      {posts.map((post) => (
        <Post
          key={post.id}
          className={clsx("border-2", getClassName(post.id))}
          {...post}
        >
          <div className="flex items-center gap-8 px-6">
            {post.id === mostLikedPost?.id && (
              <h1 className="flex items-center gap-2 font-bold text-amber-600">
                <Crown />
                Most Liked
              </h1>
            )}

            {post.id === leastLikedPost?.id && (
              <h1 className="flex items-center gap-2 font-bold text-red-600">
                <HeartCrack />
                Least Liked
              </h1>
            )}

            {post.id === newestPost?.id && (
              <h1 className="flex items-center gap-2 font-bold text-green-600">
                <CalendarArrowUp />
                Newest
              </h1>
            )}

            {post.id === oldestPost?.id && (
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
