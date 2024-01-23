import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
 const [form, setForm] = useState({
   name: "",
   ticker: "",
   quantity: 0,
   bookValue: 0,
   marketValue: 0,
 });
 const navigate = useNavigate();

 // These methods will update the state properties.
 function updateForm(value : any) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 // This function will handle the submission.
 async function onSubmit(e : any) {
   e.preventDefault();

   // When a post request is sent to the create url, we'll add a new record to the database.
   const newInvestment = { ...form };

   await fetch("http://localhost:5050/record", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newInvestment),
   })
   .catch(error => {
     window.alert(error);
     return;
   });

   setForm({ name: "", ticker: "", quantity: 0, bookValue: 0, marketValue: 0});
   navigate("/");
 }

 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Add New Investment</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="ticker">Ticker</label>
         <input
           type="text"
           className="form-control"
           id="ticker"
           value={form.ticker}
           onChange={(e) => updateForm({ ticker: e.target.value })}
         />
       </div>
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          className="form-control"
          id="quantity"
          value={form.quantity}
          onChange={(e) => updateForm({ quantity: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="bookValue">Book Value</label>
        <input
          type="number"
          className="form-control"
          id="bookValue"
          value={form.bookValue}
          onChange={(e) => updateForm({ bookValue: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="marketValue">Market Value</label>
        <input
          type="number"
          className="form-control"
          id="marketValue"
          value={form.marketValue}
          onChange={(e) => updateForm({ marketValue: e.target.value })}
        />
      </div>
       <div className="form-group">
         <input
           type="submit"
           value="Create Investment"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
