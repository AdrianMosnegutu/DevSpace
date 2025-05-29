import { TPost } from "@/common";
import { timeSince } from "@/lib/utils";
import { CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import PostOptions from "./post-options";

export default function PostHeader(post: TPost) {
  const { title, publishedAt, user } = post;

  return (
    <CardHeader className="space-y-4 p-6">
      {/* Top bar with author info and options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Posted by {user.username}
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <time
            dateTime={publishedAt.toUTCString()}
            className="text-sm text-muted-foreground"
          >
            {timeSince(publishedAt)}
          </time>
        </div>
        <PostOptions {...post} />
      </div>

      <Separator />

      {/* Post title */}
      <h2 className="text-2xl font-bold">{title}</h2>
    </CardHeader>
  );
}
