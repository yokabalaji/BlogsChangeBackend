const express = require("express");

var cookieParser = require("cookie-parser");

//const cors=require("cors");

const app = express();

const router = require("./Routes/User.routers.js");

port = 8080 || process.env.port;

//var corOption={origin:"http://localhost:8080"};

//app.use(cors(corOption));

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use("/api/calls", router);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
