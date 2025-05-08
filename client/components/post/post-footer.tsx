"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { errorToast } from "@/lib/toasts";
import { TPost } from "common";
import { useState } from "react";
import { serverLikePost, serverUnlikePost } from "@/lib/services/post-service";
import clsx from "clsx";
import { formatNumber } from "@/lib/utils";
import { usePosts } from "@/contexts/posts-context";

export default function PostFooter({ id, likes }: TPost) {
  const { setPosts } = usePosts();

  const [isPostLiked, setIsPostLiked] = useState<boolean>(false);
  const [clientLikes, setClientLikes] = useState<number>(likes);

  async function vote(liked: boolean) {
    if (liked) {
      await serverLikePost(id);
    } else {
      await serverUnlikePost(id);
    }

    const likeValue = liked ? 1 : -1;
    setIsPostLiked(liked);
    setClientLikes((prev) => prev + likeValue);

    setPosts((posts) =>
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + likeValue } : post,
      ),
    );
  }

  async function handleToggleLike() {
    try {
      await vote(!isPostLiked);
    } catch (error) {
      errorToast(`Could not ${isPostLiked ? "unlike" : "like"} post`, error);
    }
  }

  return (
    <CardFooter>
      {/* Likes */}
      <Button variant="ghost" className="group" onClick={handleToggleLike}>
        <Heart
          fill={isPostLiked ? "#fb2c36" : "none"}
          className={clsx(
            "transition-colors ease-out",
            isPostLiked ? "stroke-red-500" : "group-hover:stroke-red-500",
          )}
        />

        <span
          className={clsx(
            "font-normal",
            isPostLiked && "!font-bold text-red-500",
          )}
        >
          {formatNumber(clientLikes)}
        </span>
      </Button>
    </CardFooter>
  );
}
