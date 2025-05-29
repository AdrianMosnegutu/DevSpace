import CommentsList from "@/components/comment/comments-list";
import PostContent from "@/components/pages/posts/post-content";
import { serverGetPost } from "@/lib/services/post-service";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await serverGetPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <PostContent post={post} />
      <div className="mt-8">
        <CommentsList postId={post.id} />
      </div>
    </div>
  );
} 