import React, { useState, useEffect } from "react";
import Select from "react-select";
import { NerdGraphQuery } from "nr1";

import { accountIds } from "../constants";
import { useFilter } from "../filter/hooks";

const colourStyles = {
  control: (styles) => ({
    ...styles,
    minWidth: "200px",
  }),
};

const [accId] = accountIds;

const formatQueryResponse = ({ error, data }) => {
  if (error) {
    console.error(error);
  }

  const items = data.actor.account.nrql.results[0].items;
  return items.map((item) => ({ label: item, value: item }));
};

const fetchOptions = async ({ accountId, query }) => {
  const q = `
    query($id: Int!) {
      actor {
        account(id: $id) {
          nrql(query: "${query}") {
            results
          }
        }
      }
    }
  `;
  const variables = { id: accountId };
  return await NerdGraphQuery.query({ query: q, variables });
};

export const MultiSelect = ({
  name,
  label,
  initialOptions,
  isMulti = false,
  isAsync = false,
  query = "",
}) => {
  const { filter, setFilter } = useFilter();
  const [options, setOptions] = useState(initialOptions);

  useEffect(() => {
    const loadOptions = async () => {
      const result = await fetchOptions({
        accountId: accId,
        query,
      });
      const items = formatQueryResponse(result);
      setOptions([...initialOptions, ...items]);
    };
    isAsync ? loadOptions() : null;
  }, [initialOptions, isAsync]);

  const onChange = (args) => {
    setFilter({ ...filter, [name.toLowerCase()]: args });
  };

  return (
    <Select
      styles={colourStyles}
      isMulti={isMulti}
      placeholder={label ? label : name}
      options={options}
      onChange={onChange}
      isClearable={true}
    />
  );
};
