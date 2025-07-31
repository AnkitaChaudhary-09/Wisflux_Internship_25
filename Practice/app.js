const express = require("express");
const app = express();


app.use((req, res, next) => {
  console.log("First Dummy Middleware!", req.method, req.url);
  next();
});

app.use((req, res, next) => {
  console.log("Second Dummy Middleware!",req.method, req.url);
  next();
});

// app.use((req, res, next) => {
//   console.log("Second Dummy Middleware!",req.method, req.url);
//   res.send("<h1>Hello from Express!</h1>");
// });

// app.get("/", (req, res,next) => {
//   console.log("Handling / for GET",req.url, req.method);
//   res.send("<h1>Hello from Express!</h1>");
//   next();

// });

app.get("/Contact-us", (req, res,next) => {
  console.log("Handling /for contact-us",req.url, req.method);
  res.send(`<h1>Please give your details</h1>
    <form action="/Contact-us" method="POST">
    <input type="text" name="name" placeholder="Enter your name" required>
    <input type="email" name="email" placeholder="Enter your email" required>
    <input type="submit" value="Submit">
    
    
    `);

});

app.post("/Contact-us", (req, res) => {
  console.log("Handling /for contact-us",req.url, req.method); 
  res.send("<h1>Thank you for your submission!</h1>");
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on address http://localhost:${PORT}`);
});
