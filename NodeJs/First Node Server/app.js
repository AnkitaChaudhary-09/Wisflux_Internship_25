const http =require('http');

function  requestListener( req, res){
 console.log(req);
}
const server = http.createServer(requestListener);
const Port=3000;
server.listen(Port,() =>{
  console.log(`server is running on addres http://localhost:${Port}`);
});