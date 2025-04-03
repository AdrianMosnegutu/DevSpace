import Post from "@/components/post";
import { fetchPosts } from "@/lib/services/post-service";

export default async function HomePage() {
  const posts = await fetchPosts();

  return (
    <ul className="flex w-full flex-col items-center gap-4">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </ul>
  );
}
