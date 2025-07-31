// userInput.js
const fs = require('fs');

const requestListener = (req, res) => {
  console.log(req.url, req.method, req.headers);

  if (req.url === '/' && req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Form</title></head>');
    res.write('<body><h1>Enter your Details</h1>');
    res.write('<form action="/submit-details" method="POST">');
    res.write('<input type="text" name="username" placeholder="Enter your name"><br>');
    res.write('<label for="gender">Gender:</label>');
    res.write('<input type="radio" name="gender" id="male" value="male">');
    res.write('<label for="male">Male</label>');
    res.write('<input type="radio" name="gender" id="female" value="female">');
    res.write('<label for="female">Female</label><br>');
    res.write('<input type="submit" value="Submit">');
    res.write('</form>');
    res.write('</body>');
    res.write('</html>');
    res.end();
  }

  else if (req.url.toLowerCase() === "/submit-details" && req.method === "POST") {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      fs.writeFileSync('user.txt', parsedBody);
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    });
  }

  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 Not Found');
  }
};

module.exports = requestListener;
// This file handles user input and serves HTML content for the form. 