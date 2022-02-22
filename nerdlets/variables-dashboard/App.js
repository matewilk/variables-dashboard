import React, { useState } from "react";
import { nerdlet } from "nr1";

import { FilterForm } from "./components/FilterForm";
import { TableCharts } from "./components/TableCharts";
import { BartCharts } from "./components/BarCharts";
import { TimeseriesCharts } from "./components/TimeseriesCharts";
import { FilterProvider } from "./filter/filterContext";
import { GaugeCharts } from "./components/GaugeCharts";

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
            gap: "10px",
            width: "98%",
          }}
        >
          <TableCharts />
          <TimeseriesCharts />
          <BartCharts />
          <GaugeCharts />
        </div>
      </div>
    </FilterProvider>
  );
};
