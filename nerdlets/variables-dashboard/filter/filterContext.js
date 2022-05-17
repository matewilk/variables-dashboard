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

  const cluster =
    appliedFilter.cluster && !isEmpty(appliedFilter.cluster)
      ? `clusterName IN (${appliedFilter.cluster
          .map((cluster) => `'${cluster.value}'`)
          .join(", ")})`
      : "";

  const service =
    appliedFilter.service && !isEmpty(appliedFilter.service)
      ? `label.app = ${appliedFilter.service.value}`
      : "";

  const facetByCluster =
    appliedFilter.facetbycluster && !isEmpty(appliedFilter.facetbycluster)
      ? `FACET clusterName`
      : "";

  const since =
    appliedFilter.since && !isEmpty(appliedFilter.since)
      ? `SINCE ${appliedFilter.since.value} AGO`
      : "";

  const timeseries =
    appliedFilter.timeseries && !isEmpty(appliedFilter.timeseries)
      ? `TIMESERIES ${appliedFilter.timeseries.value}`
      : "TIMESERIES";

  return {
    shouldFilter,
    cluster,
    service,
    facetByCluster,
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
