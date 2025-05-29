'use client';

import { TPost } from "@/common";
import PostForm from "@/components/forms/post-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { serverDeletePost, serverVotePost } from "@/lib/services/post-service";
import { timeSince } from "@/lib/utils";
import { Pencil, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PostContentProps {
  post: TPost;
  onDelete?: () => void;
}

export default function PostContent({ post, onDelete }: PostContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [postBody, setPostBody] = useState(post.body);
  const [votes, setVotes] = useState(post.upvotes);
  const { user, isAuthenticated } = useAuth();
  const isAuthor = user?.id === post.userId;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await serverDeletePost(post.id);
      onDelete?.();
    }
  };

  const handleVote = async (value: number) => {
    if (!isAuthenticated) {
      alert("Please log in to vote on posts");
      return;
    }
    await serverVotePost(post.id, value);
    setVotes(prev => prev + value);
  };

  if (isEditing) {
    return (
      <PostForm
        initialBody={postBody}
        postId={post.id}
        onCancel={() => setIsEditing(false)}
        onSuccess={(newBody) => {
          setPostBody(newBody);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-gray-500">
              Posted {timeSince(new Date(post.publishedAt))}
            </p>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
        <p className="text-base whitespace-pre-wrap">{postBody}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote(1)}
            className="flex items-center gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{votes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote(-1)}
            className="flex items-center gap-1"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Back to posts
        </Link>
      </CardFooter>
    </Card>
  );
} 