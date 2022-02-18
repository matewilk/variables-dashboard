import React from "react";
import { LineChart, BlockText, PieChart, NrqlQuery } from "nr1";

import { useQuery } from "../filter/filterContext";

const chartsStyle = {
  flex: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const blockTextStyle = {
  backgroundColor: "whitesmoke",
  borderRadius: "3px",
  padding: "5px",
};

export const TimeseriesCharts = () => {
  const { shouldFilter, attributes, facet, since, timeseries } = useQuery();

  const query = shouldFilter
    ? `SELECT ${attributes} FROM Metric ${facet} ${since} ${timeseries}`
    : `SELECT latest(network.bytes.received) FROM Metric TIMESERIES`;

  return (
    <div style={chartsStyle}>
      <BlockText style={blockTextStyle}>{query}</BlockText>
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
