import {
  PostInteractionsPerMonthChart,
  PostsPerMonthChart,
  PostTagsChart,
} from "@/components/charts";
import CreatePostDialog from "@/components/dialogs/create-post-dialog";
import { PostPagination, PostsList, SearchBar } from "@/components/pages/home";
import { PostProvider } from "@/contexts/posts-context";
import { serverGetPostsOrderedDateAscending } from "@/lib/services/post-service";

export default async function HomePage() {
  const posts = await serverGetPostsOrderedDateAscending(0);

  return (
    <PostProvider posts={posts}>
      <CreatePostDialog />

      <div className="flex">
        <div className="w-2/5">
          <PostsPerMonthChart />
          <PostTagsChart />
          <PostInteractionsPerMonthChart />
        </div>

        <div className="m-auto w-3/5 flex max-w-4xl flex-col items-center py-8">
          <SearchBar />
          <PostsList />
          <PostPagination />
        </div>
      </div>
    </PostProvider>
  );
}
