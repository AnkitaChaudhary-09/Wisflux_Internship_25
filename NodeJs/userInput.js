const http =require('http');
const fs =require('fs');

function  requestListener( req, res){
 console.log(req.url, req.method, req.headers);

 if(req.url === '/'){
  
res.setHeader('content-type','text/html');
 res.write('<html>');
 res.write('<head><title>Form</title></head>');
 res.write('<body><h1> Enter your Details</h1>');
 res.write('<form action="/submit-details" method="POST">');
 res.write('<input type ="text" name="username" placeholder="Enter your name"><br>');
 res.write('<label  for="gender">Gender:</label>');
 res.write('<input type ="radio" name="gender" id="male" vale="male">');
 res.write('<label  for="male">Male</label>');
res.write('<input type ="radio" name="gender" id="female" vale="female">');
res.write('<label  for="Female">Female</label><br>');
res.write('<input type="submit" value="submit">');
 res.write('</form>');
 res.write('</body>');
 res.write('</html');
 res.end();
 
}else if(req.url.toLowerCase()==="/submit-details" && req.method==="POST"){
fs.writeFileSync('user.txt','Ankita');
res.statusCode=302;
res.setHeader('Location','/');
}
}
const server = http.createServer(requestListener);
const Port=3001;
server.listen(Port,() =>{
  console.log(`server is running on addres http://localhost:${Port}`);
});
