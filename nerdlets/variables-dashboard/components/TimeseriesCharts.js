import React from "react";
import { LineChart, BlockText, PieChart, NrqlQuery } from "nr1";

import { useQuery } from "../filter/filterContext";
import { chartsStyle, blockTextStyle } from "./styles";

export const TimeseriesCharts = () => {
  const { shouldFilter, attributes, facet, since, timeseries } = useQuery({
    defaultAttrs: "latest(network.bytes.received)",
  });

  const query = shouldFilter
    ? `SELECT ${attributes} FROM Metric ${facet} ${since} ${timeseries}`
    : `SELECT latest(network.bytes.received) FROM Metric TIMESERIES`;

  return (
    <div style={chartsStyle}>
      <BlockText style={blockTextStyle}>
        <code>{query}</code>
      </BlockText>
      <NrqlQuery pollInterval={120000} accountIds={[2674886]} query={query}>
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
