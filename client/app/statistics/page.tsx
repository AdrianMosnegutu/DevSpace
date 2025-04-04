import PostInteractionsPerMonth from "@/components/charts/post-interactions-per-month";
import PostTagsChart from "@/components/charts/post-tags-chart";
import PostsPerMonthChart from "@/components/charts/posts-per-month-chart";
import { serverGetPosts } from "@/lib/services/post-service";

export default async function StatisticsPage() {
  const posts = await serverGetPosts();

  return (
    <div className="m-auto flex flex-wrap max-w-3xl py-8 space-y-4">
      <PostsPerMonthChart posts={posts} />
      <PostTagsChart posts={posts} />
      <PostInteractionsPerMonth posts={posts} />
    </div>
  );
}
