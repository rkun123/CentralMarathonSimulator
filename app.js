var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require("fs");

var rankFile = "ranking.json";

//server init
var server = http.createServer(function (req,res) {
        console.log("getConection at "+req.url);
        var paras = url.parse(req.url,true);
        switch(paras.pathname){
            case "/regist":
                //This is test get GET by "getTest.html"(successful)
                console.log("regist path");
                console.log(paras.query);
                jsonRegist(paras.query);
                res.statuscode = 200;
                res.end();
                break;
            case "/init":
                DBinit();
                res.setHeader("Content-Type", "text/plain");
                res.end("Initing Completed.");
                break;
            case "/ranking":
                res.setHeader("Content-Type", "text/plain");
                res.end(fs.readFileSync(rankFile));
            default:
                //Process GET req for htmls
                fs.readFile("./htmls"+req.url,function(err, data){
                    //if (err) throw err;

                    res.setHeader("Content-Type", "text/html");
                    res.end(data);
                });
                break;
        }
        /*if(paras.pathname == "/regist"){
            //This is test get GET by "getTest.html"(successful)
            console.log("regist path");
            console.log(paras.query);
            jsonRegist(paras.query);
        }else{
            //Process GET req for htmls
            fs.readFile("./htmls"+req.url,function(err, data){
                //if (err) throw err;
                console.log(data);
                res.setHeader("Content-Type", "text/html");
                res.end(data);
            });
        }*/

});
server.listen(1213);

function jsonRegist(getData){
    //json writing function
    fs.readFile(rankFile,function(err,data){
        var resultData;
        resultData = JSON.parse(data);//データベースファイル読込
        var ranksLeng = resultData.ranks.length;//ranksパラメータの要素数を取得
        resultData.ranks[ranksLeng] = getData;//GETしたデータを上を使いranksパラメータの最後尾に追記

        resultData.ranks.sort(function(a,b){
            if(a.point < b.point) return 1;
            if(a.point > b.point) return -1;
        });

        console.log(resultData.ranks);
        var fileTxt = JSON.stringify(resultData);//文字列に変換
        fs.writeFile(rankFile,fileTxt,function(err){//データベースに上書き
            if(err) throw err;
            console.log("registing OK!!");
        })
    })

}

function DBinit(){
    var data = {"ranks":[]};
    fs.writeFile(rankFile,JSON.stringify(data),function(err){
        if(err) throw err;
        console.log("Initing OK!!");
    })
}
