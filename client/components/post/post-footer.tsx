"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { formatNumber } from "@/lib/utils";
import { TPost } from "common";

export default function PostFooter({ likes }: TPost) {
  function handleLike() { }

  return (
    <CardFooter>
      {/* Likes */}
      <Button variant="ghost" onClick={handleLike}>
        <Heart />
        {formatNumber(likes)}
      </Button>
    </CardFooter>
  );
}
