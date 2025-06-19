const http =require('http');
const requestListener = require('./pr');

const server = http.createServer(requestListener);
const Port=3001;
server.listen(Port,() =>{
  console.log(`server is running on addres http://localhost:${Port}`);
});