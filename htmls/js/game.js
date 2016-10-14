

window.onload = function () {
    enchant();
    var game = new Game(320,320);

    var grass1 = 'imgs/grass1.png';
    var sky1 = 'imgs/sky1.png';
    var itoimg = 'imgs/ito.png';
    var kawimg = 'imgs/kawimg.png';
    var lockimg = 'imgs/Lock.png';
    var unkoimg = 'imgs/Unko.png';
    var titleBG = 'imgs/start.gif';
    var overBG = 'imgs/gameover.gif';
    var goalBG = 'imgs/goal.gif';
    var startBGsp,overBGsp,goalBGsp;


    game.preload(grass1,sky1,itoimg,kawimg,unkoimg,lockimg,titleBG,overBG,goalBG);
    game.fps = 30;
    game.onload = function () {

        var titleScene = new Scene();
        var playScene = new Scene();//ゲーム画面作成
        var overScene = new Scene();
        var endScene = new Scene();
        playScene.backgroundColor = "hsla(200,100%,85%,1)";//背景を空の色に

        var nowSpeed = 0;//スピード制御用変数作成
        var speedStep = 0.5;
        var startTime;
        //console.log(startTime.getTime());
        var nowTime;
        var picCount = 0;
        var jumpTime = 20;
        var Stamina = 100;
        var scoreMap = [-10,-15,-20];
        var itoState = false;
        var lockState = false;
        var unkoState = false;
        var withinpx = 50;
        var bg,player,bg_1,bg_2,label,staminaLabel,ito,unko,lock,roadBar;//makeDisp関数に渡す変数
        var gameTrueFlag = true;
        var dushCount = 0;

        var Ldata = [3,5,11,18,23,29,32,38,43];
        var Udata = [4,13,16,28,35,41];
        var Idata = [2,12,25,40];

        //結果用変数
        var r_time,r_stamina,r_name,r_point;


        makeTitleDisp();
        makeDisp();

        //フレーム毎に呼ばれるリスナーを設定

        game.addEventListener("enterframe",newFrame);


        //for debug
        playScene.addEventListener("touchstart",function (event) {
            console.log(event.x+","+event.y);
            //playScene.removeChild(player);
        })

        game.on("abuttondown",speedUp);
        game.on("bbuttondown",speedDown);
        game.on("cbuttondown",jump);

        //フレーム毎に呼ばれる
        function newFrame(){
                if(gameTrueFlag){
                nowTime = 50 - Math.floor((new Date().getTime() - startTime.getTime())/1000);
                label.text = nowTime;
                //console.log(Math.floor(nowTime/1000));
                if(game.input.d){
                  nowSpeed = 15;
                  dushCount += 1;
                  if(dushCount >= 15){
                    Stamina -= 1;
                    dushCount = 0;
                  }
                }else if(nowSpeed < 0){
                    nowSpeed = 0;
                }else if(nowSpeed > 5){
                    nowSpeed = 5;
                }
                bg_1.x += nowSpeed;
                bg_2.x=bg_1.x - game.width;
                ito.x = bg_1.x-60;
                unko.x = bg_1.x;
                lock.x = bg_1.x;

                var barLength = game.width/44*picCount;
                roadBar.width = barLength;
                roadBar.x = game.width - barLength;

                //console.log(bg.x);
                if(bg_1.x >= 320){
                    bg_1.x = 0;
                    picCount++;
                    console.log(picCount);
                    checkObstacle(picCount);
                }
                //当たり判定

                if(player.within(ito,withinpx) && itoState){
                    Stamina += scoreMap[2];
                    console.log("Stamina:"+Stamina);
                    console.log("あたった");
                    itoState = false;
                    player.tl.moveBy(0, -120, 5, enchant.Easing.CUBIC_EASEOUT).moveBy(0, 120, 5, enchant.Easing.CUBIC_EASEIN);
                }else if(player.within(lock,withinpx) && lockState){
                    Stamina += scoreMap[0];
                    console.log("Stamina:"+Stamina);
                    lockState = false;
                    player.tl.moveBy(0, -120, 5, enchant.Easing.CUBIC_EASEOUT).moveBy(0, 120, 5, enchant.Easing.CUBIC_EASEIN);
                }else if(player.within(unko,withinpx) && unkoState){
                    Stamina += scoreMap[1];
                    console.log("Stamina:"+Stamina);
                    unkoState = false;
                    player.tl.moveBy(0, -120, 5, enchant.Easing.CUBIC_EASEOUT).moveBy(0, 120, 5, enchant.Easing.CUBIC_EASEIN);
                }else{

                }

                staminaLabel.text = "stamina is "+Stamina;



                //ゲームオーバー判定（スタミナ切れ）
                if(Stamina <= 0){
                    Stamina = 0;//スタミナがマイナスになるのを回避
                    r_point = Stamina+50-nowTime;//ポイント計算
                    gameover();
                }
                //ゲームオーバー判定（時間切れ）
                if(nowTime <= 0){
                    r_point = Stamina+50-nowTime;//ポイント計算
                    gameover();
                }
                //ゴール判定
                if(picCount == 44){
                    r_point = Stamina+nowTime*2+50;//ポイント計算
                    end();
                }

            }
        }


        //スプライト作成
        function generateSprite(_x,_y,_width,_height,_image,_frame,_scale){
            var sprite = new Sprite(_width,_height);
            sprite.image = game.assets[_image];
            sprite.x = _x;sprite.y = _y;
            sprite.frame = _frame;
            sprite.scaleX = _scale;
            sprite.scaleY = _scale;
            return sprite;
        }

        //加速
        function speedUp(){
            //スピードアップ
            nowSpeed += speedStep;
            console.log(nowSpeed);
        }

        //減速
        function speedDown(){
            //スピードダウン
            nowSpeed -= speedStep;
            console.log(nowSpeed);
        }

        //ジャンプ
        function jump(){
            player.tl.moveBy(0, -120, jumpTime, enchant.Easing.CUBIC_EASEOUT).moveBy(0, 120, jumpTime, enchant.Easing.CUBIC_EASEIN); // 12フレームかけて現在の位置から上に120px移動
            console.log("スタミナ:"+Stamina);
        }



        //障害物出現関数
        function checkObstacle(picCount){
            if(Idata.indexOf(picCount)>=0){
              console.log("伊藤");
              playScene.addChild(ito);
              itoState = true;
            }else {
              playScene.removeChild(ito);
              itoState = false;
            }
            if(Ldata.indexOf(picCount)>=0){
                console.log("石");
                //lock = generateSprite(-64,260-64,64,64,lockimg,1,1);
                playScene.addChild(lock);
                lockState = true;
            }else{
                    playScene.removeChild(lock);
                    lockState = false;
            }

            if(Udata.indexOf(picCount)>=0){
                console.log("う〇こ");
                playScene.addChild(unko);
                unkoState = true;
            }else{
                    playScene.removeChild(unko);
            }
        }


        //最初にいろいろ配置する
        function makeDisp(){
            //動かない空を作成
            bg = new Sprite(320,320);
            bg.image = game.assets[sky1];

            bg = generateSprite(0,0,320,320,sky1,1,1)
            playScene.addChild(bg);
            //かわみん画像スプライト作成
            player = generateSprite(320-64,257-64,64,64,kawimg,[1,1,1,2,2,2,3,3,3,2,2,2],1);
            console.log(player);
            playScene.addChild(player);


            ito = generateSprite(0,140,160,160,itoimg,[1,1,1,1,2,2,2,2],0.5);//伊藤先生スプライト作成
            //ito = generateSprite(-64,260-64,64,64,lockimg,1,1);
            lock = generateSprite(-64,260-64,64,64,lockimg,1,1);//石スプライト作成
            unko = generateSprite(-64,260-64,64,64,unkoimg,1,1);//うんこスプライト作成
            //流れる草の一個目作成
            bg_1 = generateSprite(0,320-75,320,320,grass1,1,1);
            playScene.addChild(bg_1);

            //同上二個目作成
            bg_2 = generateSprite(0,320-75,320,320,grass1,1,1);
            playScene.addChild(bg_2);

            //距離プログレスバー
            roadBar = new Sprite(game.width,10);
            roadBar.backgroundColor = "#FF0000";
            playScene.addChild(roadBar);
            //時間表示ラベル作成
            label = new Label("Hi");
            //label.moveTo(game.width/2,16);
            label.color = "red";
            playScene.addChild(label);

            //スタミナ表示ラベル
            staminaLabel = new Label("stamina is 100");
            staminaLabel.x=20;
            label.color = "blue";
            playScene.addChild(staminaLabel);

            //時間計測開始
            startTime = new Date();


            //game.pushScene(playScene);

            game.keybind(65,"a");//speedUp - a
            game.keybind(68,"b");//speedDown - d
            game.keybind(32,"c")//jump - space
            game.keybind(66,"d")//dush - b

        }

        function makeTitleDisp(){
            //titleSceneを構築
            //タイトル
            /*var title = new Label("<form name='hoge'>" +"<input type='text' name='text'>" +"</from>");
            titleScene.addChild(title);*/

            var bg = new Sprite(320,320);
            bg.image = game.assets[titleBG];
            titleScene.addChild(bg);

            //textbox作成
            var input = new Entity();
            input._element = document.createElement('div');
            input.width = 320;
            input._element.innerHTML = "<form name='hoge'>" +"<input type='text' name='text'>" +"</from>";
            input.x=160 - 320/4;
            input.y = game.width/2;
            titleScene.addChild(input);
            game.pushScene(titleScene);

            //ボタン作成
            var button = new Entity();
            button._element = document.createElement("button");
            button.width = 50;button.height = 20;
            button.x = 320/2-50/2;
            button.y = input.y+30;
            button._element.innerHTML =  "確定";
            titleScene.addChild(button);
            //window.setTimeout(function(){game.pushScene(playScene);},1000)

            button.on('touchstart',function(){
                game.pushScene(playScene);
                r_name = document.hoge.text.value;
                console.log("NickName:"+document.hoge.text.value);
                //時間計測開始
                startTime = new Date();
            });
            //テキスト


        }

        //ゲームオーバー
        function gameover(){

            overBGsp = new Sprite(320,320);
            overBGsp.image = game.assets[overBG];
            overScene.addChild(overBGsp);

            console.log("GameOver!!");
            gameTrueFlag = false;
            r_time = nowTime;
            r_stamina = Stamina;
            r_point *= 0.5;
            //overScene.backgroundColor =  "#FF0000"
            var results = new Label("name:"+r_name+", time:"+r_time+", stamina:"+r_stamina+", point:"+r_point);
            results.x = game.width/2-results._boundWidth/2;
            results.y = 200;
            send(r_name,r_time,r_stamina,r_point);
            overScene.addChild(results);
            game.pushScene(overScene);
        }
        function end(){
            //ゴール
            goalBGsp = new Sprite(320,320);
            goalBGsp.image = game.assets[goalBG];
            endScene.addChild(goalBGsp);

          console.log("GameOver!!");
          gameTrueFlag = false;
          r_time = nowTime;
          r_stamina = Stamina;
          //endScene.backgroundColor =  "#FFFFFF"
          var results = new Label("name:"+r_name+", time:"+r_time+", stamina:"+r_stamina+", point:"+r_point);
          results.x = game.width/2-results._boundWidth/2;
          results.y = 200;
          endScene.addChild(results);
          game.pushScene(endScene);



          //ランキング送信
          send(r_name,r_time,r_stamina,r_point);
        }



    }
    game.start();//ゲーム開始
}
function send(_name,_time,_stamina,_point){
    var xhr = new XMLHttpRequest();
    var serverURL = "/regist";
    var sendUrl = serverURL + "?name="+_name+"&time="+_time+"&stamina="+_stamina+"&point="+_point;
    console.log(sendUrl);
    xhr.open("GET",sendUrl,true);
    xhr.send();
}
