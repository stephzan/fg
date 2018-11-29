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