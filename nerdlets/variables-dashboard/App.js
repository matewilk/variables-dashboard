import React, { useState } from "react";
import { FilterForm } from "./components/FilterForm";
import { Charts } from "./components/Charts";

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
};

export const App = () => {
  const [filter, setFilter] = useState({});
  const [appliedFilter, setAppliedFilter] = useState({});

  return (
    <div style={style}>
      <FilterForm
        filter={filter}
        setFilter={setFilter}
        setAppliedFilter={setAppliedFilter}
      />
      <Charts appliedFilter={appliedFilter} />
    </div>
  );
};
