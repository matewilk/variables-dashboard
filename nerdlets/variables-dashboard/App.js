import React from "react";
import { nerdlet } from "nr1";

import { FilterProvider } from "./filter/filterContext";
import { FilterForm } from "./components/FilterForm";
import { TableCharts } from "./components/charts/TableCharts";
import { BartCharts } from "./components/charts/BarCharts";
import { TimeseriesCharts } from "./components/charts/TimeseriesCharts";
import { GaugeCharts } from "./components/charts/GaugeCharts";

nerdlet.setConfig({
  timePicker: false,
});

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
};

export const App = () => {
  return (
    <FilterProvider>
      <div style={style}>
        <FilterForm />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            width: "98%",
          }}
        >
          <GaugeCharts />
          <TableCharts />
          <TimeseriesCharts />
          <BartCharts />
        </div>
      </div>
    </FilterProvider>
  );
};
