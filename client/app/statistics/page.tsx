import PostInteractionsPerMonth from "@/components/charts/post-interactions-per-month";
import PostTagsChart from "@/components/charts/post-tags-chart";
import PostsPerMonthChart from "@/components/charts/posts-per-month-chart";
import {
  serverGetAllPosts,
} from "@/lib/services/post-service";

export default async function StatisticsPage() {
  const posts = await serverGetAllPosts();

  return (
    <div className="m-auto flex max-w-3xl flex-wrap space-y-4 py-8">
      <PostsPerMonthChart posts={posts} />
      <PostTagsChart posts={posts} />
      <PostInteractionsPerMonth posts={posts} />
    </div>
  );
}
