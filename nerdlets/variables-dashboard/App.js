import React, { useState } from "react";
import { nerdlet } from "nr1";

import { FilterForm } from "./components/FilterForm";
import { Charts } from "./components/Charts";
import { TimeseriesCharts } from "./components/TimeseriesCharts";
import { FilterProvider } from "./filter/filterContext";

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
          <Charts />
          <TimeseriesCharts />
        </div>
      </div>
    </FilterProvider>
  );
};
