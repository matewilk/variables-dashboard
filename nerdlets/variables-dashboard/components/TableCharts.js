import React from "react";
import { BillboardChart, BlockText, TableChart, NrqlQuery } from "nr1";

import { useQuery } from "../filter/filterContext";
import { chartsStyle, blockTextStyle } from "./styles";

export const TableCharts = () => {
  const { shouldFilter, attributes, facet, since } = useQuery();

  const query = shouldFilter
    ? `SELECT ${attributes} FROM Metric ${facet} ${since}`
    : `SELECT * FROM Metric`;

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
