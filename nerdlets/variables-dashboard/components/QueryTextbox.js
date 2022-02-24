import React from "react";
import { BlockText } from "nr1";

const blockTextStyle = {
  backgroundColor: "whitesmoke",
  borderRadius: "3px",
  padding: "5px",
};

export const QueryTextbox = ({ query }) => (
  <BlockText style={blockTextStyle}>
    <code>{query}</code>
  </BlockText>
);
