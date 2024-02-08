import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

interface Props {
  ticker: string;
  purchaseDate: string;
  quantity: number;
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

  // This method will map out the records on the table
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
   </div>
 );
}
