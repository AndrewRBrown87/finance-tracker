import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InvestmentChart from "./chart";

const Record = (props : any) => (
 <tr onClick={() => {props.setSelected(props.record.ticker); props.setPurchaseDate(props.record.purchaseDate)}}>
   <td>{props.record.name}</td>
   <td>{props.record.ticker}</td>
   <td>{props.record.quantity}</td>
   <td>{props.record.bookValue}</td>
   <td>{props.record.purchaseDate}</td>
   <td>
     <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
     <button className="btn btn-link"
       onClick={() => {
         props.deleteRecord(props.record._id);
       }}
     >
       Delete
     </button>
   </td>
 </tr>
);

export default function RecordList() {
 const [records, setRecords] = useState([]);
 const [selected, setSelected] = useState("amd");
 const [purchaseDate, setPurchaseDate] = useState("");

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

 // This method will delete a record
 async function deleteRecord(id : any) {
   await fetch(`http://localhost:5050/record/${id}`, {
     method: "DELETE"
   });

   const newRecords = records.filter((el : any) => el._id !== id);
   setRecords(newRecords);
 }

 // This method will map out the records on the table
 function recordList() {
   return records.map((record : any) => {
     return (
       <Record
         setSelected={() => setSelected(record.ticker)}
         setPurchaseDate={() => setPurchaseDate(record.purchaseDate)}
         record={record}
         deleteRecord={() => deleteRecord(record._id)}
         key={record._id}
       />
     );
   });
 }

 // This following section will display the table with the investment records.
 return (
   <div>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Investment</th>
           <th>Ticker</th>
           <th>Quantity</th>
           <th>Book Value</th>
           <th>Purchase Date</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
     <InvestmentChart ticker={selected} purchaseDate={purchaseDate}/>
   </div>
 );
}
