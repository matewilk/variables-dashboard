import React, { createContext, useContext, useState, useMemo } from "react";

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used with a FilterProvider");
  }
  return context;
};

export const FilterProvider = (props) => {
  const [filter, setFilter] = useState({});
  const value = useMemo(() => [filter, setFilter], [filter]);
  return <FilterContext.Provider value={value} {...props} />;
};
