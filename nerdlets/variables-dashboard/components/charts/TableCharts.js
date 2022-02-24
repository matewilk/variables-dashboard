import React from "react";
import { BillboardChart, TableChart, NrqlQuery } from "nr1";

import { accountIds, pollInterval } from "../../constants";
import { QueryTextbox } from "../QueryTextbox";
import { useQuery } from "../../filter/filterContext";
import { chartsStyle } from "./styles";

export const TableCharts = () => {
  const { shouldFilter, attributes, facet, since } = useQuery();

  const query = shouldFilter
    ? `SELECT ${attributes} FROM Metric ${facet} ${since}`
    : `SELECT * FROM Metric`;

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
              <BillboardChart fullWidth data={data} />
              <TableChart fullWidth data={data} />
            </>
          );
        }}
      </NrqlQuery>
    </div>
  );
};
