var Local = function () {
    // game obj
    var game;
    // time间隔
    var INTERVAL = 500;
    // bind keyboard
    var bindkeyEvent = function () {
        document.onkeydown = function (e) {
            if(e.keyCode == 38){
                game.rotate();
            }else if(e.keyCode == 39){ // right
                game.right()
            }
            else if(e.keyCode == 40){ // down
                game.down();
            }
            else if(e.keyCode == 37){ // left
                game.left();
            }
            else if(e.keyCode == 32){ // space
                game.fall();
            }

        }
    }
    // move
    var move =function () {
        if(!game.down()){
            game.fixed();
            game.checkClear();
            var gameOver = game.checkgameOver()
            if(gameOver){
                stop();
            } else{
                game.performNext(generateType(), generateDir());
            }
        }
    }
    var stop = function () {
        if(timer){
            clearInterval(timer)
            timer = null
        }
        document.onkeydown = null
    }
    var generateType =function () {
        return Math.ceil(Math.random() * 7) -1;
    }
    var generateDir =function () {
        return Math.ceil(Math.random() * 4) -1;
    }
    // start
    var start = function () {
        var doms = {
            gameDiv: document.getElementById('game'),
            nextDiv: document.getElementById('next')
        }
        game = new Game();
        game.init(doms)
        bindkeyEvent()
        timer = setInterval(move, INTERVAL)
    }
    // export api
    this.start = start;
}