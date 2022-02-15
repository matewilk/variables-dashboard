import React from "react";
import { FilterForm } from "../nerdlets/variables-dashboard/components/FilterForm";

export default {
  title: "Example/FilterForm",
  component: FilterForm,
  parameters: {
    actions: {
      handles: ['click', 'click .btn'],
    },
  },
};

const Template = (args) => <FilterForm {...args} />;

export const Form = Template.bind({});
Form.args = {};
