import CreatePostDialog from "@/components/dialogs/create-post-dialog";
import { PostsList, SearchBar } from "@/components/pages/home";
import { PostProvider } from "@/contexts/posts-context";
import { serverGetPostsOrderedDateAscending } from "@/lib/services/post-service";

export default async function HomePage() {
  const posts = await serverGetPostsOrderedDateAscending();

  return (
    <PostProvider posts={posts}>
      <CreatePostDialog />

      <div className="flex">
        <div className="m-auto w-3/5 flex max-w-4xl flex-col items-center py-8">
          <SearchBar />
          <PostsList />
        </div>
      </div>
    </PostProvider>
  );
}
