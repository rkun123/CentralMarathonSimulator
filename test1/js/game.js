window.onload = function () {
    enchant();
    var game = new Game(320,320);

    game.onload = function (){
        //var scene = new Scene();
        var element1 = new Sprite(32,32);
        element1.backgroundColor = "red";

        var element2 = new Sprite(32,32);
        element2.backgroundColor = "blue";

        game.rootScene.addChild(element2);
        game.rootScene.addChild(element1);

        element1.addEventListener("touchmove",function (event) {
            //console.log(event);
            element1.x = event.x;
            element1.y = event.y;
        });

        
        game.on("enterframe",function(){
            if(element1.intersect(element2)){
                console.log("Crash!!");
            }
        });
        
    }
    
    



    game.start();
}