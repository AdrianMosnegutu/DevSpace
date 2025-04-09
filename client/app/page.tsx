import CreatePostDialog from "@/components/dialogs/create-post-dialog";
import { PostPagination, PostsList, SearchBar } from "@/components/pages/home";
import { PostProvider } from "@/contexts/posts-context";
import { serverGetPostsOrderedDateAscending } from "@/lib/services/post-service";

export default async function HomePage() {
  const posts = await serverGetPostsOrderedDateAscending(0);

  return (
    <PostProvider posts={posts}>
      <CreatePostDialog />

      <div className="m-auto flex max-w-4xl flex-col items-center py-8">
        <SearchBar />
        <PostsList />
        <PostPagination />
      </div>
    </PostProvider>
  );
}
