import CreatePostDialog from "@/components/dialogs/create-post-dialog";
import PostsList from "@/components/page/posts-list";
import SearchBar from "@/components/page/search-bar";
import { PostProvider } from "@/contexts/posts-context";
import { serverGetPosts } from "@/lib/services/post-service";

export default async function HomePage() {
  const posts = await serverGetPosts();

  return (
    <PostProvider posts={posts}>
      <CreatePostDialog />
      <div className="m-auto flex max-w-4xl flex-col items-center">
        <SearchBar />
        <PostsList />
      </div>
    </PostProvider>
  );
}
