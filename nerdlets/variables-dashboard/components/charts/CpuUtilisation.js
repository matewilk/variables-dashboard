import React from "react";
import { LineChart, NrqlQuery } from "nr1";

import { Gauge } from "./Gauge";
import { accountIds, pollInterval } from "../../constants";
import { QueryTextbox } from "../QueryTextbox";
import { useQuery } from "../../filter/filterContext";
import { chartsStyle, chartInnerStyle, chartErrorStyle } from "./styles";

const cpuUtilisationInner = (
  { service, cluster, since, gauge = false } = { service, cluster, since }
) => `
  FROM K8sContainerSample
  SELECT sum(cpuUsedCores) / sum(cpuRequestedCores) AS ${
    gauge ? `results` : `cpuUtilisation`
  }
  ${!!service ? `WHERE ${service}` : ``}
  ${!!cluster ? (!!service ? `AND ${cluster}` : `WHERE ${cluster}`) : ``}
  ${gauge ? since : ``}
`;

const cpuUtilisationQuery = ({
  timeseries,
  since,
  facetByCluster,
  service,
  cluster,
}) => `
  SELECT min(cpuUtilisation) AS min, max(cpuUtilisation) AS max, average(cpuUtilisation) AS average
  FROM (
    ${cpuUtilisationInner({ cluster, service })}
    ${facetByCluster} TIMESERIES MAX
  ) ${facetByCluster}
  ${timeseries} ${since}
`;

export const CpuUtilisation = () => {
  const { cluster, service, facetByCluster, since, timeseries } = useQuery({});

  const gauge = true;
  const gaugeQuery = cpuUtilisationInner({
    service,
    cluster,
    since,
    gauge,
  });

  const query = cpuUtilisationQuery({
    timeseries,
    since,
    facetByCluster,
    service,
    cluster,
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
              {error ? <div style={chartErrorStyle}>{error.message}</div> : "" }
              <LineChart fullWidth data={data} />
            </div>
          );
        }}
      </NrqlQuery>
    </div>
  );
};
