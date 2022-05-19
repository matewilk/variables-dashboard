import React from "react";
import { Button } from "nr1";

import { MultiSelect } from "./MultiSelect";
import { useFilter } from "../filter/filterContext";

const style = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "5px",
};

export const FilterForm = () => {
  const { filter, setAppliedFilter } = useFilter();

  const onSubmit = (e) => {
    e.preventDefault();
    setAppliedFilter(filter);
  };

  return (
    <form style={style} name="filter-form">
      <MultiSelect
        name={"Cluster"}
        initialOptions={[]}
        query={"FROM K8sClusterSample SELECT uniques(clusterName) as items"}
        isAsync={true}
      />
      <MultiSelect
        name={"Service"}
        initialOptions={[]}
        query={"FROM K8sPodSample SELECT uniques(`label.app`) as items"}
        isMulti={false}
        isAsync={true}
      />
      <MultiSelect
        name={"facetbycluster"}
        label={"Facet by cluster"}
        initialOptions={[{ label: "true", value: true }]}
        isAsync={false}
        isMulti={false}
      />
      <MultiSelect
        name={"Since"}
        initialOptions={[
          { label: "30 minutes", value: "30 minutes" },
          { label: "60 minutes", value: "60 minutes" },
          { label: "90 minutes", value: "90 minutes" },
          { label: "2 hours", value: "2 hours" },
          { label: "3 hours", value: "3 hours" },
          { label: "4 hours", value: "4 hours" },
          { label: "6 hours", value: "6 hours" },
          { label: "12 hours", value: "12 hours" },
          { label: "24 hours", value: "24 hours" },
          { label: "3 days", value: "3 days" },
          { label: "7 days", value: "7 days" },
        ]}
        isAsync={false}
        isMulti={false}
      />
      <MultiSelect
        name={"Timeseries"}
        initialOptions={[
          { label: "1 min", value: "1 minute" },
          { label: "5 mins", value: "5 minutes" },
          { label: "10 mins", value: "10 minutes" },
          { label: "1 hour", value: "1 hour" },
        ]}
        isAsync={false}
        isMulti={false}
      />
      <Button type={Button.TYPE.PRIMARY} onClick={onSubmit}>
        Filter
      </Button>
    </form>
  );
};
