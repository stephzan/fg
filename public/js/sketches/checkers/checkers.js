var cnv;
var grid;
var pawns;
var parentW = document.getElementById("board").offsetHeight;
var cnvW = Math.floor(parentW * 0.85);
var cnvH = cnvW;

var cellW = cnvW/8;
var cellColorLight;
var cellColorDark;

var activeCells=[];

var cols = Math.floor(cnvW / cellW);
var rows = Math.floor(cnvH / cellW);

var pawnColorLight;
var pawnColorDark;

var activePawn;

var dicLetters;

var playerOne;
var playerTwo;
var players;
var activePlayer;
var me;

function Cell(i, j, w, color, coord){
	this.i = i;
	this.j = j;
	this.x = i * w;
	this.y = j * w;
	this.w = w;
	this.c = color;
	this.coord = coord;

	this.active = false;

	this.pawn = false;


}
Cell.prototype.show = function(){
	fill(this.c);
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

function Pawn(i, j, w, color){
	this.i = i;
	this.j = j;
	this.x = i * w;
	this.y = j * w;
	this.w = w;
	this.c = color;

	this.active = false;
}
Pawn.prototype.show = function(){
	fill(this.c);
	if(this.active === true){
		fill(123);
	}
	ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w, this.w);
}
Pawn.prototype.contains = function(x, y){
	return (x > this.x&& x < this.x+this.w&& y > this.y&& y < this.y+this.w);
}
Pawn.prototype.toggle = function(){
	this.active = !this.active;
}
Pawn.prototype.calculateOptions = function(i, j){
	var options = [];
	if((grid[this.i+1] !== undefined)&& (grid[this.i+1][this.j+1]!= undefined)){
		options.push(grid[this.i+1][this.j+1]);
	}
	if((grid[this.i-1] !== undefined)&& (grid[this.i-1][this.j-1]!= undefined)){
		options.push(grid[this.i-1][this.j-1]);
	}
	if((grid[this.i+1] !== undefined)&& (grid[this.i+1][this.j-1]!= undefined)){
		options.push(grid[this.i+1][this.j-1]);
	}
	if((grid[this.i-1] !== undefined)&& (grid[this.i-1][this.j+1]!= undefined)){
		options.push(grid[this.i-1][this.j+1]);
	}
	
	resetActive();
	this.active = true;
	activePawn = this;

	for(var i = 0; i < options.length; i++){
		var available = false;//cell fullfield status

		var cell = options[i];
				
		if(cell.pawn === undefined){
			//if empty cell. No back allowed.
			if(cell.j < j){
				available = true;
			}
			
		}else{
			console.log(cell.coord+": ");
			console.log(cell.pawn);
		}

		if(available === true){
			cell.active = true;
			activeCells.push(cell);
		}		
	}
}
Pawn.prototype.moveToTarget = function(cell){

	//Store actual data
	var prevI = this.i;
	var prevJ = this.j;

	//Define new position for the pawn
	this.x = cell.x;
	this.y = cell.y;

	//Defin new indexes of the pawn
	this.i = cell.i;
	this.j = cell.j;
	
	//Add pawn to his new indexes
	pawns[this.i][this.j] = this;

	//Remove old indexes in pawns and grid
	pawns[prevI][prevJ] = undefined;
	grid[prevI][prevJ].pawn = undefined;

	resetActive();

}

function centerCanvas() {
  var x = (parentW - cnvW) / 2;
  var y = (parentW - cnvH) / 2;
  cnv.position(x, y);
}

function makeGrid(cols, rows, cellW){
	var color;
	var letter;
	var coord;

	for(i = 0; i < cols; i++){	
		letter = dicLetters.get(i+1);	
		for(j = 0;  j< rows; j++){
			color = ((i + j) % 2 == 0) ? cellColorLight : cellColorDark;
			coord = letter+(rows-j);

			grid[i][j] = new Cell(i, j, cellW, color, coord);
		}	
	}
}

function addPawns(cols, rows, cellW){
	var color;
	for(i = 0; i < cols; i++){		
		for(j = 0;  j< rows; j++){
			color = (j < 4) ? pawnColorDark : pawnColorLight;
			if( ((j < 3)|| (j > 4))&& ((i + j) % 2 != 0) )
				pawns[i][j] = new Pawn(i, j, cellW, color);
				grid[i][j].setPawn(pawns[i][j]);//Assign pawn to cell
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

	dicLetters = createStringDict({1:"A", 2:"B", 3:"C", 4:"D", 5:"E", 6:"F", 7:"G", 8:"H"});

	makeGrid(cols, rows, cellW);//Construct grid
	addPawns(cols, rows, cellW);
}

function resetActive(){
	for(i = 0; i < cols; i++){
		for(j = 0;  j< rows; j++){
			grid[i][j].active = false;//Reset all active cells	

			if(pawns[i][j] !== undefined){
				pawns[i][j].active = false;
			}
		}
	}

	activeCells = [];//empty activecells
	activePawn = "";
}

function mousePressed(){
	/* if click on pawn */	
	for(i = 0; i < cols; i++){
		for(j = 0;  j< rows; j++){			
			if(pawns[i][j] !== undefined){
				if(pawns[i][j].contains(mouseX, mouseY)){					
					pawns[i][j].calculateOptions(i, j);
				}
			}
		}	
	}/* END */

	for(var i = 0; i < activeCells.length; i++){
		var cell = activeCells[i];

		if(cell.contains(mouseX, mouseY)){
			console.log("Target: " + cell.coord);
			var pawn = activePawn;
			cell.pawn = pawn;

			pawn.moveToTarget(cell);

		}
	}
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