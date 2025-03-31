import clsx from "clsx";
import { FormLabel } from "../ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { TPostSchema } from "@/lib/form-schemas/post-schema";

interface Props {
  label?: string;
  maxLength?: number;
  field: ControllerRenderProps<
    TPostSchema,
    "body" | "title" | "tag" | "tags" | `tags.${number}`
  >;
}

export default function FieldLabel({ label, maxLength, field }: Props) {
  return (
    (label || maxLength) && (
      <FormLabel>
        {label}
        {maxLength && (
          <span
            className={clsx(
              "text-muted-foreground ml-auto text-xs",
              field.value.length > maxLength && "!text-destructive",
            )}
          >
            {field.value.length}/{maxLength}
          </span>
        )}
      </FormLabel>
    )
  );
}
