var http = require("http");
var server = http.createServer(function (req,res) {
    console.log("getConection.");
    if(req.url == "/regist"){
        console.log(req.body);
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.end("Hello!!");
    }else{
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.end("Shut up!!");
    }
});
server.listen(8080);
