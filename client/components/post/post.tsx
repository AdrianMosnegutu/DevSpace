import { TPostResponse } from "common";
import { Card } from "../ui/card";
import PostHeader from "./post-header";
import PostContent from "./post-content";
import PostFooter from "./post-footer";

export default function Post(post: TPostResponse) {
  return (
    <Card className="max-w-4xl w-full">
      <PostHeader {...post} />
      <PostContent {...post} />
      <PostFooter {...post} />
    </Card>
  );
}
