import express from "express";
import { Request, Response } from 'express';
import db from "../db/conn.mts";
import { ObjectId } from "mongodb";
import request from "request-promise";

var key = process.env.ALPHA_VANTAGE_KEY
//var url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=bombardier&apikey=${key}`

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req : Request, res : Response) => {
  let collection = await db.collection("investments");
  let results = await collection.find({}).toArray();

  /* var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=BBD-B.TRT&outputsize=full&apikey=${key}`;

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
      console.log(data["Time Series (Daily)"]["2024-01-31"]);
    }
  }); */

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
  //request historical investment price data
  let investments = await db.collection("investments");
  let query = {ticker: req.params.id};
  let result = await investments.findOne(query);

  //only pull new data from alphavantage once per day
  if (Date.now() - 86400000 > result.updateTime) {
    let priceData :any = [];
    var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.params.id}&outputsize=full&apikey=${key}`;

    await request.get({
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
        for (let date in data["Time Series (Daily)"]) {
          priceData.push({ date: date, price: data["Time Series (Daily)"][date]['4. close']});
        }
      }
    });

    //update collection for the investment
    let investmentCollection = await db.collection(req.params.id);
    let deletionResult = await investmentCollection.deleteMany({});
    let confirmation = await investmentCollection.insertMany(priceData);

    //set updateTime
    const updates =  {
      $set: {
        name: result.name,
        ticker: result.ticker,
        quantity: result.quantity,
        bookValue: result.bookValue,
        marketValue: result.marketValue,
        updateTime: Date.now(),
      }
    };

    let updateResult = await investments.updateOne(query, updates);
  }

  //send investment data
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
    updateTime: Date.now(),
  };
  let collection = await db.collection("investments");
  let result = await collection.insertOne(newDocument);

  //request historical investment price data

  let priceData :any = [];
  var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${req.body.ticker}&outputsize=full&apikey=${key}`;

  await request.get({
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

      for (let date in data["Time Series (Daily)"]) {
        priceData.push({ date: date, price: data["Time Series (Daily)"][date]['4. close']});
      }
    }
  });

  //create new collection for the investment
  let investmentCollection = await db.collection(req.body.ticker);

  let confirmation = await investmentCollection.insertMany(priceData);

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
      updateTime: null,
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