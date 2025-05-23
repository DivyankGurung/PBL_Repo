"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts";

interface DashboardBarChartProps {
  chartData: Array<Record<string, any>>;
  chartConfig: ChartConfig;
}

export function DashboardBarChart({ chartData, chartConfig }: DashboardBarChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="requests" fill="var(--color-requests)" radius={4} />
          <Bar dataKey="resolved" fill="var(--color-resolved)" radius={4} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
