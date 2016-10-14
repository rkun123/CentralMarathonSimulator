var fs = require("fs");

fs.readFile("test.json",function(err,data){
    var jsonD = JSON.parse(data);
    console.log(jsonD);
    jsonD.ranks[jsonD.ranks.length] = {"time":60,"stamina":20,"name":"mno"};
    console.log("---");
    console.log(jsonD);
    var fileTxt = JSON.stringify(jsonD);
    fs.writeFile("test.json",fileTxt,function(err){
        if(err) throw err;
        console.log("Can't write.");
    });
    for(var i=0;i<jsonD.ranks.length-1;i++){
        var logTxt = JSON.stringify(jsonD.ranks[i]);
        console.log(i + ":" +logTxt);
    }
});

/*↓jsオブジェクト テスト
var data = {
    "ranks":[{
        "time":20,
        "stamina":60,
        "name":"abc"
    },{
        "time":30,
        "stamina":50,
        "name":"def"
    },{
        "time":40,
        "stamina":40,
        "name":"ghi"
    }]
}

console.log(data.ranks);
data.ranks[data.ranks.length] = {"time":50,"stamina":30,"name":"jkl"};
console.log("---");
console.log(data.ranks);
*/
