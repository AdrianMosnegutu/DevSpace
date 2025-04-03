import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { toast } from "sonner";

function ToastCloseButton() {
  return (
    <Button
      className="ml-auto"
      variant="ghost"
      size="icon"
      onClick={() => toast.dismiss()}
    >
      <X />
    </Button>
  );
}

export function regularToast(message: string, description?: string) {
  toast(message, {
    description: description,
    descriptionClassName: "!text-neutral-500 shrink-0",
    action: <ToastCloseButton />,
  });
}

export function errorToast(message: string, error: unknown) {
  let description: string;

  if (typeof error === "string") {
    description = error;
  } else if (error instanceof AxiosError && error.response) {
    description = error.response.data as string;
  } else if (error instanceof Error) {
    description = error.message;
  } else {
    description = "An unkown error occured.";
  }

  toast(message, {
    description,
    descriptionClassName: "!text-red-600",
    action: <ToastCloseButton />,
  });
}
