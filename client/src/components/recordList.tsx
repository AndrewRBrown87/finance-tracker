import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InvestmentChart from "./chart";
import MarketValueChart from "./marketValueChart";

const Record = (props : any) => (
 <tr onClick={() => {props.setSelected(props.record.ticker); props.setPurchaseDate(props.record.purchaseDate); props.setQuantity(props.record.quantity); props.setBookValue(props.record.bookValue)}}>
   <td>{props.record.name}</td>
   <td>{props.record.ticker}</td>
   <td>{props.record.quantity}</td>
   <td>${props.record.bookValue}</td>
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
 const [selected, setSelected] = useState("");
 const [purchaseDate, setPurchaseDate] = useState("");
 const [quantity, setQuantity] = useState(0);
 const [bookValue, setBookValue] = useState(0);

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
     setSelected(records[0].ticker);
     setPurchaseDate(records[0].purchaseDate);
     setQuantity(records[0].quantity);
     setBookValue(records[0].bookValue);
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
         setQuantity={() => setQuantity(record.quantity)}
         setBookValue={() => setBookValue(record.bookValue)}
         record={record}
         deleteRecord={() => deleteRecord(record._id)}
         key={record._id}
       />
     );
   });
 }

 // This following section will display the table with the investment records.
 //{selected !== "" ? <InvestmentChart ticker={selected} purchaseDate={purchaseDate}/> : null}
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
           <th></th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
     {selected !== "" ? <MarketValueChart ticker={selected} purchaseDate={purchaseDate} quantity={quantity} bookValue={bookValue}/> : null}
   </div>
 );
}
