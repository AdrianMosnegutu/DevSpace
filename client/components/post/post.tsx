import { TPost } from "common";
import { Card } from "../ui/card";
import PostHeader from "./post-header";
import PostContent from "./post-content";
import PostFooter from "./post-footer";

export default function Post(post: TPost) {
  return (
    <Card className="m-auto max-w-4xl">
      <PostHeader {...post} />
      <PostContent {...post} />
      <PostFooter {...post} />
    </Card>
  );
}
