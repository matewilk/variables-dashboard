import React from "react";
import { PlatformStateContext } from "nr1";

import { FilterProvider } from "./filter/filterContext";
import { FilterForm } from "./components/FilterForm";

import { CpuUtilisation } from "./components/charts/CpuUtilisation";
import { MemoryUtilisation } from "./components/charts/MemoryUtilisation";
import { IncidentsChart } from "./components/charts/IncidentsChart";

const appLayoutStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
};

const chartsAreaLayoutStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  width: "98%",
};

export const App = () => {
  return (
    <PlatformStateContext>
      {(PlatformState) => {
        return (
          <FilterProvider platformState={PlatformState}>
            <div style={appLayoutStyles}>
              <FilterForm />
              <div style={chartsAreaLayoutStyles}>
                <CpuUtilisation />
                <MemoryUtilisation />
                <IncidentsChart />
              </div>
            </div>
          </FilterProvider>
        );
      }}
    </PlatformStateContext>
  );
};
