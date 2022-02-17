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

export const FilterForm = ({ setAppliedFilter }) => {
  const [filter] = useFilter()
  const onSubmit = (e) => {
    e.preventDefault();
    setAppliedFilter(filter);
  };

  return (
    <form style={style} name="filter-form">
      <MultiSelect
        name={"Function"}
        initialOptions={[
          { label: "min", value: "min" },
          { label: "max", value: "max" },
          { label: "sum", value: "sum" },
          { label: "latest", value: "latest" },
        ]}
        isAsync={false}
        isMulti={false}
      />
      <MultiSelect
        name={"Cluster"}
        initialOptions={[
          { label: "cluster 1", value: "cluster 1" },
          { label: "cluster 2", value: "cluster 2" },
        ]}
        query={`SELECT uniques(metricName) as items FROM Metric`}
      />
      <MultiSelect
        name={"Facet"}
        initialOptions={[
          { label: "host.name", value: "host.name" },
          { label: "via", value: "via" },
        ]}
        isAsync={false}
      />
      <MultiSelect
        name={"Since"}
        initialOptions={[
          { label: "30 min", value: "30" },
          { label: "60 min", value: "60" },
          { label: "90 min", value: "90" },
          { label: "120 min", value: "120" },
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
      {/* <MultiSelect
      name={"Service"}
      isMulti={false}
      initialOptions={[
        { label: "service 1", value: "service 1" },
        { label: "service 2", value: "service 2" },
      ]}
    />
    <MultiSelect
      placeholder={"Facet By"}
      initialOptions={[
        { label: "attr 1", value: "attr 1" },
        { label: "attr 2", value: "attr 2" },
      ]}
    />
    <MultiSelect
      name={"Percentile"}
      isMulti={false}
      initialOptions={[
        { label: "0.5", value: "0.5" },
        { label: "0.9", value: "0.9" },
      ]}
    />
    <MultiSelect
      name={"Error"}
      initialOptions={[
        { label: "400", value: "400" },
        { label: "404", value: "404" },
        { label: "500", value: "500" },
        { label: "200", value: "200" },
      ]}
    />
    <MultiSelect
      name={"Interval"}
      isMulti={false}
      initialOptions={[{ label: "auto", value: "auto" }]}
    /> */}
      <Button type={Button.TYPE.PRIMARY} onClick={onSubmit}>
        Filter
      </Button>
    </form>
  );
};
