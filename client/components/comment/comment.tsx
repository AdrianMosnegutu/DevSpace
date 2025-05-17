import { TComment } from "@/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { serverDeleteComment, serverVoteComment } from "@/lib/services/comment-service";
import { timeSince } from "@/lib/utils";
import { Pencil, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./comment-form";

interface CommentProps extends TComment {
  onDelete?: () => void;
}

export default function Comment({ id, body, upvotes, publishedAt, onDelete }: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentBody, setCommentBody] = useState(body);
  const [votes, setVotes] = useState(upvotes);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await serverDeleteComment(id);
      onDelete?.();
    }
  };

  const handleVote = async (value: number) => {
    await serverVoteComment(id, value);
    setVotes(prev => prev + value);
  };

  if (isEditing) {
    return (
      <CommentForm
        initialBody={commentBody}
        commentId={id}
        onCancel={() => setIsEditing(false)}
        onSuccess={(newBody) => {
          setCommentBody(newBody);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <p className="text-sm text-gray-500 mb-2">
          {timeSince(new Date(publishedAt))}
        </p>
        <p className="text-base">{commentBody}</p>
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
      </CardFooter>
    </Card>
  );
}
