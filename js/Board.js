(function(window){
    'use strict';

    function Board(gameInst) {
        this.gameInst = gameInst;
        this.blockSize = 30;
        this.rows = Tetrisconfig.rows;
        this.cols = Tetrisconfig.cols;
        this.canvas = new Canvas('c_game_main', this.cols*this.blockSize, this.rows*this.blockSize);
        this.context = this.canvas.context;
        this.boardList = [];
        this.shape = new Shape();

        this._init();
    }

    Board.prototype = {
        constructor: Board,
        _init: function(){
            this._buildGridData();
            this._initGrid();

            this.shape.draw(this.context);
            var self = this;
            setTimeout(function(){
                self._buildNextShape();
            });     
        },
        _buildNextShape: function(){
            this.nextShape = new window.Shape();
            this.nextShape.setPosition(this.gameInst.nextShape.cols, this.gameInst.nextShape.rows, true);
            this.gameInst.nextShape.render(this.nextShape);
        },
        _buildGridData: function(){
            for(var i = 0; i<this.rows; i++){
                this.boardList[i] = [];
                for (var j = 0; j < this.cols; j++) {
                    this.boardList[i][j] = 0;
                }
            }
        },
        _initGrid(){
            this.context.strokeStyle = 'green';
            this.context.lineWidth = 0.5;
            for(var i=0; i<=this.rows; i++){
                this.context.moveTo(0, i*this.blockSize);
                this.context.lineTo(this.canvas.width, i*this.blockSize);
            }
            for(var i=0; i<=this.cols; i++){
                this.context.moveTo(i*this.blockSize, 0);
                this.context.lineTo(i*this.blockSize, this.canvas.height);
            }
            this.context.stroke();

            this.gridImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        },

        tick: function(){
            if(this.validMove(0, 1)){
                this.shape.y+=1;
            }else{
                this.addShapeToBoardList();
                if(this.gameInst._state === 'over'){
                    this.gameInst.endGame();
                    return;
                }
                this.clearFullRows();
                this.shape = this.nextShape;
                this.shape.setPosition(this.cols, this.rows, true);
                this._buildNextShape();
            }        
            this.refresh();
            this.shape.draw(this.context);
        },

        refresh: function(){
            this.canvas.clear();
            this.context.putImageData(this.gridImageData, 0, 0);
            this.drawBlocks();
        },

        validMove: function(moveX, moveY){
            var nextX = moveX + this.shape.x;
            var nextY = moveY + this.shape.y;
            for(var y =0; y<this.shape.layout.length; y++){
                for(var x=0; x<this.shape.layout[y].length; x++){
                    if(this.shape.layout[y][x]){
                        if(nextX + x < 0 
                            || nextX + x >=this.cols
                            || nextY + y >=this.rows
                            || this.boardList[nextY + y][nextX + x])
                            return false;
                    }
                }
            }
            return true;
        },

        addShapeToBoardList: function(){
            for(var y =0; y<this.shape.layout.length; y++){
                for(var x=0; x<this.shape.layout[y].length; x++){
                    if(this.shape.layout[y][x]){
                        var boardX = this.shape.x + x;
                        var boardY = this.shape.y + y;
                        if(this.boardList[boardY][boardX]){
                            this.gameInst._state = 'over';
                            return;
                        }else{
                            this.boardList[boardY][boardX] = this.shape.blockType;
                        }
                    }
                }
            }
        },

        drawBlocks: function(){
            for(var y =0; y<this.rows; y++){
                for(var x=0; x<this.cols; x++){
                    if(this.boardList[y][x]){
                        this.shape.block.draw(this.context, x, y, this.boardList[y][x]);
                    }
                }
            }
        },

        createEmptyRow: function(){
            var emptyRow = [];
            for (var i = 0; i < this.cols; i++) {
                emptyRow.push(0);
            }
            return emptyRow;
        },

        clearFullRows: function(){
            var lines = 0;
            for(var y = this.rows-1; y>=0; y--){
                var filled = this.boardList[y].filter(function(item){return item>0}).length === this.cols;
                if(y && filled){
                    this.boardList.splice(y, 1);
                    this.boardList.unshift(this.createEmptyRow());
                    lines++;
                    y++;
                }
            }
            var score = lines*lines*100;
            var totalScore = this.gameInst.score.addScore(score);
            this.gameInst.highScore.checkScore(totalScore);
            var currentLevel = this.gameInst.level.checkLevel(totalScore);
            if(currentLevel){
                Tetrisconfig.speed = Tetrisconfig.constSpeed * Math.floor(1-(currentLevel-1)/10);
                this.gameInst.pause();
                var self = this;
                setTimeout(function(){
                    alert("恭喜您升级了！");
                    self.gameInst.resume();
                });
            }
        }      
    };

    window.Board = Board;
})(window);