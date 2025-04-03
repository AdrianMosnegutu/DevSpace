import CreatePostDialog from "@/components/dialogs/create-post-dialog";
import PostsList from "@/components/page/posts-list";
import { PostProvider } from "@/contexts/posts-context";
import { serverGetPosts } from "@/lib/services/post-service";

export default async function HomePage() {
  const posts = await serverGetPosts();

  return (
    <PostProvider posts={posts}>
      <CreatePostDialog />
      <PostsList />
    </PostProvider>
  );
}
