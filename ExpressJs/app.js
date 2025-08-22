// Core Modcule
// const http = require('http');
//External Module
const express = require('express');
// Local Module
const requestListener = require('./userInput');

const app = express();
app.use("/",(req, res, next)=> {
  console.log("Came in 1st Middleware",req.url, req.method);
  res.send("came in 1st middleware"); // This will send a response to the client
  next();//Came in 1st Middleware / GET

})

app.use("/",(req, res, next)=> {
  console.log("Came in another Middleware",req.url, req.method);
  res.send("came in another middleware"); // This will send a response to the client
  next();//Came in 1st Middleware / GET

})


app.use("/submit-details",(req, res, next)=> {
  console.log("Came in 2nd Middleware",req.url, req.method); //Came in 2nd Middleware / GET
  res.send("Hello from ExpressJS!"); // This will send a response to the client

})

//const server = http.createServer(app);

const PORT=3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// This file sets up the HTTP server and listens for incoming requests.