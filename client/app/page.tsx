import PostsList from "@/components/page/posts-list";
import { PostProvider } from "@/contexts/posts-context";
import { serverGetPosts } from "@/lib/services/post-service";

export default async function HomePage() {
  return (
    <PostProvider posts={await serverGetPosts()}>
      <PostsList />
    </PostProvider>
  );
}
