import { X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Props {
  tags: string[];
  handleRemoveTag: (tag: string) => void;
}

export default function RemovableTagsList({ tags, handleRemoveTag }: Props) {
  return (
    tags.length > 0 && (
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index}>
            {tag}
            <Button
              className="!h-fit !p-[1px]"
              type="button"
              onClick={() => handleRemoveTag(tag)}
            >
              <X />
            </Button>
          </Badge>
        ))}
      </ul>
    )
  );
}
