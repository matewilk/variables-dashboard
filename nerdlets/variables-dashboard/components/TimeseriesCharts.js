import React from "react";
import { LineChart, BlockText, PieChart, NrqlQuery } from "nr1";

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

const isEmpty = (object) => {
  return Object.keys(object).length === 0;
};

const buildQuery = (filter) => {
  const defaultAttrs = "latest(network.bytes.received)";
  if (isEmpty(filter)) {
    return `SELECT ${defaultAttrs} FROM Metric TIMESERIES`;
  }

  const attrs =
    filter.cluster && filter.cluster.length
      ? filter.cluster.map((cluster) => {
          const func =
            !filter.function || isEmpty(filter.function)
              ? ""
              : filter.function.value;
          return `${func}(${cluster.value})`;
        })
      : defaultAttrs;
  const attributes = Array.isArray(attrs) ? attrs.join(", ") : attrs;

  const facet =
    filter.facet && Array.isArray(filter.facet) && filter.facet.length
      ? `FACET ${filter.facet.map((facet) => facet.value).join(", ")}`
      : "";

  const since =
    filter.since && !isEmpty(filter.since)
      ? `SINCE ${filter.since.value} minutes ago`
      : "";

  const timeseries =
    filter.timeseries && !isEmpty(filter.timeseries)
      ? `TIMESERIES ${filter.timeseries.value}`
      : "TIMESERIES";

  return `SELECT ${attributes} FROM Metric ${facet} ${since} ${timeseries}`;
};

export const TimeseriesCharts = ({ appliedFilter }) => {
  const query = buildQuery(appliedFilter);

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
