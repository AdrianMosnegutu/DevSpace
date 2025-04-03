"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { errorToast, formatNumber } from "@/lib/utils";
import { TPostResponse } from "common";
import { useState } from "react";
import { likePost, unlikePost } from "@/lib/services/post-service";
import clsx from "clsx";

export default function PostFooter({ id, likes }: TPostResponse) {
  const [isPostLiked, setIsPostLiked] = useState<boolean>(false);
  const [clientLikes, setClientLikes] = useState<number>(likes);

  async function handleLike() {
    if (isPostLiked) {
      try {
        await unlikePost(id);
        setIsPostLiked(false);
        setClientLikes((prev) => prev - 1);
      } catch (error) {
        errorToast("Could not unlike post", error);
      }
    } else {
      try {
        await likePost(id);
        setIsPostLiked(true);
        setClientLikes((prev) => prev + 1);
      } catch (error) {
        errorToast("Could not like post", error);
      }
    }
  }

  return (
    <CardFooter>
      {/* Likes */}
      <Button variant="ghost" className="group" onClick={handleLike}>
        <Heart
          fill={isPostLiked ? "#fb2c36" : "none"}
          className={clsx(
            "transition-colors ease-out",
            isPostLiked ? "stroke-red-500" : "group-hover:stroke-red-500",
          )}
        />

        <span className={clsx(isPostLiked && "font-bold text-red-500")}>
          {formatNumber(clientLikes)}
        </span>
      </Button>
    </CardFooter>
  );
}
