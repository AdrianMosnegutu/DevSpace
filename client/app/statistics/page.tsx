import {
  PostInteractionsPerMonthChart,
  PostsPerMonthChart,
  PostTagsChart,
} from "@/components/charts";
import { serverGetAllPosts } from "@/lib/services/post-service";

export default async function StatisticsPage() {
  const posts = await serverGetAllPosts();

  return (
    <div className="m-auto flex max-w-3xl flex-wrap space-y-4 py-8">
      <PostsPerMonthChart posts={posts} />
      <PostTagsChart posts={posts} />
      <PostInteractionsPerMonthChart posts={posts} />
    </div>
  );
}
