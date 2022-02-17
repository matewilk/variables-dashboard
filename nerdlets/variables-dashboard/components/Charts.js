import React from "react";
import { BillboardChart, BlockText, TableChart, NrqlQuery } from "nr1";

import { useFilter } from "../filter/filterContext";

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
  if (isEmpty(filter)) {
    return `SELECT * FROM Metric`;
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
      : "*";
  const attributes = Array.isArray(attrs) ? attrs.join(", ") : attrs;

  const facet =
    filter.facet && Array.isArray(filter.facet) && filter.facet.length
      ? `FACET ${filter.facet.map((facet) => facet.value).join(", ")}`
      : "";

  const since =
    filter.since && !isEmpty(filter.since)
      ? `SINCE ${filter.since.value} minutes ago`
      : "";

  return `SELECT ${attributes} FROM Metric ${facet} ${since}`;
};

export const Charts = () => {
  const [_, __, appliedFilter] = useFilter();
  const query = buildQuery(appliedFilter);

  return (
    <div style={chartsStyle}>
      <BlockText style={blockTextStyle}>{query}</BlockText>
      <NrqlQuery pollInterval={120000} accountIds={[2674886]} query={query}>
        {({ data }) => {
          return (
            <>
              <BillboardChart fullWidth data={data} />
              <TableChart fullWidth data={data} />
            </>
          );
        }}
      </NrqlQuery>
    </div>
  );
};
