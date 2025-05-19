import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { serverCreateComment, serverUpdateComment } from "@/lib/services/comment-service";
import { useState } from "react";

interface CommentFormProps {
  postId?: string;
  commentId?: string;
  initialBody?: string;
  onCancel: () => void;
  onSuccess: (body: string) => void;
}

export function CommentForm({
  postId,
  commentId,
  initialBody = "",
  onCancel,
  onSuccess,
}: CommentFormProps) {
  const [body, setBody] = useState(initialBody);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    try {
      if (commentId) {
        // Update existing comment
        await serverUpdateComment(commentId, { body });
      } else if (postId) {
        // Create new comment
        await serverCreateComment({ body, postId });
      }
      onSuccess(body);
    } catch (error) {
      console.error("Error saving comment:", error);
      alert("Failed to save comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your comment..."
            className="min-h-[100px]"
            required
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !body.trim()}>
            {isSubmitting ? "Saving..." : commentId ? "Update" : "Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 