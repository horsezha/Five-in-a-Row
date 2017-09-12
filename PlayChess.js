var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var me; //下棋方
var over; //游戏开始结束
var isNewGame = false;
var isSingle = true;
var chessBoard = []; //记录棋盘状态
var scoreBlack,scoreWhite;

var singleBtn = document.getElementById('single_game');
var doubleBtn = document.getElementById('double_game');
var newGameBtn = document.getElementById('new_game');
var scoreB = document.getElementById('blackchess');
var scoreW = document.getElementById('whitechess');
var scoreSet = document.getElementById('reset_score');

window.onload = function(){
	scoreBlack = 0;
	scoreWhite = 0;
	scoreB.innerHTML = scoreBlack;
	scoreW.innerHTML = scoreWhite;
	newGame();
	drawChessBoard();
}

//绘制棋盘
var drawChessBoard = function(){
	context.strokeStyle = '#333';
	for(var i=0;i<15;i++){
		//纵线
		context.beginPath();
		context.lineTo(15+i*30,15);
		context.lineTo(15+i*30,435);
		context.stroke();
		//横线
		context.beginPath();
		context.lineTo(15,15+i*30);
		context.lineTo(435,15+i*30);
		context.stroke();
	}
};

//绘制棋子
var oneStep = function(i,j,me){
	var chessStyle = context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
	if(me){
		chessStyle.addColorStop(0,'#0a0a0a');
		chessStyle.addColorStop(1,'#636766');
	}else{
		chessStyle.addColorStop(0,'#d1d1d1');
		chessStyle.addColorStop(1,'#f9f9f9');
	}
	context.fillStyle = chessStyle;
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.fill();
	context.closePath();
};

//棋盘初始化
var newGame = function(){
	me = true;
	over = false;

	//记录棋盘状态，无子为0，黑子为1，白子为2
	for(var i=0;i<15;i++){
		chessBoard[i] = [];
		for(var j=0;j<15;j++){
			chessBoard[i][j] = 0;
		}
	}
	context.clearRect(0,0,chess.width,chess.height);
	//赢法统计数组
	myWin = [];
	compWin = [];
	for(var i=0;i<count;i++){
		myWin[i] = 0;
		compWin[i] = 0;
	}

	chess.onclick = function(e){
		oneClick(e);
	}
}

//一方下棋
var oneClick = function(e){
	if(over || !me){
		return;
	}
	var i = Math.floor(e.offsetX / 30);
	var j = Math.floor(e.offsetY / 30);
	if(chessBoard[i][j] == 0){
		oneStep(i,j,me);
		chessBoard[i][j] = 1;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				compWin[k] = 6;
				if(myWin[k] == 5){
					scoreBlack++;
					gameOver(me);
				}
			}
		}
		if(!over){
			me = !me;
			if(isSingle){
				computerAI();
			}else{
				chess.onclick = function(e){
					otherClick(e);
				}
			}
		}
	}
};

//另一方下棋
var otherClick = function(e){
	if(over || me){
		return;
	}
	var i = Math.floor(e.offsetX / 30);
	var j = Math.floor(e.offsetY / 30);
	if(chessBoard[i][j] == 0){
		oneStep(i,j,me);
		chessBoard[i][j] = 2;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				compWin[k]++;
				myWin[k] = 6;
				if(compWin[k] == 5){
					scoreWhite++;
					gameOver(me);
				}
			}
		}
		if(!over){
			me = !me;
			chess.onclick = function(e){
				oneClick(e);
			}
		}
	}
};

//电脑下棋
var computerAI = function(){
	var myScore = [];
	var compScore = [];
	var max = 0; //保存最高分
	var v = 0, u = 0; //最高分保存坐标
	for(var i=0;i<15;i++){
		myScore[i] = [];
		compScore[i] = [];
		for(var j=0;j<15;j++){
			myScore[i][j] = 0;
			compScore[i][j] = 0;
		}
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j] == 0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k] == 1){
							myScore[i][j] += 200;
						}else if(myWin[k] == 2){
							myScore[i][j] += 400;
						}else if(myWin[k] == 3){
							myScore[i][j] += 2000;
						}else if(myWin[k] == 4){
							myScore[i][j] += 10000;
						}

						if(compWin[k] == 1){
							compScore[i][j] += 220;
						}else if(compWin[k] == 2){
							compScore[i][j] += 420;
						}else if(compWin[k] == 3){
							compScore[i][j] += 2100;
						}else if(compWin[k] == 4){
							compScore[i][j] += 20000;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(compScore[i][j] > compScore[u][v]){
						u = i;
						v = j;
					}
				}

				if(compScore[i][j] > max){
					max = compScore[i][j];
					u = i;
					v = j;
				}else if(compScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v] = 2;

	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			compWin[k]++;
			myWin[k] = 6;
			if(compWin[k] == 5){
				scoreWhite++;
				gameOver(me);
			}
		}
	}
	if(!over){
		me = !me;
	}
};

var gameOver = function(me){
	scoreB.innerHTML = scoreBlack;
	scoreW.innerHTML = scoreWhite;
	over = true;
	var a;
	if(me){
		a = confirm('BlackChess Win in this Round!')
	}else{
		a = confirm('WhiteChess Win in this Round!')
	}
	
	if(a){
		setTimeout(function(){
			newGame();
			drawChessBoard();
		},500);
	}
}

newGameBtn.onclick = function(){
	newGame();
	drawChessBoard();
};
singleBtn.onclick = function(){
	isSingle = true;
	singleBtn.disabled = true;
	if(doubleBtn.disabled){
		doubleBtn.disabled = false;
	}
	newGame();
	drawChessBoard();
}
doubleBtn.onclick = function(){
	isSingle = false;
	doubleBtn.disabled = true;
	if(singleBtn.disabled){
		singleBtn.disabled = false;
	}
	newGame();
	drawChessBoard();
}
scoreSet.onclick = function(){
	scoreBlack = 0;
	scoreWhite = 0;
	scoreB.innerHTML = scoreBlack;
	scoreW.innerHTML = scoreWhite;
}

//赢法数组
wins = [];
count = 0;//赢法索引
for(var i=0;i<15;i++){
	wins[i] = [];
	for(var j=0;j<15;j++){
		wins[i][j] = [];
	}
}
//所有横向赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
//所有纵向赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
//所有斜向赢法
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
//所有反斜向赢法
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}
