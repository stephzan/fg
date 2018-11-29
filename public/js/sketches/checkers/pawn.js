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
	var options = [
		grid[this.i+1][this.j+1], 
		grid[this.i-1][this.j-1], 
		grid[this.i+1][this.j-1],
		grid[this.i-1][this.j+1] 
	]

	for(var i = 0; i < options.length; i++){
		var available = false;//cell fullfield status

		var cell = options[i];
		
		

		if(cell.pawn === undefined){
			//if empty cell
			available = true;
		}else{
			console.log(cell.coord+": ");
			console.log(cell.pawn);
		}

		if(available === true){
			cell.toggle();
		}
		
	}
}