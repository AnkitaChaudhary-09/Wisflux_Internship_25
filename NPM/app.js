const http =require('http');
const server = http.createServer((req,res) => {
  console.log(req);
});
const Port=3004;
server.listen(Port,() =>{
  console.log(`server is running on addres http://localhost:${Port}`);
});