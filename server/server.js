const express = require("express");
const cors = require("cors");

const app = express();
const router = require("./routes/router");
require("./db/cofig");

app.use(cors()); // Add this line to enable CORS
app.use(express.json());
app.use(router);

app.listen(1999, () => {
  console.log(`Serve at http://localhost:1999`);
});
