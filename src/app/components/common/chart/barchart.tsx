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

}

export const BarChart: React.FC<ChartProps> = ({ data, options }) => {
  return (
    <Chart
      chartType="Bar"
      data={data}
      options={options}
    />
  );
};
