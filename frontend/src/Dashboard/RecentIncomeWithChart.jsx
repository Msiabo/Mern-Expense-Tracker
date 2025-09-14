import React, { useEffect, useState } from "react";
import CustomePieChart from "../components/Charts/CustomePieChart";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [charData, setCharData] = useState([]);

  // method you can call anytime
  const prepareCharData = () => {
    if (data && data.length > 0) {
      const dataArr = data.map((item) => ({
        name: item?.source,
        amount: item?.amount,
      }));
      setCharData(dataArr);
    } else {
      setCharData([]);
    }
  };

  // run automatically when data changes
  useEffect(() => {
    prepareCharData();
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomePieChart
        data={charData}
        label="Total Income"
        totalAmount={`R${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
