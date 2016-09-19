var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require("fs");
var server = http.createServer(function (req,res) {
        console.log(req.url);
        console.log("getConection.");
        console.log(req.body);
        var paras = url.parse(req.url,true);
        console.log(paras.query);


        res.setHeader("Content-Type", "text/html");
        res.end(fs.readFileSync("./htmls"+req.url));
});
server.listen(3000);
