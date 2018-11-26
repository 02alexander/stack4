var lineThicknes = 3;

let ring = document.createElement("img");
ring.src = "static/ring.png";
let kryss = document.createElement("img");
kryss.src = "static/kryss.png";

var gameIsOver = false;

function localGame() {
	gameArea.start();
	stack4.start();
	stack4.renderLines();

	stack4.renderBoard();
	//stack4.highlightAccecpableMoves();

	window.addEventListener('mousedown', function(e) {

		if (gameIsOver) {
			return;
		}

		let rect = gameArea.canvas.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		let boardCordx = Math.floor(x / (gameArea.canvas.width/9));
		let boardCordy = Math.floor(y / (gameArea.canvas.height/9));
		console.log(boardCordx);
		console.log(boardCordy);
		console.log("\n");
		stack4.placePiece(boardCordx,boardCordy);
		stack4.renderBoard();
		let wn = stack4.hasWon(1);
		if (wn[0]) {
			console.log("\nring");
			console.log("start (" + wn[1] + ", " + wn[2] + ")");
			console.log("end (" + wn[3] + ", " + wn[4] + ")");
			let start = stack4.getRect(wn[1], wn[2]);
			let startx = start.x + start.w/2;
			let starty = start.y + start.h/2;

			let end = stack4.getRect(wn[3], wn[4]);
			let endx = end.x + end.w/2;
			let endy = end.y + end.h/2;
			gameArea.drawLine(startx, starty, endx, endy);
			gameIsOver = true;
		}
		wn = stack4.hasWon(2);
		if (wn[0]) {
			console.log("\nkryss");
			console.log("start (" + wn[1] + ", " + wn[2] + ")");
			console.log("end (" + wn[3] + ", " + wn[4] + ")");
			let start = stack4.getRect(wn[1], wn[2]);
			let startx = start.x + start.w/2;
			let starty = start.y + start.h/2;

			let end = stack4.getRect(wn[3], wn[4]);
			let endx = end.x + end.w/2;
			let endy = end.y + end.h/2;
			gameArea.drawLine(startx, starty, endx, endy);
			gameIsOver = true;
		}

		//stack4.highlightAccecpableMoves();
	});

}

var gameArea = {
	canvas: document.createElement("canvas"),
	start: function() {
		this.canvas.width = 480;
		this.canvas.height = 480;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	},
	clear: function() {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	drawLine: function(x1, y1, x2, y2) {
		let ctx = this.context;
		ctx.strokeStyle= "green";
		ctx.fillStyle = "green";
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	}
}

var stack4 = {
	renderLines: function() {
		ctx = gameArea.context;
		ctx.fillStyle = "black";

		for (let i = 0; i < 9; ++i) {
			ctx.fillRect(0, i*(gameArea.canvas.height/9), gameArea.canvas.width, lineThicknes);
		}
		for (let i = 0; i < 9; ++i) {
			ctx.fillRect(i*(gameArea.canvas.width/9), 0, lineThicknes, gameArea.canvas.height);
		}
		ctx.fillRect(gameArea.canvas.width-lineThicknes,0,lineThicknes,gameArea.canvas.height);
		ctx.fillRect(0,gameArea.canvas.height-lineThicknes,gameArea.canvas.width,lineThicknes);

	},
	start: function() {
		this.board = [];
		this.whoseTurn = 2;
		for (let i = 0; i < 9; ++i) {
			this.board.push([])
			for (let j = 0; j < 9; ++j) {
				this.board[i].push(0);
			}
		}
	},
	renderBoard: function() {
		for (let xCord = 0; xCord < 9; ++xCord) {
			for (let yCord = 0; yCord < 9; ++yCord) {
				let img;
				if (this.board[xCord][yCord] === 1) {
					img = ring;
				} else if (this.board[xCord][yCord] === 2) {
					img = kryss;
				}
				if (img == undefined) {
					continue;
				} 
				let rect = this.getRect(xCord, yCord);
				gameArea.context.drawImage(img, rect.x, rect.y, rect.w, rect.h);
			}
		}
	},
	isAcceptableMove: function(x, y) {
		if (this.board[x][y] !== 0) {
			return false;
		}
		return isArrayEqual(this.dropResult(0,y,1,0),[x,y]) || 
			   isArrayEqual(this.dropResult(8,y,-1,0),[x,y]) || 
			   isArrayEqual(this.dropResult(x,0,0,1),[x,y]) || 
			   isArrayEqual(this.dropResult(x,8,0,-1),[x,y]);
	},
	dropResult: function(x, y, deltax, deltay) {
		for (let i = 0; i < 9; ++i) {
			if (this.board[x+deltax*i][y+deltay*i] === 0) {
				return [x+deltax*i, y+deltay*i];
			}
		}
		return null;
	},
	getRect: function(xCord, yCord) {
		let width = gameArea.canvas.width/9-lineThicknes;
		let height = gameArea.canvas.height/9-lineThicknes;
		if (xCord === 8) {
			width -= lineThicknes;
		}
		if (yCord === 8) {
			height -= lineThicknes;
		}
		return { x: xCord*(gameArea.canvas.width/9)+lineThicknes, 
				 y: yCord*(gameArea.canvas.height/9)+lineThicknes,
				 w: width,
				 h: height };
	},

	highlightAccecpableMoves: function() {
		for (let xCord = 0; xCord < 9; ++xCord) {
			for (let yCord = 0; yCord < 9; ++yCord) {
				if (this.isAcceptableMove(xCord, yCord)) {
					let width = gameArea.canvas.width/9-lineThicknes;
					if (xCord == 8) {
						width -= lineThicknes;
					}
					let height = gameArea.canvas.height/9-lineThicknes;
					if (yCord == 8) {
						height -= lineThicknes;
					}
					let ctx = gameArea.context;
					ctx.fillStyle = "green";
					ctx.fillRect(xCord*(gameArea.canvas.width/9)+lineThicknes,
								 yCord*(gameArea.canvas.height/9)+lineThicknes,
								 width,
								 height);
					}
			}
		}
	},
	placePiece: function(x, y) {
		if (this.isAcceptableMove(x,y)) {
			this.board[x][y] = this.whoseTurn;
			this.whoseTurn = !(this.whoseTurn-1)+1;
		}
	},
	hasWon: function(player) {
		let directions = [[0,1], [1,1], [1,0], [-1,1]];
		for (let x = 0; x < 9; ++x) {
			for (let y = 0; y < 9; ++y) {
				for (let dir = 0; dir < 4; ++dir) {
					let isBroken = false;
					for (var c = 0; c < 4; ++c) {
						if (!(x+c*directions[dir][0]>=0 && x+c*directions[dir][0]<9 && y+c*directions[dir][1]>=0 && y+c*directions[dir][1]<9)) {
							isBroken = true;
							continue;
						}
						if (this.board[x+c*directions[dir][0]][y+c*directions[dir][1]] !== player) {
							isBroken = true;
						}
					}
					if (isBroken === false) {
						return [true, x, y, x+(c-1)*directions[dir][0],y+(c-1)*directions[dir][1]];
					}
				}
			}
		}
		return [false, null, null];
	}
}

let isArrayEqual = function (a, b) {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}