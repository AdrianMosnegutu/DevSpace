import CreatePostButton from "@/components/pages/home/create-post-button";
import PostsControls from "@/components/pages/home/posts-controls";
import PostsList from "@/components/pages/home/posts-list";
import { PostProvider } from "@/contexts/posts-context";
import { getPosts } from "@/lib/actions/posts";

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <PostProvider posts={posts}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Recent Posts</h1>
          <CreatePostButton />
        </div>
        <PostsControls />
        <PostsList />
      </PostProvider>
    </div>
  );
}
