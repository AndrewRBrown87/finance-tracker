import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

interface Props {
  ticker: string;
  purchaseDate: string;
  quantity: number;
  bookValue: number;
}

export default function MarketValueChart(props: Props) {
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
 }, [props.ticker]);

  // This method will map out the records for the chart
 function recordList() {
  return records.filter ((record : any) => {
    if (new Date(record.date) >= new Date(props.purchaseDate)) {
      return true;
    }
    return false;
  }).map((record : any) => {
      return (
            [new Date(record.date), Number(record.price * props.quantity)]
          );
  });
}

const data = [
  ["Date", props.ticker],
  ...recordList(),
];

//this will calculate the percent change over the last 30 days
function percentChange(days : number) {
  if (data.length > days) {
    return ((Number(data[1][1]) - Number(data[days][1])) / Number(data[days][1]) * 100).toFixed(2);
  }
  else if (data.length > 1) {
    return ((Number(data[1][1]) - Number(data[data.length-1][1])) / Number(data[data.length-1][1]) * 100).toFixed(2);
  }
  return null;
}

//this will calculate the percent change since the purchase date
function totalPercentChange() {
  if (data.length > 1) {
    return ((Number(data[1][1]) - props.bookValue) / props.bookValue * 100).toFixed(2);
  }
  return null;
}

// This following section will display the chart with the investment data.
  return (
    <div>
      <Chart
        chartType="AnnotationChart"
        width="100%"
        height="400px"
        data={data}
        options={{
          zoomStartTime : new Date(props.purchaseDate),
        }}
      />
      <div>
       <br/>Percent Change over Last 30 Days : { percentChange(22) }%
       <br/>Percent Change over Last Year : { percentChange(252) }%
       <br/>Percent Change Since Purchase Date : { totalPercentChange() }%
      </div>
    </div>
  );
}
