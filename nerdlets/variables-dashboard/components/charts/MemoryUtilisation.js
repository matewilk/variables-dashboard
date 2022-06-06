import React from "react";
import { LineChart, NrqlQuery } from "nr1";

import { Gauge } from "./Gauge";
import { accountIds, pollInterval } from "../../constants";
import { QueryTextbox } from "../QueryTextbox";
import { useQuery, usePlatformState } from "../../filter/hooks";
import { chartsStyle, chartInnerStyle, chartErrorStyle } from "./styles";

const memoryUtilisationInner = (
  { service, cluster, timeRangePlatformState, gauge = false } = {
    service,
    cluster,
  }
) => `
  FROM K8sContainerSample
  SELECT sum(memoryWorkingSetBytes) / sum(memoryRequestedBytes) AS ${
    gauge ? `results` : `memoryUtilisation`
  }
  ${!!service ? `WHERE ${service}` : ``}
  ${!!cluster ? (!!service ? `AND ${cluster}` : `WHERE ${cluster}`) : ``}
  ${gauge ? timeRangePlatformState : ``}
`;

const memoryUtilisationQuery = ({
  timeseries,
  facetByCluster,
  service,
  cluster,
  timeRangePlatformState,
}) => `
  SELECT 
    min(memoryUtilisation) AS min, 
    max(memoryUtilisation) AS max, 
    average(memoryUtilisation) AS average
  FROM (
    ${memoryUtilisationInner({ cluster, service })}
    ${facetByCluster} TIMESERIES MAX
  ) ${facetByCluster}
  ${timeseries} ${timeRangePlatformState}
`;

export const MemoryUtilisation = () => {
  const { cluster, service, facetByCluster, timeseries } = useQuery({});
  const { timeRangePlatformState } = usePlatformState();

  const gauge = true;
  const gaugeQuery = memoryUtilisationInner({
    service,
    cluster,
    gauge,
    timeRangePlatformState,
  });

  const query = memoryUtilisationQuery({
    timeseries,
    facetByCluster,
    service,
    cluster,
    timeRangePlatformState,
  });

  return (
    <div style={chartsStyle}>
      AVG Memory Utilisation
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
              <Gauge data={data} title="AVG Mem" />
            </>
          );
        }}
      </NrqlQuery>
      Memory Utilisation Timeseries
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
