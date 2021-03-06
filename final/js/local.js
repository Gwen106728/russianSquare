var Local = function (socket) {
    // game obj
    var game;
    // time间隔
    var INTERVAL = 200;
    // timer
    var timer = null
    // 时间计数器
    var timeCount = 0
    // 时间
    var time = 0;
    // bind keyboard
    var bindkeyEvent = function () {
        document.onkeydown = function (e) {
            if(e.keyCode == 38){
                game.rotate();
                socket.emit('rotate')
            }else if(e.keyCode == 39){ // right
                game.right()
                socket.emit('right')
            }
            else if(e.keyCode == 40){ // down
                game.down();
                socket.emit('down')
            }
            else if(e.keyCode == 37){ // left
                game.left();
                socket.emit('left')
            }
            else if(e.keyCode == 32){ // space
                game.fall();
                socket.emit('fall')
            }

        }
    }
    // move
    var move =function () {
        timeFunc();
        if(!game.down()){
            game.fixed();
            socket.emit('fixed')
            var line = game.checkClear();
            if(line) {
                game.addScore(line);
                socket.emit('line', line)
                if(line > 1){
                    var bottomLines = generataBottomLine(line);
                    socket.emit('bottomLines')
                }
            }
            var gameOver = game.checkgameOver()
            if(gameOver){
                game.gameover(false)
                document.getElementById('remote_gameover').innerHTML = 'you win!'
                socket.emit('lost')
                stop();
            } else{
                var t = generateType();
                var d = generateDir();
                game.performNext(t, d)
                socket.emit('next', {type:t, dir:d})
            }
        } else
        {
            socket.emit('down')
        }
    }
    // 随机生成干扰
    var generataBottomLine = function (lineNum) {
        var lines = [];
        for(var i=0; i<lineNum; i++) {
            var line = [];
            for(var j=0; j<10; j++){
                line.push(Math.ceil(Math.random() *2) -1)
            }
        lines.push(line);
        }
        return lines
    }
    // 计时函数
    var timeFunc = function () {
        timeCount = timeCount +1;
        if (timeCount == 5) {
            timeCount = 0;
            time = time +1;
            game.setTime(time)
            socket.emit('time', time)

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
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            resultDiv: document.getElementById('local_gameover')
        }
        game = new Game();
        var type = generateType();
        var dir = generateDir();
        game.init(doms, type, dir)
        socket.emit('init', {type: type, dir: dir})
        bindkeyEvent();
        var t = generateType();
        var d = generateDir();
        game.performNext(t, d)
        socket.emit('next', {type:t, dir:d})
        timer = setInterval(move, INTERVAL)
    }

    socket.on('start', function () {
        document.getElementById('waiting').innerHTML = '';
        start();
    });
    socket.on('lost', function () {
        game.gameover(true)
        stop()
    })
    socket.on('leave' ,function () {
        document.getElementById('local_gameover').innerHTML = '对方掉线'
        document.getElementById('remote_gameover').innerHTML = '已掉线'
        stop()
    })
    socket.on('bottomLines', function (data) {
        game.addTailLines(data)
        socket.emit('addTailLines')

    })
}