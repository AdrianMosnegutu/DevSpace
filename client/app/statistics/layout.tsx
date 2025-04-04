import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Statistics",
};

export default function StatisticsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
