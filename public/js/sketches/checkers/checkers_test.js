var cnv; 
var grid;
var pawns;

var parentW = document.getElementById("board").offsetHeight;
var cnvW = Math.floor(parentW * 0.85);
var cnvH = cnvW;

var cellW = cnvW/8;
var cols = Math.floor(cnvW / cellW);
var rows = Math.floor(cnvH / cellW);

var roomId;
var channel;

var wSocket;
var wsSession;

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
var boardInversed = false;

var roomComplete=false;

var dicLetters;

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

function Pawn(i, j, w, color, side){
	this.i = i;
	this.j = j;
	this.x = i * w;
	this.y = j * w;
	this.w = w;
	this.color = color;
	this.side = side;

	this.active = false;
}
Pawn.prototype.show = function(){
	fill(this.color);
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
Pawn.prototype.calculateOptions = function(){
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
			if(playBothSide === false){
				if(cell.j < this.j){
					available = true;
				}
			}else{
				available = true;
			}
			
		}else{
			if(cell.pawn.side != activePlayer.side){
				//check if catchable
				//Define direction to find the catch target
				var targetI = (this.i < cell.pawn.i) ? this.i+1 : this.i-1;
				var targetJ = (this.j < cell.pawn.j) ? this.j+1 : this.j-1;

				var nextI = (this.i < cell.pawn.i) ? this.i+2 : this.i-2;
				var nextJ = (this.j < cell.pawn.j) ? this.j+2 : this.j-2;
				

				if(grid[nextI] !== undefined&& grid[nextI][nextJ] !== undefined&& grid[nextI][nextJ].pawn === undefined){
					grid[nextI][nextJ].active = true;
					activeCells.push(grid[nextI][nextJ]);

					target = {pawn: {i: targetI, j: targetJ}, cell: grid[nextI][nextJ].coord};

					console.log("Try catch: "+grid[nextI][nextJ].coord);
				}
			}

			/*console.log(cell.coord+": ");
			console.log(cell.pawn.side);
			console.log(activePlayer.side);
			console.log(cell.pawn.side === activePlayer.side);*/
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

	//Check if pawn was target
	if(target !== undefined){
		if(target.cell === cell.coord){
			//Remove target pawn
			pawns[target.pawn.i][target.pawn.j] = undefined;
			grid[target.pawn.i][target.pawn.j].pawn = undefined;
		}

		target = undefined;//Reset target
	}

	resetActive();
	nextPlayer(false);

}
Pawn.prototype.changeSide = function(){
	this.side = (this.side === sideColors[0]) ? sideColors[1] : sideColors[0];
	this.color = (this.color === pawnColorLight) ? pawnColorDark : pawnColorLight;
}

function makeGrid(cols, rows, cellW){
	var color;
	var letter;
	var coord;

	console.log(boardInversed);

	if(boardInversed === true){
		for(var i = cols-1; i >=0; i--){	
			letter = dicLetters.get(i+1);	
			for(var j = rows-1;  j >=0; j--){
				color = ((i + j) % 2 == 0) ? cellColorLight : cellColorDark;
				coord = letter+(rows-j);

				grid[i][j] = new Cell(i, j, cellW, color, coord);
			}	
		}
	}else{
		for(var i = 0; i < cols; i++){	
			letter = dicLetters.get(i+1);	
			for(var j = 0;  j< rows; j++){
				color = ((i + j) % 2 == 0) ? cellColorLight : cellColorDark;
				coord = letter+(rows-j);

				grid[i][j] = new Cell(i, j, cellW, color, coord);
			}	
		}
	}	

	console.log(grid);
}

function addPawns(cols, rows, cellW){
	var color;
	console.log(boardInversed);
	if(boardInversed === true){
		for(var i = cols-1; i >=0; i--){		
			for(var j = rows-1;  j >=0; j--){
				color = (j < 4) ? pawnColorDark : pawnColorLight;
				side = (j < 4) ? sideColors[1] : sideColors[0];
				if( ((j < 3)|| (j > 4))&& ((i + j) % 2 != 0) )
					pawns[i][j] = new Pawn(i, j, cellW, color, side);
					grid[i][j].setPawn(pawns[i][j]);//Assign pawn to cell
			}	
		}
	}else{
		for(var i = 0; i < cols; i++){				
			for(var j = 0;  j< rows; j++){
				color = (j < 4) ? pawnColorDark : pawnColorLight;
				side = (j < 4) ? sideColors[1] : sideColors[0];
				if( ((j < 3)|| (j > 4))&& ((i + j) % 2 != 0) )
					pawns[i][j] = new Pawn(i, j, cellW, color, side);
					grid[i][j].setPawn(pawns[i][j]);//Assign pawn to cell
			}	
		}
	}

	console.log(pawns);

}

function setup(){
	loadPlayers();

	cnv = createCanvas(cnvW+1, cnvH+1);
	cnv.parent("board");
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

function loadPlayers(){
	roomId = $("#hid_room_id").val();
	channel = channel = "channel/room/"+roomId+"";

	nbSeats = $("#hid_nb_seats").val();

	for(var i = 0; i<nbSeats; i++){
		players[i] = {};
	}

	wSocket = WS.connect("ws://127.0.0.1:8080");
		wSocket.on("socket/connect", function (session) {
			session.subscribe(channel, function(uri, payload){	
				//console.log(payload.msg)		;
				//console.log(typeof(payload.msg));
	            if(payload.msg.includes("api_instruction")){
	            	var resp = JSON.parse(payload.msg);
	            	var instruction = resp.comm.instruction;
	            	var idPlayer = $("#hid_player_id").val();

	            	switch(instruction){
	            		default:
	            			console.log("Bad instruction: ");
	            			break;
	            		case "subscribe":
	            			var data = resp.data;
	            			resourceId = data.resourceId;
	            			$("#hid_player_resource").val(resourceId);

	            			var instruction = {type: "api_instruction", msg: "register", data: idPlayer};
	            			session.publish(channel, instruction);
	            			break;
	            		case "register":
	            			var data = resp.data;
	            			$("#cont_alert ul").append("<li>"+data.player.player.name+" is conneccted</li>");
	            			var playernameRow = $("#cont_seat_playername_"+data.player.player.position);
	            			var playerDataRow = $("#hid_player_data_"+data.player.player.position);
	            			playernameRow.html(data.player.player.name);
	            			playerDataRow.attr("data-playerid", data.player.player.id);
	            			playerDataRow.attr("data-playername", data.player.player.name);
	            			playerDataRow.attr("data-resource", data.player.player.resource);

	            			players[data.player.player.position-1] = data.player.player;
	            			if(parseInt(data.player.player.id) === parseInt(idPlayer)){
	            				me = data.player.player;
	            				if(me.position === 2){
	            					boardInversed = true;	            					
	            				}
	            			}

	            			if(parseInt(players.length) === parseInt(nbSeats)){
	            				roomComplete = true;
	            				activePlayer = players[playerIndex];
	            			}

	            			console.log(players);
	            			console.log(roomComplete);


	            			break;	
	            	}
	            }else{
	            	$("#alert ul").append("<li>"+payload.msg+"</li>");
	            }		
			});
		});
}

function draw(){
	//console.log(boardInversed);
	if(roomComplete === true){
		for(var i = 0; i < cols; i++){
			for(var j = 0;  j< rows; j++){
				grid[i][j].show();//Draw cells

				if(pawns[i][j] !== undefined){
					pawns[i][j].show();//Draw pawns
				}
			}	
		}
	}
}