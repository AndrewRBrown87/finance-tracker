import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["Year", "Market Value"],
  [2020, 100000],
  [2021, 150000],
  [2022, 120000],
  [2023, 200000],
];

export const options = {
  title: "Investment Chart",
  hAxis: { title: "Year", minValue: 2020, maxValue: 2023, format: "####",},
  vAxis: { title: "Market Value", minValue: 0, maxValue: 200000 },
};

export default function InvestmentChart() {
 const [records, setRecords] = useState([]);

 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5050/record/`);

     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const records = await response.json();
     setRecords(records);
   }

   getRecords();

   return;
 }, [records.length]);


 // This following section will display the chart with the investment data.
 return (
   <div>
     <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
   </div>
 );
}
