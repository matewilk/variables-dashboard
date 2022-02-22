import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BlockText, NrqlQuery } from "nr1";

import { useQuery } from "../filter/filterContext";
import { chartsStyle, blockTextStyle } from "./styles";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Gauge = ({ data }) => {
  const rest = 1 - data;
  const gdata = [{ value: data }, { value: rest }];
  const percent = Math.round(data * 100)
  return (
    <div style={{ width: "100%" }}>
      <ResponsiveContainer aspect={2}>
        <PieChart>
          <text x={"50%"} y={100} textAnchor="middle" dominantBaseline="middle">
            Bytes drop {percent}%
          </text>
          <Pie
            data={gdata}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="value"
          >
            {gdata.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GaugeCharts = () => {
  const { shouldFilter, since } = useQuery();

  const query = shouldFilter
    ? `SELECT latest(network.bytes.dropped)/latest(network.bytes.sent) AS dropped FROM Metric ${since}`
    : `SELECT latest(network.bytes.dropped)/latest(network.bytes.sent) AS dropped FROM Metric`;

  return (
    <div style={chartsStyle}>
      <BlockText style={blockTextStyle}>
        <code>{query}</code>
      </BlockText>
      <NrqlQuery pollInterval={120000} accountIds={[2674886]} query={query}>
        {({ data }) => {
          const dropped = data ? data[0].data[0].dropped : 0;
          return (
            <>
              <Gauge data={dropped} />
            </>
          );
        }}
      </NrqlQuery>
    </div>
  );
};
