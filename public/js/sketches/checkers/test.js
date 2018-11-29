var cols = 8;
var rows = 8;

cellW = 50;

function setup(){
	cnv = createCanvas(400, 400);
	cnv.parent("board");
}

function draw(){
	background(0);

	for(i = 0; i < cols; i++){		
		for(j = 0;  j< rows; j++){
			fill(255);
			rect(i*cellW, j*cellW, cellW, cellW);
			fill(0);
			textSize(15);
			text((i+1)+ " - " +(rows-j), i*cellW+cellW*0.3, j*cellW+cellW*0.5);
		}
	}
}