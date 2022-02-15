import React, { useState, useEffect } from "react";
import Select from "react-select";
import { NerdGraphQuery } from "nr1";

const colourStyles = {
  control: (styles) => ({
    ...styles,
    minWidth: "200px",
  }),
};

const accId = 2674886;

const formatQueryResponse = ({ error, data }) => {
  if (error) {
    console.log(error);
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
  initialOptions,
  isMulti = true,
  isAsync = true,
  query = '',
  filter,
  setFilter
}) => {
  const [options, setOptions] = useState(initialOptions);

  useEffect(() => {
    const loadOptions = async () => {
      const result = await fetchOptions({
        accountId: accId,
        query,
      });
      const items = formatQueryResponse(result);
      setOptions(items);
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
      placeholder={name}
      options={options}
      onChange={onChange}
    />
  );
};
