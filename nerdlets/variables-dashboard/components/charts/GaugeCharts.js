import React from "react";
import { NrqlQuery } from "nr1";

import { Gauge } from "./Gauge";
import { accountIds, pollInterval } from "../../constants";
import { QueryTextbox } from "../QueryTextbox";
import { useQuery } from "../../filter/hooks";
import { chartsStyle } from "./styles";



export const GaugeCharts = () => {
  const { shouldFilter, since } = useQuery();

  const query = shouldFilter
    ? `SELECT latest(network.bytes.dropped) / latest(network.bytes.sent) AS dropped FROM Metric ${since}`
    : `SELECT latest(network.bytes.dropped) / latest(network.bytes.sent) AS dropped FROM Metric`;

  return (
    <div style={chartsStyle}>
      <QueryTextbox query={query} />
      <NrqlQuery
        pollInterval={pollInterval}
        accountIds={accountIds}
        query={query}
      >
        {({ data }) => {
          return (
            <>
              <Gauge data={data} />
            </>
          );
        }}
      </NrqlQuery>
    </div>
  );
};
