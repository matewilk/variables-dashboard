import React from "react";
import { BillboardChart } from "nr1";

const isEmpty = (object) => {
  return Object.keys(object).length === 0;
};

const buildQuery = (filter) => {
  if (isEmpty(filter)) {
    return `SELECT * FROM Metric`;
  }

  const attrs =
    filter.cluster && filter.cluster.length > 0
      ? filter.cluster.map((cluster) => {
          const func =
            !filter.function || isEmpty(filter.function)
              ? ""
              : filter.function.value;
          return `${func}(${cluster.value})`;
        })
      : "*";

  const attributes = Array.isArray(attrs) ? attrs.join(",") : attrs;

  return `SELECT ${attributes} FROM Metric`;
};

export const Charts = ({ appliedFilter }) => {
  const query = buildQuery(appliedFilter);

  return (
    <div>
      <BillboardChart accountIds={[2674886]} query={query} />
    </div>
  );
};
