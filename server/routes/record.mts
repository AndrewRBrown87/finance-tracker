import express from "express";
import { Request, Response } from 'express';
import db from "../db/conn.mts";
import { ObjectId } from "mongodb";
import request from 'request';

var key = process.env.ALPHA_VANTAGE_KEY

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=BBD-B.TRT&outputsize=full&apikey=${key}`;
//var url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=bombardier&apikey=${key}`

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req : Request, res : Response) => {
  let collection = await db.collection("investments");
  let results = await collection.find({}).toArray();

  request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err: Error, res: any, data: any) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is successfully parsed as a JSON object:
      console.log(data);
    }
});

  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req : Request, res : Response) => {
  let collection = await db.collection("investments");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you get an investment record by id
router.get("/investment/:id", async (req : Request, res : Response) => {
  let collection = await db.collection(req.params.id);
  let results = await collection.find({}).toArray();

  if (!results) res.send("Not found").status(404);
  else res.send(results).status(200);
});

// This section will help you create a new record.
router.post("/", async (req : Request, res : Response) => {
  let newDocument = {
    name: req.body.name,
    ticker: req.body.ticker,
    quantity: req.body.quantity,
    bookValue: req.body.bookValue,
    marketValue: req.body.marketValue,
  };
  let collection = await db.collection("investments");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// This section will help you update a record by id.
router.patch("/:id", async (req : Request, res : Response) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates =  {
    $set: {
      name: req.body.name,
      ticker: req.body.ticker,
      quantity: req.body.quantity,
      bookValue: req.body.bookValue,
      marketValue: req.body.marketValue,
    }
  };

  let collection = await db.collection("investments");
  let result = await collection.updateOne(query, updates);
  res.send(result).status(200);
});

// This section will help you delete a record
router.delete("/:id", async (req : Request, res : Response) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("investments");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;