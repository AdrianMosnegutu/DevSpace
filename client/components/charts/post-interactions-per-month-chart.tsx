"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePosts } from "@/contexts/posts-context";

const chartConfig = {
  likes: {
    label: "Likes",
  },
} satisfies ChartConfig;

const now = new Date();

const last12Months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
  return {
    label: `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`,
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}).reverse();

export default function PostInteractionsPerMonthChart() {
  const { posts } = usePosts();

  const chartData = last12Months.map(({ label, month, year }) => {
    const postsInMonth = posts.filter((post) => {
      const postDate = new Date(post.date);
      return postDate.getMonth() === month && postDate.getFullYear() === year;
    });

    const totalLikes = postsInMonth.reduce(
      (acc, post) => acc + (post.likes ?? 0),
      0,
    );

    return {
      month: label,
      likes: totalLikes,
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total user interactions</CardTitle>
        <CardDescription>
          Showing user interactions for the last 12 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="likes"
              type="linear"
              fill="var(--color-chart-2)"
              fillOpacity={0.4}
              stroke="var(--color-chart-2)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
