import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
   res.send("Server is running");
});

const PORT = process.env.PORT;

const startServer = async () => {
   await connectDB()
   app.listen(PORT,()=>{
      console.log(`Server started at http://localhost:${PORT}`)
   })
};

startServer()
