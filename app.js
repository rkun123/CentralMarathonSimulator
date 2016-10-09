var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require("fs");

//server init
var server = http.createServer(function (req,res) {
        console.log("getConection at "+req.url);
        var paras = url.parse(req.url,true);
        if(paras.pathname == "/regist"){
            //This is test get GET by "getTest.html"(successful)
            console.log("regist path");
            console.log(paras.query);
        }else{

            //console.log(paras.path);

            fs.readFile("./htmls"+req.url,function(err, data){
                //if (err) throw err;
                console.log(data);
                res.setHeader("Content-Type", "text/html");
                res.end(data);
            });
        }

});
server.listen(1212);
