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

        fs.readFile("./htmls"+req.url,function(err, data){
            //if (err) throw err;
            console.log(data);
            res.setHeader("Content-Type", "text/html");
            res.end(data);
        });

});
server.listen(3000);
