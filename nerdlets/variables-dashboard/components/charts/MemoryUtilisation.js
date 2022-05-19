import React from "react";
import { LineChart, NrqlQuery } from "nr1";

import { Gauge } from "./Gauge";
import { accountIds, pollInterval } from "../../constants";
import { QueryTextbox } from "../QueryTextbox";
import { useQuery } from "../../filter/filterContext";
import { chartsStyle, chartInnerStyle, chartErrorStyle } from "./styles";

const memoryUtilisationInner = (
  { service, cluster, since, gauge = false } = { service, cluster, since }
) => `
  FROM K8sContainerSample
  SELECT sum(memoryWorkingSetBytes) / sum(memoryRequestedBytes) AS ${
    gauge ? `results` : `memoryUtilisation`
  }
  ${!!service ? `WHERE ${service}` : ``}
  ${!!cluster ? (!!service ? `AND ${cluster}` : `WHERE ${cluster}`) : ``}
  ${gauge ? since : ``}
`;

const memoryUtilisationQuery = ({
  timeseries,
  since,
  facetByCluster,
  service,
  cluster,
}) => `
  SELECT min(memoryUtilisation) AS min, max(memoryUtilisation) AS max, average(memoryUtilisation) AS average
  FROM (
    ${memoryUtilisationInner({ cluster, service })}
    ${facetByCluster} TIMESERIES MAX
  ) ${facetByCluster}
  ${timeseries} ${since}
`;

export const MemoryUtilisation = () => {
  const { cluster, service, facetByCluster, since, timeseries } = useQuery({});

  const gauge = true;
  const gaugeQuery = memoryUtilisationInner({
    service,
    cluster,
    since,
    gauge,
  });

  const query = memoryUtilisationQuery({
    timeseries,
    since,
    facetByCluster,
    service,
    cluster,
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
