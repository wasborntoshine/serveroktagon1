const express = require("express");

const app = express();

app.get("/static", function(request, response){
     
    response.json({header: "Hello", body: "Octagon NodeJS Test"});
});
app.get("/dynamic", function(request, response){
	const params = ['a', 'b', 'c'].map(p => parseFloat(request.query[p]));

	if (params.some(isNaN)) {
		response.json({header: "Error"});
	} else {
		const result = params.reduce((acc, val) => acc * val, 1) / 3;
	response.json({header: "Calculated", body: result.toString()});
	}
});

app.listen(3000, "127.0.0.1",()=>{
    console.log("Сервер начал прием запросов по адресу http://localhost:3000");
});

