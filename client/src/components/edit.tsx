import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function Edit() {
 const [form, setForm] = useState({
   name: "",
   ticker: "",
   quantity: 0,
   bookValue: 0,
   marketValue: 0,
   records: [],
 });
 const params : any = useParams();
 const navigate = useNavigate();

 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:5050/record/${params.id.toString()}`);

     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const record = await response.json();
     if (!record) {
       window.alert(`Record with id ${id} not found`);
       navigate("/");
       return;
     }

     setForm(record);
   }

   fetchData();

   return;
 }, [params.id, navigate]);

 // These methods will update the state properties.
 function updateForm(value : any) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 async function onSubmit(e : any) {
   e.preventDefault();
   const editedPerson = {
     name: form.name,
     ticker: form.ticker,
     quantity: form.quantity,
     bookValue: form.bookValue,
     marketValue: form.marketValue,
   };

   // This will send a post request to update the data in the database.
   await fetch(`http://localhost:5050/record/${params.id}`, {
     method: "PATCH",
     body: JSON.stringify(editedPerson),
     headers: {
       'Content-Type': 'application/json'
     },
   });

   navigate("/");
 }

 // This following section will display the form that takes input from the user to update the data.
 return (
   <div>
     <h3>Update Investment</h3>
     <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ticker">Ticker: </label>
          <input
            type="text"
            className="form-control"
            id="ticker"
            value={form.ticker}
            onChange={(e) => updateForm({ ticker: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity: </label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={form.quantity}
            onChange={(e) => updateForm({ quantity: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bookValue">Book Value: </label>
          <input
            type="number"
            className="form-control"
            id="bookValue"
            value={form.bookValue}
            onChange={(e) => updateForm({ bookValue: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="marketValue">Market Value: </label>
          <input
            type="number"
            className="form-control"
            id="marketValue"
            value={form.marketValue}
            onChange={(e) => updateForm({ marketValue: e.target.value })}
          />
        </div>
       <br />

       <div className="form-group">
         <input
           type="submit"
           value="Update Record"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
