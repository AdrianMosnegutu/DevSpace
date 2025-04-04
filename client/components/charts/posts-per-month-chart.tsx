"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TPost } from "common";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const now = new Date();

const last12Months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
  return {
    label: `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`,
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}).reverse();

const chartConfig = {
  posts: { label: "Posts" },
} satisfies ChartConfig;

interface Props {
  posts: TPost[];
}

export default function PostsPerMonthChart({ posts }: Props) {
  const chartData = last12Months.map(({ label, year, month }) => ({
    month: label,
    posts: posts.filter(
      (post) =>
        post.date.getMonth() === month && post.date.getFullYear() === year,
    ).length,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total volume of posts</CardTitle>
        <CardDescription>
          Showing total number of posts uploaded in the last 12 months.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="posts" fill="var(--color-chart-1)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
