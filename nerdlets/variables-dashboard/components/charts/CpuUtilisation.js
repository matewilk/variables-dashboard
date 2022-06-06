import React from "react";
import { LineChart, NrqlQuery } from "nr1";

import { Gauge } from "./Gauge";
import { accountIds, pollInterval } from "../../constants";
import { QueryTextbox } from "../QueryTextbox";
import { useQuery, usePlatformState } from "../../filter/hooks";
import { chartsStyle, chartInnerStyle, chartErrorStyle } from "./styles";

const cpuUtilisationInner = (
  { service, cluster, timeRangePlatformState, gauge = false } = {
    service,
    cluster,
  }
) => `
  FROM K8sContainerSample
  SELECT sum(cpuUsedCores) / sum(cpuRequestedCores) AS ${
    gauge ? `results` : `cpuUtilisation`
  }
  ${!!service ? `WHERE ${service}` : ``}
  ${!!cluster ? (!!service ? `AND ${cluster}` : `WHERE ${cluster}`) : ``}
  ${gauge ? timeRangePlatformState : ``}
`;

const cpuUtilisationQuery = ({
  timeseries,
  facetByCluster,
  service,
  cluster,
  timeRangePlatformState,
}) => `
  SELECT 
    min(cpuUtilisation) AS min, 
    max(cpuUtilisation) AS max, 
    average(cpuUtilisation) AS average
  FROM (
    ${cpuUtilisationInner({ cluster, service })}
    ${facetByCluster} TIMESERIES MAX
  ) ${facetByCluster}
  ${timeseries} ${timeRangePlatformState}
`;

export const CpuUtilisation = () => {
  const { cluster, service, facetByCluster, timeseries } = useQuery({});
  const { timeRangePlatformState } = usePlatformState();

  const gauge = true;
  const gaugeQuery = cpuUtilisationInner({
    service,
    cluster,
    gauge,
    timeRangePlatformState,
  });

  const query = cpuUtilisationQuery({
    timeseries,
    facetByCluster,
    service,
    cluster,
    timeRangePlatformState,
  });

  return (
    <div style={chartsStyle}>
      AVG CPU Utilisation
      <QueryTextbox query={gaugeQuery} />
      <NrqlQuery
        pollInterval={pollInterval}
        accountIds={accountIds}
        query={gaugeQuery}
      >
        {({ data, error }) => {
          if (error) {
            console.error(error);
          }
          return (
            <>
              <Gauge data={data} title="AVG CPU" />
            </>
          );
        }}
      </NrqlQuery>
      CPU Utilisation Timeseries
      <QueryTextbox query={query} />
      <NrqlQuery
        pollInterval={pollInterval}
        accountIds={accountIds}
        query={query}
      >
        {({ data, error }) => {
          return (
            <div style={chartInnerStyle}>
              {error ? <div style={chartErrorStyle}>{error.message}</div> : ""}
              <LineChart fullWidth data={data} />
            </div>
          );
        }}
      </NrqlQuery>
    </div>
  );
};
