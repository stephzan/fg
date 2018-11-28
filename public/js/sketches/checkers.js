var cnv;
var grid;
var pawns;
var parentW = document.getElementById("board").offsetHeight;
var cnvW = Math.floor(parentW * 0.85);
var cnvH = cnvW;

var cellW = cnvW/8;
var cellColorLight;
var cellColorDark;

var cols = Math.floor(cnvW / cellW);
var rows = Math.floor(cnvH / cellW);

var pawnColorLight;
var pawnColorDark;

function Cell(x, y, w, color){
	this.x = x;
	this.y = y;
	this.w = w;
	this.c = color;


}
Cell.prototype.show = function(){
	fill(this.c);
	rect(this.x, this.y, this.w, this.w);
}

function Pawn(x, y, w, color){
	this.x = x;
	this.y = y;
	this.w = w;
	this.c = color;
}
Pawn.prototype.show = function(){
	fill(this.c);
	ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w, this.w);
}

function centerCanvas() {
  var x = (parentW - cnvW) / 2;
  var y = (parentW - cnvH) / 2;
  cnv.position(x, y);
}

function makeGrid(cols, rows, cellW){
	var color;
	for(i = 0; i < cols; i++){		
		for(j = 0;  j< rows; j++){
			color = ((i + j) % 2 == 0) ? cellColorLight : cellColorDark;
			grid[i][j] = new Cell(i * cellW, j * cellW, cellW, color);
		}	
	}
}

function addPawns(cols, rows, cellW){
	var color;
	for(i = 0; i < cols; i++){		
		for(j = 0;  j< rows; j++){
			color = j < 4 ? pawnColorLight : pawnColorDark;
			if( ((j < 3)|| (j > 4))&& ((i + j) % 2 != 0) )
				pawns[i][j] = new Pawn(i * cellW, j * cellW, cellW, color);
		}	
	}
}

function setup(){	
	cnv = createCanvas(cnvW+1, cnvH+1);
	cnv.parent("board");
	centerCanvas();

	background(255);

	cellColorLight = color(182, 155, 76);
	cellColorDark = color(130, 82, 1);

	pawnColorLight = color(255, 255, 255);
	pawnColorDark = color(0, 0, 0);

	grid = make2DArray(cols, rows);//Set array as cols and rows
	pawns = make2DArray(cols, rows);//Set array as cols and rows

	makeGrid(cols, rows, cellW);//Construct grid
	addPawns(cols, rows, cellW);
}

function draw(){
	for(i = 0; i < cols; i++){
		for(j = 0;  j< rows; j++){
			grid[i][j].show();//Draw cells

			if(pawns[i][j] !== undefined){
				pawns[i][j].show();//Draw pawns
			}
		}	
	}
}

function windowResized() {
	parentW = document.getElementById("board").offsetHeight;
	cnvW = Math.floor(parentW * 0.85);
	cnvH = cnvW;

	cellW = cnvW/8;

	cols = Math.floor(cnvW / cellW);
	rows = Math.floor(cnvH / cellW);

	makeGrid(cols, rows, cellW);//Construct grid
	addPawns(cols, rows, cellW);

	resizeCanvas(cnvW, cnvH);//Set to new size
	redraw();//Set all elements to new ratio
	centerCanvas();//Center canvas
}