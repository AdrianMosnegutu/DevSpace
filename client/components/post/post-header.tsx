import { timeSince } from "@/lib/utils";
import { CardHeader } from "../ui/card";
import PostOptions from "./post-options";
import { TPostResponse } from "common";

export default function PostHeader({ id, title, date }: TPostResponse) {
  return (
    <CardHeader className="flex items-center gap-4">
      {/* Post title */}
      <h2 className="mr-auto text-3xl font-bold">{title}</h2>

      {/* Time since the post is live */}
      <time dateTime={date} className="text-muted-foreground">
        {timeSince(new Date(date))}
      </time>

      {/* Button to open the options menu for the selected post */}
      <PostOptions postId={id} />
    </CardHeader>
  );
}
