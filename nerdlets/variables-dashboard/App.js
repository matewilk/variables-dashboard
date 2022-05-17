import React from "react";
import { nerdlet } from "nr1";

import { FilterProvider } from "./filter/filterContext";
import { FilterForm } from "./components/FilterForm";

import { CpuUtilisation } from "./components/charts/CpuUtilisation";
import { MemoryUtilisation } from "./components/charts/MemoryUtilisation";
import { IncidentsChart } from "./components/charts/IncidentsChart";


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
          <CpuUtilisation />
          <MemoryUtilisation />
          <IncidentsChart />
        </div>
      </div>
    </FilterProvider>
  );
};
