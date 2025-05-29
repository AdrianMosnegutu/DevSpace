"use client";

import { TComment } from "@/common";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { serverGetCommentsForPost } from "@/lib/services/comment-service";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Comment from "./comment";
import { CommentForm } from "./comment-form";

interface CommentsListProps {
  postId: string;
}

export default function CommentsList({ postId }: CommentsListProps) {
  const [comments, setComments] = useState<TComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "mostVoted">(
    "newest",
  );
  const { isAuthenticated } = useAuth();

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const comments = await serverGetCommentsForPost(postId);
      setComments(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleCommentAdded = () => {
    fetchComments();
  };

  const handleCommentDeleted = () => {
    fetchComments();
  };

  const filteredComments = comments.filter((comment) =>
    comment.body.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedComments = [...filteredComments].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        );
      case "mostVoted":
        return b.upvotes - a.upvotes;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="text"
          placeholder="Search comments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              {sortOrder === "newest" && "Newest first"}
              {sortOrder === "oldest" && "Oldest first"}
              {sortOrder === "mostVoted" && "Most voted"}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOrder("newest")}>
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
              Oldest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("mostVoted")}>
              Most voted
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isAuthenticated ? (
        <CommentForm
          postId={postId}
          onSuccess={handleCommentAdded}
          onCancel={() => { }}
        />
      ) : (
        <div className="text-center text-muted-foreground py-4">
          Please log in to leave a comment
        </div>
      )}

      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <Comment
            key={comment.id}
            {...comment}
            onDelete={handleCommentDeleted}
          />
        ))}
      </div>
    </div>
  );
}
