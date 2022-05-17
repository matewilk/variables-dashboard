import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042"];

const colours = (threshold) =>
  threshold.map((item, index) => {
    return { ...item, colour: COLORS[index] };
  });

const getColour = (values, percent) => {
  let sum = 0;
  for (let obj of values) {
    sum += obj.value;
    if (sum >= percent) {
      return obj;
    }
  }
  return { colour: "whitesmoke" };
};

export const Gauge = ({ data }) => {
  const results = data ? data[0].data[0].results : 0;
  const gdata = [{ value: results }, { value: 1 - results }];
  const percent = Math.round(results * 100);

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
              <Cell key={`cell-${index}`} fill={entry.colour} />
            ))}
          </Pie>
          <text
            x={"50%"}
            y={"50%"}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {percent}%
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
                  fill={index === 1 ? "whitesmoke" : colour}
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};