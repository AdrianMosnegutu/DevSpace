"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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
import { TPost } from "common";
import { useMemo } from "react";

interface Props {
  posts: TPost[];
}

const chartColors: string[] = [
  "hsl(0, 70%, 60%)", // Soft Red
  "hsl(120, 60%, 40%)", // Muted Green
  "hsl(240, 70%, 70%)", // Light Blue
  "hsl(45, 80%, 60%)", // Muted Gold
  "hsl(300, 60%, 50%)", // Dusty Purple
  "hsl(180, 60%, 50%)", // Teal
  "hsl(30, 80%, 65%)", // Peach
  "hsl(270, 60%, 60%)", // Lavender
  "hsl(90, 60%, 50%)", // Sage Green
  "hsl(330, 70%, 60%)", // Rosy Pink
];

export default function PostTagsChart({ posts }: Props) {
  // Count occurrences of each tag
  const tagCounts: { [key: string]: number } = {};
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Sort tags by popularity
  const sortedTags = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([tag]) => tag);

  // Select top 5 tags and group the rest as "Other"
  const topTags = sortedTags.slice(0, 9);
  const otherTags = sortedTags.slice(9);

  const chartData = topTags.map((tag, index) => ({
    name: tag,
    count: tagCounts[tag],
    fill: chartColors[index],
  }));

  // Sum up the counts of the remaining tags
  const otherCount = otherTags.reduce((sum, tag) => sum + tagCounts[tag], 0);
  if (otherCount > 0) {
    chartData.push({
      name: "other",
      count: otherCount,
      fill: chartColors[chartColors.length - 1],
    });
  }

  // Generate ChartConfig dynamically
  const chartConfig: ChartConfig = chartData.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: item.fill,
    };
    return config;
  }, {} as ChartConfig);

  // Calculate total number of posts
  const totalPosts = useMemo(
    () => chartData.reduce((acc, item) => acc + item.count, 0),
    [chartData],
  );

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top tags distribution</CardTitle>
        <CardDescription>
          Showing top tag distribution across all posts.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalPosts.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Tags
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
