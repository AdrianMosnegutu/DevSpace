import { CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { TPostResponse } from "common";

export default function PostContent({ body, tags }: TPostResponse) {
  return (
    <CardContent className="flex flex-col gap-8">
      {/* Post text body */}
      <p className="truncate whitespace-pre-line">{body}</p>

      {/* List of all associated topics */}
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </ul>
      )}
    </CardContent>
  );
}
