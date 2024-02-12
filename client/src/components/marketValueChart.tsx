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
  ["Date", `${props.ticker} Market Value`],
  ...recordList(),
];

//this will calculate the percent change over the specified number of days
function percentChange(days : number) {
  if (data.length > days) {
    return ((Number(data[1][1]) - Number(data[days][1])) / Number(data[days][1]) * 100).toFixed(2);
  }
  else if (data.length > 1) {
    return ((Number(data[1][1]) - Number(data[data.length-1][1])) / Number(data[data.length-1][1]) * 100).toFixed(2);
  }
  return null;
}

//this will calculate the value change over the specified number of days
function valueChange(days : number) {
  if (data.length > days) {
    return (Number(data[1][1]) - Number(data[days][1])).toFixed(2);
  }
  else if (data.length > 1) {
    return (Number(data[1][1]) - Number(data[data.length-1][1])).toFixed(2);
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

//this will calculate the value change since the purchase date
function totalValueChange() {
  if (data.length > 1) {
    return (Number(data[1][1]) - props.bookValue).toFixed(2);
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
      <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Duration</th>
           <th>Percent Change</th>
           <th>Value Change</th>
         </tr>
       </thead>
       <tbody>
        <tr>
          <td>Last Month</td>
          <td>{ percentChange(22) }%</td>
          <td>${ valueChange(22) }</td>
        </tr>
        <tr>
          <td>Last Year</td>
          <td>{ percentChange(252) }%</td>
          <td>${ valueChange(252) }</td>
        </tr>
        <tr>
          <td>Since Purchase Date</td>
          <td>{ totalPercentChange() }%</td>
          <td>${ totalValueChange() }</td>
        </tr>
       </tbody>
     </table>
    </div>
  );
}
