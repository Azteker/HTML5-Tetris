(function(window){
    'use strict';

    var intervalId;

    function Tetris(){
        this.board = new Board(this);
        this.score = new Score();
        this.timer = new Timer();
        this.level = new Level();
        this.nextShape = new NextShape();
        this.highScore = new HighScore();

        this._sound;
        this._state = 'playing';
        (new Keyboard()).init(this.board);
    }

    Tetris.prototype = {
        constructor: Tetris,
        _initAudio: function(){
            this._sound = new Howl({
                src: ['audio/bg.wav'],
                loop: true,
                volume: 0.2
            });
            this._playSound();
        },
        _playSound: function(){
            if(Tetrisconfig.config.enableSound){
                this._sound.play();
            }
        },
        _startTick(){
            var self = this;
            Tetrisconfig.intervalId = window.setInterval(function(){
                self.board.tick();
            }, Tetrisconfig.speed);
        },
        _stopTick(){
            clearInterval(Tetrisconfig.intervalId);
        },
        startGame: function(){
            this._startTick();
            this._initAudio();
        },
        endGame: function(){
            this._sound.stop();
            this._stopTick();
            this.timer.stop();
        },
        pause(){
            if(this._state === 'over'){
                return;
            }
            this._sound.pause();
            this._state = 'pause';
            this._stopTick();
            this.timer.pause();
        },
        resume(){
            if(this._state === 'over'){
                return;
            }
            this._state = 'playing';
            this._startTick();
            this.timer.resume();
            this._playSound();
        }
    };

    window.Tetris = Tetris;
})(window);