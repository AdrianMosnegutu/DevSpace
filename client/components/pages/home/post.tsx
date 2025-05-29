import { TPost } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { serverDeletePost, serverVotePost } from "@/lib/services/post-service";
import { timeSince } from "@/lib/utils";
import { Pencil, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PostForm } from "./post-form";

interface PostProps extends TPost {
  onDelete?: () => void;
}

export default function Post({ id, title, body, upvotes, publishedAt, userId, onDelete }: PostProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [postTitle, setPostTitle] = useState(title);
  const [postBody, setPostBody] = useState(body);
  const [votes, setVotes] = useState(upvotes);
  const { user, isAuthenticated } = useAuth();
  const isAuthor = user?.id === userId;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await serverDeletePost(id);
      onDelete?.();
    }
  };

  const handleVote = async (value: number) => {
    if (!isAuthenticated) {
      alert("Please log in to vote on posts");
      return;
    }
    await serverVotePost(id, value);
    setVotes(prev => prev + value);
  };

  if (isEditing) {
    return (
      <PostForm
        initialTitle={postTitle}
        initialBody={postBody}
        postId={id}
        onCancel={() => setIsEditing(false)}
        onSuccess={(newTitle, newBody) => {
          setPostTitle(newTitle);
          setPostBody(newBody);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <Link href={`/posts/${id}`} className="hover:underline">
          <h2 className="text-xl font-semibold">{postTitle}</h2>
        </Link>
        <p className="text-sm text-gray-500">
          {timeSince(new Date(publishedAt))}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-base">{postBody}</p>
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
      </CardFooter>
    </Card>
  );
} 