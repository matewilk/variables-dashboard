import React from "react";
import { TableChart, NrqlQuery } from "nr1";

import { accountIds, pollInterval } from "../../constants";
import { QueryTextbox } from "../QueryTextbox";
import { useQuery } from "../../filter/filterContext";
import { chartsStyle } from "./styles";

export const IncidentsChart = () => {
  const { shouldFilter, since } = useQuery();

  const query = shouldFilter
    ? `SELECT conditionName, incidentLink FROM NrAiIncident WHERE event = 'open' ${since}`
    : `SELECT conditionName, incidentLink FROM NrAiIncident WHERE event = 'open' SINCE 1 day ago`;

  return (
    <div style={chartsStyle}>
      Incidents
      <QueryTextbox query={query} />
      <NrqlQuery
        pollInterval={pollInterval}
        accountIds={accountIds}
        query={query}
      >
        {({ data }) => {
          return (
            // prevent dropdown list to be obscured by table title by zIndex
            <div style={{ zIndex: 0 }}>
              <TableChart fullWidth data={data} />
            </div>
          );
        }}
      </NrqlQuery>
    </div>
  );
};
