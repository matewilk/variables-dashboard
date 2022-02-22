import React, { createContext, useContext, useState, useMemo } from "react";

const isEmpty = (object) => {
  return Object.keys(object).length === 0;
};

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used with a FilterProvider");
  }
  const [filter, setFilter, appliedFilter, setAppliedFilter] = context;

  return {
    filter,
    setFilter,
    appliedFilter,
    setAppliedFilter,
  };
};

export const useQuery = ({ defaultAttrs = "*" } = {}) => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useQuery must be used with a FilterProvider");
  }

  const [_, __, appliedFilter] = context;

  const shouldFilter = !isEmpty(appliedFilter);

  const attrs =
    appliedFilter.parameter && appliedFilter.parameter.length
      ? appliedFilter.parameter.map((parameter) => {
          const func =
            !appliedFilter.function || isEmpty(appliedFilter.function)
              ? ""
              : appliedFilter.function.value;
          return `${func}(${parameter.value})`;
        })
      : defaultAttrs;
  const attributes = Array.isArray(attrs) ? attrs.join(", ") : attrs;

  const facet =
    appliedFilter.facet &&
    Array.isArray(appliedFilter.facet) &&
    appliedFilter.facet.length
      ? `FACET ${appliedFilter.facet.map((facet) => facet.value).join(", ")}`
      : "";

  const since =
    appliedFilter.since && !isEmpty(appliedFilter.since)
      ? `SINCE ${appliedFilter.since.value} minutes ago`
      : "";

  const timeseries =
    appliedFilter.timeseries && !isEmpty(appliedFilter.timeseries)
      ? `TIMESERIES ${appliedFilter.timeseries.value}`
      : "TIMESERIES";

  return {
    shouldFilter,
    attributes,
    facet,
    since,
    timeseries,
  };
};

export const FilterProvider = (props) => {
  const [filter, setFilter] = useState({});
  const [appliedFilter, setAppliedFilter] = useState({});
  const value = useMemo(
    () => [filter, setFilter, appliedFilter, setAppliedFilter],
    [filter, appliedFilter]
  );
  return <FilterContext.Provider value={value} {...props} />;
};
