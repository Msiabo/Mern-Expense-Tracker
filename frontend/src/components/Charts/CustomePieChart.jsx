import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomeToolTip from './CustomeToolTip';
import CustomLegend from './CustomLegend';

const CustomePieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => {
            // Determine color:
            let fillColor = '#000'; // fallback black
            if (Array.isArray(colors)) {
              fillColor = colors[index % colors.length];
            } else if (typeof colors === 'object' && entry.type) {
              fillColor = colors[entry.type] || '#000';
            }
            return <Cell key={`cell-${index}`} fill={fillColor} />;
          })}
        </Pie>
        <Tooltip content={CustomeToolTip} />
        <Legend content={CustomLegend} />
        {showTextAnchor && (
          <>
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-semibold"
            >
              {label}
            </text>
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-medium text-gray-500"
            >
              {totalAmount}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomePieChart;