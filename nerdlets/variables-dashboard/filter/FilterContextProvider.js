import React, { createContext, useState, useMemo } from "react";

export const FilterContext = createContext();

export const FilterProvider = (props) => {
  const { platformState } = props;
  const [filter, setFilter] = useState({});
  const [appliedFilter, setAppliedFilter] = useState({});
  const value = useMemo(
    () => ({
      filter,
      setFilter,
      appliedFilter,
      setAppliedFilter,
      platformState,
    }),
    [filter, appliedFilter, platformState]
  );

  return <FilterContext.Provider value={value} {...props} />;
};
