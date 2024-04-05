const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.MONGO_URI)
mongoose
  .connect("mongodb+srv://saranya:GxRa1jWHPR9P0Wev@cluster0.qkifwnf.mongodb.net/")
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));
