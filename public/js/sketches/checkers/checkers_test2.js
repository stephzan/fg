var parentW = document.getElementById("board").offsetHeight;
var cnvW = Math.floor(parentW * 0.85);
var cnvH = cnvW;

var cellColorLight;
var cellColorDark;
var pawnColorLight;
var pawnColorDark;
var sideColors = ["light", "dark"];

var nbSeats
var players=[];
var me;
var activePlayer;
var playerIndex = 0;

var dicLetters;
var invertDicLetters;

var cellW = cnvW/8;
var cols = Math.floor(cnvW / cellW);
var rows = Math.floor(cnvH / cellW);

var boardInversed = false;

function Cell(i, j, w, color, coord){
	this.i = i;
	this.j = j;
	this.x = i * w;
	this.y = j * w;
	this.w = w;
	this.color = color;
	this.coord = coord;

	this.active = false;

	this.pawn = false;


}
Cell.prototype.show = function(){
	fill(this.color);
	if(this.active === true){
		fill(204, 255, 204);
	}
	rect(this.x, this.y, this.w, this.w);

	/* DEBUG */
	fill(255);
	text(this.coord, this.x, this.y+10);
}
Cell.prototype.contains = function(x, y){
	return (x > this.x&& x < this.x+this.w&& y > this.y&& y < this.y+this.w);
}
Cell.prototype.toggle = function(){
	this.active = !this.active;
}
Cell.prototype.setPawn = function(pawn){
	this.pawn = pawn;
}

function makeGrid(cols, rows, cellW){
	var color;
	var letter;
	var coord;
	var dic = dicLetters;
	console.log(boardInversed);

	if(boardInversed === true){
		dic = invertDicLetters;
		for(var i = 0; i < cols; i++){	
			letter = dic.get(i+1);	
			for(var j = (rows-1);  j >= 0; j--){
				color = ((i + j) % 2 == 0) ? cellColorLight : cellColorDark;
				coord = letter+(j+1);

				grid[i][j] = new Cell(i, j, cellW, color, coord);
			}	
		}
	}else{
		for(var i = 0; i < cols; i++){	
			letter = dic.get(i+1);	
			for(var j = 0;  j< rows; j++){
				color = ((i + j) % 2 == 0) ? cellColorLight : cellColorDark;
				coord = letter+(rows-j);

				grid[i][j] = new Cell(i, j, cellW, color, coord);
			}	
		}
	}

	

	console.log(grid);
}

function setup(){
	cnv = createCanvas(cnvW+1, cnvH+1);
	cnv.parent("board");
	background(255);

	grid = make2DArray(cols, rows);//Set array as cols and rows
	pawns = make2DArray(cols, rows);//Set array as cols and rows

	cellColorLight = color(182, 155, 76);
	cellColorDark = color(130, 82, 1);

	pawnColorLight = color(255, 255, 255);
	pawnColorDark = color(0, 0, 0);

	dicLetters = createStringDict({1:"A", 2:"B", 3:"C", 4:"D", 5:"E", 6:"F", 7:"G", 8:"H"});
	invertDicLetters = createStringDict({1:"H", 2:"G", 3:"F", 4:"E", 5:"D", 6:"C", 7:"B", 8:"A"});
	boardInversed = false;
	makeGrid(cols, rows, cellW);//Construct grid
}

function draw(){
	for(var i = 0; i < cols; i++){
		for(var j = 0;  j< rows; j++){
			grid[i][j].show();//Draw cells

			if(pawns[i][j] !== undefined){
				pawns[i][j].show();//Draw pawns
			}
		}	
	}
}