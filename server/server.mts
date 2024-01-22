import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import records from "./routes/record.mts";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});