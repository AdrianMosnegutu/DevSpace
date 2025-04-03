import { TPost } from "common";
import { Card } from "../ui/card";
import clsx from "clsx";
import { ReactNode } from "react";

type Props = TPost & {
  className?: string;
  children: ReactNode;
};

export default function Post({ className, children }: Props) {
  return (
    <li className="w-full">
      <Card className={clsx(className)}>{children}</Card>
    </li>
  );
}
