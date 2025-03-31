import { timeSince } from "@/lib/utils";
import { CardHeader } from "../ui/card";
import PostOptions from "./post-options";
import { TPost } from "common";

export default function PostHeader({ title, date }: TPost) {
  return (
    <CardHeader className="flex items-center gap-4">
      {/* Post title */}
      <h2 className="mr-auto text-3xl font-bold">{title}</h2>

      {/* Time since the post is live */}
      <time dateTime={date.toISOString()} className="text-muted-foreground">
        {timeSince(date)}
      </time>

      {/* Button to open the options menu for the selected post */}
      <PostOptions />
    </CardHeader>
  );
}
