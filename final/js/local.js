var Local = function () {
    // game obj
    var game;
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
    // start
    var start = function () {
        var doms = {
            gameDiv: document.getElementById('game'),
            nextDiv: document.getElementById('next')
        }
        game = new Game();
        game.init(doms)
        bindkeyEvent()
    }
    // export api
    this.start = start;
}