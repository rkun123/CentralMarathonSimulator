var http = require("http");
var url = require("url");
var qs = require("querystring");

var server = http.createServer(function (req,res) {
    console.log("getConection.");
    console.log(req.body);
    var paras = url.parse(req.url,true);
    console.log(paras.query);
});
server.listen(3000);
