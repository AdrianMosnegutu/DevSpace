import Post from "@/components/post";
import { mockPosts } from "common";

export default function HomePage() {
  return (
    <ul className="m-auto">
      {mockPosts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </ul>
  );
}
