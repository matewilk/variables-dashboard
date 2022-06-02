import React, { createContext, useContext, useState, useMemo } from "react";
import { timeRangeToNrql } from "@newrelic/nr1-community";

const isEmpty = (object) => {
  return Object.keys(object).length === 0;
};

const FilterContext = createContext();

export const usePlatformState = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("usePlatformState must be used with a FilterProvider");
  }

  const { platformState } = context;

  const timeRangePlatformState = timeRangeToNrql(platformState);
  return {
    timeRangePlatformState,
  };
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used with a FilterProvider");
  }
  const { filter, setFilter, appliedFilter, setAppliedFilter } = context;

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

  const { appliedFilter } = context;

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

  const timeseries =
    appliedFilter.timeseries && !isEmpty(appliedFilter.timeseries)
      ? `TIMESERIES ${appliedFilter.timeseries.value}`
      : "TIMESERIES";

  return {
    shouldFilter,
    cluster,
    service,
    facetByCluster,
    timeseries,
  };
};

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
