import React, { useState } from "react";
// import { Button } from "nr1"

import { MultiSelect } from "./MultiSelect";

const style = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "5px",
};

export const FilterForm = ({ filter, setFilter, setAppliedFilter }) => {
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
        filter={filter}
        setFilter={setFilter}
      />
      <MultiSelect
        name={"Cluster"}
        initialOptions={[
          { label: "cluster 1", value: "cluster 1" },
          { label: "cluster 2", value: "cluster 2" },
        ]}
        query={`SELECT uniques(metricName) as items FROM Metric`}
        filter={filter}
        setFilter={setFilter}
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
      {/* <Button type={Button.TYPE.PRIMARY}>Submit</Button> */}
      <button type="submit" onClick={onSubmit}>
        Submit
      </button>
    </form>
  );
};
