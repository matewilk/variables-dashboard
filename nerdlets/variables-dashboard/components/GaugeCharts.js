import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BlockText, NrqlQuery } from "nr1";

import { useQuery } from "../filter/filterContext";
import { chartsStyle, blockTextStyle } from "./styles";

const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042"];

const colours = (threshold) =>
  threshold.map((item, index) => {
    return { ...item, colour: COLORS[index] };
  });

const getColour = (values, percent) => {
  let sum = 0;
  for(let obj of values) {
    sum += obj.value;
    if(sum >= percent) {
      return obj;
    }
  }
  return { colour: 'whitesmoke' }
}

const Gauge = ({ data }) => {
  const gdata = [{ value: data }, { value: 1 - data }];
  const percent = Math.round(data * 100);
  console.log(data)
  console.log(percent)

  const threshold = [{ value: 50 }, { value: 25 }, { value: 20 }, { value: 5 }];
  const colors = colours(threshold);
  return (
    <div style={{ width: "100%", minWidth: "200px" }}>
      <ResponsiveContainer aspect={2}>
        <PieChart>
          <Pie
            data={threshold}
            startAngle={180}
            endAngle={0}
            innerRadius={82}
            outerRadius={90}
            paddingAngle={1}
            dataKey="value"
          >
            {colors.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.colour}
              />
            ))}
          </Pie>
          <text
            x={"50%"}
            y={"50%"}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Bytes drop {percent}%
          </text>
          <Pie
            data={gdata}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={1}
            dataKey="value"
          >
            {gdata.map((entry, index) => { 
              const { colour } = getColour(colors, percent);
              return (
              <Cell
                key={`cell-${index}`}
                fill={index === 1 ? 'whitesmoke': colour}
              />
            ) })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GaugeCharts = () => {
  const { shouldFilter, since } = useQuery();

  const query = shouldFilter
    ? `SELECT latest(network.bytes.dropped) / latest(network.bytes.sent) AS dropped FROM Metric ${since}`
    : `SELECT latest(network.bytes.dropped) / latest(network.bytes.sent) AS dropped FROM Metric`;

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
