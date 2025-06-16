//Sending Response

const http =require('http');

function  requestListener( req, res){
 console.log(req.url, req.method, req.headers);
 res.setHeader('content-type','text/html');
 res.write('<html>');
 res.write('<head><title>Response</title></head>');
 res.write('<body>Response:<br> hello everyone</body>');
 res.write('</html');
 res.end();
}
const server = http.createServer(requestListener);
const Port=3000;
server.listen(Port,() =>{
  console.log(`server is running on addres http://localhost:${Port}`);
});


//Routing Requests

const http =require('http');

function  requestListener( req, res){
 console.log(req.url, req.method, req.headers);

 if(req.url === '/'){
  
 res.setHeader('content-type','text/html');
 res.write('<html>');
 res.write('<head><title>Response</title></head>');
 res.write('<body>Response:<br> Welcome to Home! </body>');
 res.write('</html');
 return res.end();
 }else if(req.url==='/products'){
 res.setHeader('content-type','text/html');
 res.write('<html>');
 res.write('<head><title>Response</title></head>');
 res.write('<body>Response:<br> check out </body>');
 res.write('</html');
  return res.end();

}
res.setHeader('content-type','text/html');
 res.write('<html>');
 res.write('<head><title>Response</title></head>');
 res.write('<body>Response:<br> hello everyone</body>');
 res.write('</html');
 res.end();
 
}
const server1 = http.createServer(requestListener);
const Port1=30002;
server.listen(Port,() =>{
  console.log(`server is running on addres http://localhost:${Port}`);
});

