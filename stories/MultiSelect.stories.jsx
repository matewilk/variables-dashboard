import React from "react";
import { MultiSelect } from "../nerdlets/variables-dashboard/components/MultiSelect";

export default {
  title: "Example/MultiSelect",
  component: MultiSelect,
  argTypes: {
    placeholder: { control: "text" },
  },
};

const Template = (args) => <MultiSelect {...args} />;

export const Cluster = Template.bind({});
Cluster.args = {
  placeholder: "Cluster",
  initialOptions: [
    { value: "value 1", label: "label 1" },
    { value: "value 2", label: "label 2" },
  ],
};

export const Service = Template.bind({});
Service.args = {
  placeholder: "Service",
};
