import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FC } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

interface SalesChartProps {
  monthlyChart: { month: string; value: number }[];
}

const SalesChart: FC<SalesChartProps> = ({ monthlyChart }) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] h-full w-full py-8">
      <BarChart accessibilityLayer data={monthlyChart}>
        <CartesianGrid
          vertical={false}
          className="stroke-gray-200"
          strokeDasharray="5 5"
        />
        <ChartTooltip
          cursor={{ fill: "#f3f4f6" }}
          content={<ChartTooltipContent />}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={12}
          axisLine={false}
          tick={{ fill: "#6b7280" }}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar
          dataKey="value"
          fill="var(--color-desktop)"
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default SalesChart;
