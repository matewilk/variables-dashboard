import React from "react";
import { LineChart, PieChart, NrqlQuery } from "nr1";

import { accountIds, pollInterval } from "../../constants";
import { QueryTextbox } from "../QueryTextbox";
import { useQuery } from "../../filter/filterContext";
import { chartsStyle } from "./styles";

export const TimeseriesCharts = () => {
  const { shouldFilter, attributes, facet, since, timeseries } = useQuery({
    defaultAttrs: "latest(network.bytes.received)",
  });

  const query = shouldFilter
    ? `SELECT ${attributes} FROM Metric ${facet} ${since} ${timeseries}`
    : `SELECT latest(network.bytes.received) FROM Metric TIMESERIES`;

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
              <LineChart fullWidth data={data} />
              <PieChart fullWidth data={data} />
            </>
          );
        }}
      </NrqlQuery>
    </div>
  );
};
