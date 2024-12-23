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
    color: "#2563eb",
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
        <CartesianGrid vertical={false} className="stroke-black" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar dataKey="value" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default SalesChart;
