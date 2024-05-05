import React, { useState } from "react";
import {
  GoogleChartEditor,
  GoogleChartWrapper,
  GoogleViz,
  Chart,
} from "react-google-charts";

export interface EditableChartProps {
  data: (string | number)[][];
  options: {
    title: string;
    hAxis: {
      title: string;
      minValue: number;
      maxValue: number;
    };
    vAxis: {
      title: string;
      minValue: number;
      maxValue: number;
    };
    legend: string;
  };
}

export const EditableChart: React.FC<EditableChartProps> = ({ data, options }) => {
  const [chartEditor, setChartEditor] = useState<GoogleChartEditor>();
  const [chartWrapper, setChartWrapper] = useState<GoogleChartWrapper>();
  const [google, setGoogle] = useState<GoogleViz>();

  const onEditClick = () => {
    if (!chartWrapper || !google || !chartEditor) {
      return;
    }

    chartEditor.openDialog(chartWrapper);

    google.visualization.events.addListener(chartEditor, "ok", () => {
      const newChartWrapper = chartEditor.getChartWrapper();

      newChartWrapper.draw();

      const newChartOptions = newChartWrapper.getOptions();
      const newChartType = newChartWrapper.getChartType();

      console.log("Chart type changed to ", newChartType);
      console.log("Chart options changed to ", newChartOptions);
    });
  };

  return (
    <>
      <button className="btn btn-success" onClick={onEditClick}>Edit Chart</button>
      <Chart
        chartType="BarChart"
        width="100%"
        height="200px"
        data={data}
        options={options}
        chartPackages={["corechart", "controls", "charteditor"]}
        getChartEditor={({ chartEditor, chartWrapper, google }) => {
          setChartEditor(chartEditor);
          setChartWrapper(chartWrapper);
          setGoogle(google);
        }}
      />
    </>
  );
};
