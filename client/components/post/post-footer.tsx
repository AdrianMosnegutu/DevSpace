"use client";

import { TPost } from "@/common";
import { usePosts } from "@/contexts/posts-context";
import { serverVotePost } from "@/lib/services/post-service";
import { errorToast } from "@/lib/toasts";
import { formatNumber } from "@/lib/utils";
import clsx from "clsx";
import { ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
import { useState } from "react";
import CommentsList from "../comment/comments-list";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";

export default function PostFooter({ id, upvotes }: TPost) {
  const { setPosts } = usePosts();
  const [userPostVote, setUserPostVote] = useState<number>(0);
  const [clientVotes, setClientVotes] = useState<number>(upvotes);
  const [showComments, setShowComments] = useState(false);

  async function vote(value: -1 | 1) {
    const prev = userPostVote;

    try {
      if (userPostVote == value) {
        value *= -1;
        setUserPostVote(0);
      } else if (userPostVote != 0) {
        setUserPostVote(value);
        value *= 2;
      } else {
        setUserPostVote(value);
      }

      await serverVotePost(id, value);

      setClientVotes((prev) => prev + value);

      setPosts((posts) =>
        posts.map((post) =>
          post.id === id ? { ...post, upvotes: post.upvotes + value } : post,
        ),
      );
    } catch (err) {
      setUserPostVote(prev);
      errorToast("Could not vote post!", err);
    }
  }

  return (
    <>
      <CardFooter className="gap-4">
        <div className="bg-white/5 flex items-center align-middle rounded-md">
          <Button
            variant="ghost"
            className="rounded-full cursor-pointer aspect-square p-0"
            onClick={() => vote(1)}
          >
            <ArrowBigUp
              size={48}
              className={clsx(
                "transition-colors ease-out",
                userPostVote == 1
                  ? "stroke-green-500"
                  : "group-hover:stroke-green-500",
              )}
            />
          </Button>

          <span
            className={clsx(
              "font-normal",
              userPostVote < 0 && "!font-bold text-red-500",
              userPostVote > 0 && "!font-bold text-green-500",
            )}
          >
            {formatNumber(clientVotes)}
          </span>

          <Button
            variant="ghost"
            className="rounded-full cursor-pointer aspect-square p-0"
            onClick={() => vote(-1)}
          >
            <ArrowBigDown
              size={48}
              className={clsx(
                "transition-colors ease-out",
                userPostVote == -1
                  ? "stroke-red-500"
                  : "group-hover:stroke-red-500",
              )}
            />
          </Button>
        </div>

        <div className="bg-white/5 flex items-center align-middle rounded-md">
          <Button
            variant="ghost"
            className="rounded-full cursor-pointer aspect-square p-0"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className={clsx(showComments && "fill-current")} />
          </Button>
        </div>
      </CardFooter>

      {showComments && <CommentsList postId={id} />}
    </>
  );
}
