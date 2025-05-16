import { CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { TPost } from "@/common";

export default function PostContent({ body, postTags }: TPost) {
  return (
    <CardContent className="flex flex-col gap-8">
      {/* Post text body */}
      <p className="truncate whitespace-pre-line">{body}</p>

      {/* List of all associated topics */}
      {postTags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {postTags.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </ul>
      )}
    </CardContent>
  );
}
