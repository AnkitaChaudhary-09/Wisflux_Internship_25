const http =require('http');
const fs =require('fs');
const { URLSearchParams } = require('url');

function  requestListener( req, res){
 console.log(req.url, req.method);


 if(req.url === '/'){
  
res.setHeader('content-type','text/html');
 res.write('<html>');
 res.write('<head><title>Form</title></head>');
 res.write('<body><h1> Enter your Details</h1>');
 res.write('<form action="/submit-details" method="POST">');
 res.write('<input type ="text" name="username" placeholder="Enter your name"><br>');
 res.write('<label  for="gender">Gender:</label>');
 res.write('<input type ="radio" name="gender" id="male" value="male">');
 res.write('<label  for="male">Male</label>');
res.write('<input type ="radio" name="gender" id="female" value="female">');
res.write('<label  for="Female">Female</label>');
res.write('<input type="submit" value="submit">');
 res.write('</form>');
 res.write('</body>');
 res.write('</html');
 res.end();
 
}else if(req.url.toLowerCase()==="/submit-details" && req.method==="POST"){

 const body=[];
  req.on('data',chaunk=>{
    console.log(chaunk);
    body.push(chaunk);
  });
req.on('end',()=>{
const fullBody=Buffer.concat(body).toString();
console.log(fullBody);
const params= new URLSearchParams(fullBody);
const bodyObject={};
for(const [key,val] of params.enteries()){
  bodyObject[key]=val;
}
console.log(bodyObject);
});


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


// server is running on addres http://localhost:3001
// / GET
// /favicon.ico GET
// /submit-details POST
// <Buffer 75 73 65 72 6e 61 6d 65 3d 41 6e 6b 69 74 61 2b 43 68 61 75 64 68 61 72 79 26 67 65 6e 64 65 72 3d 66 65 6d 61 6c 65>
// username=Ankita+Chaudhary&gender=female