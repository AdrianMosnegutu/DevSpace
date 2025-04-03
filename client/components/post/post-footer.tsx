"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { errorToast, formatNumber } from "@/lib/utils";
import { TPost } from "common";
import { useState } from "react";
import { serverLikePost, serverUnlikePost } from "@/lib/services/post-service";
import clsx from "clsx";

export default function PostFooter({ id, likes }: TPost) {
  const [isPostLiked, setIsPostLiked] = useState<boolean>(false);
  const [clientLikes, setClientLikes] = useState<number>(likes);

  async function handleLike() {
    if (isPostLiked) {
      try {
        await serverUnlikePost(id);
        setIsPostLiked(false);
        setClientLikes((prev) => prev - 1);
      } catch (error) {
        errorToast("Could not unlike post", error);
      }
    } else {
      try {
        await serverLikePost(id);
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
