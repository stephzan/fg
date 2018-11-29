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
			coord = letter+(j+1);

			grid[i][j] = new Cell(i, j, cellW, color, coord);
		}	
	}
}

function addPawns(cols, rows, cellW){
	var color;
	for(i = 0; i < cols; i++){		
		for(j = 0;  j< rows; j++){
			color = (j < 4) ? pawnColorLight : pawnColorDark;
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

function mousePressed(){
	for(i = 0; i < cols; i++){
		for(j = 0;  j< rows; j++){
			grid[i][j].active = false;//Reset all active cells
			if(pawns[i][j] !== undefined){
				if(pawns[i][j].contains(mouseX, mouseY)){
					pawns[i][j].toggle();
					pawns[i][j].calculateOptions();
				}
			}
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