import React from "react";
import { Chart } from "react-google-charts";

export interface ChartProps {
  data: (string | number)[][];

  options: {
    chart: {
      title: string;
      subtitle: string;
    };

  };
  width: string;
  height: string;
}

export const BarChart: React.FC<ChartProps> = ({ data, options, width, height }) => {
  return (
    <Chart
      chartType="Bar"
      width={width}
      height={height}
      data={data}
      options={options}
    />
  );
};
