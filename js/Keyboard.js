(function(window){
    'use strict';

    var keys = {
        37: 'left',
        38: 'top',
        39: 'right',
        40: 'down'
    };

    function Keyboard(){

    }

    Keyboard.prototype = {
        constructor: Keyboard,
        init: function(board){
            var self = this;
            this.board = board;
            document.addEventListener('keydown', function(ev){
                self.processKeyDown(ev);
            });
        },
        processKeyDown: function(ev){
            if(this.board.gameInst._state !== 'playing')
                return;
            if(keys[ev.keyCode]){
                this.press(keys[ev.keyCode]);
            }
        },
        press: function(key) {
            var refresh = false;
            switch(key){
                case 'top':
                    var layout_cp = this.board.shape.layout.slice(0);
                    this.board.shape.rotate();
                    if(this.board.validMove(0, 0)){
                        refresh = true;
                    }else{
                        this.board.shape.layout = layout_cp;
                    }
                    break;
                case 'right':
                    if(this.board.validMove(1, 0)){
                        this.board.shape.x +=1;
                        refresh = true;                       
                    }
                    break;                
                case 'left':
                    if(this.board.validMove(-1, 0)){
                        this.board.shape.x -=1;
                        refresh = true;                       
                    }   
                    break;                 
                case 'down':
                    if(this.board.validMove(0, 1)){
                        this.board.shape.y +=1;
                        refresh = true;                 
                    }
                    break;          
            }
            if(refresh){
                this.board.refresh();
                this.board.shape.draw(this.board.context);
                if(key === 'down'){
                    var self = this;
                    window.clearInterval(Tetrisconfig.intervalId);
                    Tetrisconfig.intervalId = window.setInterval(function(){
                        self.board.tick();
                    }, Tetrisconfig.speed);
                }
            }
        }
    };

    window.Keyboard = Keyboard;
})(window);