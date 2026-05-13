/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useMemo } from "react";
import {
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
interface ChartProps {
  data: { data: any; type: "pie" | "line"; xKey: any; yKey: any };
}
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const Chart = memo(({ data }: ChartProps) => {
  console.log("content", data);

  if (data?.type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={300} className="mb-5">
        <PieChart>
          <Pie
            data={data.data.map((entry: any, index: number) => ({
              ...entry,
              fill: COLORS[index % COLORS.length],
            }))}
            dataKey={data.yKey || "value"}
            nameKey={data.xKey || "name"}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (data?.type === "line") {
    return (
      <ResponsiveContainer width="100%" height={300} className="mb-5">
        <LineChart data={data.data} className="">
          <XAxis dataKey={data.xKey}>
            <Label value={data.xKey} position="insideBottom" offset={-5} />
          </XAxis>
          <YAxis>
            <Label value={data.yKey} angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey={data.yKey} stroke="blue" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
});

Chart.displayName = "Chart";

export default Chart;
