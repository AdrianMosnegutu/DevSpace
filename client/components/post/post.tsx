import { TPost } from "common";
import { Card } from "../ui/card";
import PostHeader from "./post-header";
import PostContent from "./post-content";
import PostFooter from "./post-footer";

export default function Post(post: TPost) {
  return (
    <li className="w-full max-w-4xl">
      <Card>
        <PostHeader {...post} />
        <PostContent {...post} />
        <PostFooter {...post} />
      </Card>
    </li>
  );
}
