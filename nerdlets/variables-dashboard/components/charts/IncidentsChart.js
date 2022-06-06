import React from "react";
import { TableChart, NrqlQuery } from "nr1";

import { accountIds, pollInterval } from "../../constants";
import { QueryTextbox } from "../QueryTextbox";
import { usePlatformState } from "../../filter/hooks";
import { chartsStyle } from "./styles";

export const IncidentsChart = () => {
  const { timeRangePlatformState } = usePlatformState();

  const query = `
    SELECT conditionName, incidentLink 
    FROM NrAiIncident 
    WHERE event = 'open' ${timeRangePlatformState}
  `;

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
