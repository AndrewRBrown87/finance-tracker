import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

interface Props {
  ticker: string;
}

export default function InvestmentChart(props: Props) {
 const [records, setRecords] = useState([]);

 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5050/record/investment/${props.ticker}`);

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

  // This method will map out the records on the table
 function recordList() {
  return records.map((record : any) => {
    return (
      [record.date.split("-")[0], record.price]
    );
  });
}

const data = [
  ["Year", "Price"],
  ...recordList(),
];

console.log(data);

 const options = {
  title: props.ticker,
  hAxis: { title: "Year", format: Date,},
  vAxis: { title: "Price", minValue: 0 },
};

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
