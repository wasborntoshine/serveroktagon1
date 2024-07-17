const http = require("http");
 
let message = "<h1>Привет, Октагон!</h1>";
http.createServer(function(request,response){
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    console.log(message);
    response.end(message);
     
}).listen(3000, "127.0.0.1",()=>{
    console.log("Сервер начал прием запросов по адресу http://localhost:3000");
});