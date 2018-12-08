var roomId;
var nbSeats;
var tableComplete = false;

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

var sideColors = ["light", "dark"];

var activePawn;

var target;//{Pawn that will be cathced,  Cell behind target}

var dicLetters;
var invertDicLetters;

var playerOne;
var playerTwo;
var players=[];
var playersIndex = 0;
var activePlayer;
var me;

var playBothSide = false;//Set to false for test and prod

var webSocket = WS.connect("ws://127.0.0.1:8080");
var wsSession;
var channel;

var movement = {from: {i: "", j: ""}, to: {i: "", j: ""}, player: ""};

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

function centerCanvas() {
  var x = (parentW - cnvW) / 2;
  var y = (parentW - cnvH) / 2;
  cnv.position(x, y);
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

function addPawns(cols, rows, cellW){
	var color;

	if(boardInversed === true){
		dic = invertDicLetters;
		for(var i = 0; i < cols; i++){		
			for(var j = rows-1;  j >= 0; j--){
				color = (j < 4) ? pawnColorLight : pawnColorDark;
				side = (j < 4) ? sideColors[0] : sideColors[1];
				console.log(i+" -- "+j);
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
	invertDicLetters = createStringDict({1:"H", 2:"G", 3:"F", 4:"E", 5:"D", 6:"C", 7:"B", 8:"A"});

	makeGrid(cols, rows, cellW);//Construct grid
	addPawns(cols, rows, cellW);

	loadPlayers();

	/*playerOne = {name: "Stéphane Carolooo", side: "light"};
	me = playerOne;
	playerTwo = {name: "Superadmin Steph", side: "dark"};
	players = [playerOne, playerTwo];

	activePlayer = players[playersIndex];

	console.log(activePlayer);*/
}

function loadPlayers(){
	var msgList = $("#cont_alert ul");
	var roomId = $("#hid_room_id").val();
	var roomComplete = false;
	var meId = $("#hid_player_id").val();	
	channel = "channel/room/"+roomId+"";

	webSocket.on("socket/connect", function (session) {
	    //session is an Autobahn JS WAMP session.

	    //console.log("Successfully Connected!");

	    wsSession = session;

	    wsSession.subscribe("channel/room/"+roomId+"", function (uri, payload) {
            console.log("Received message", payload);
            //msgList.append("<li>"+payload.msg+"</li>");
            if(payload.msg.includes("api_instruction")){
            	var resp = JSON.parse(payload.msg);
            	var instruction = resp.comm.instruction;
            	switch(instruction){
            		default:
            			console.log("Bad instruction: "+instruction);
            			break;
            		case "subscribe":
            			var data = resp.data;
            			var idPlayer = $("#hid_player_id").val();
            			
            			resourceId = data.resourceId;
            			$("#hid_player_resource").val(resourceId);

            			var instruction = {type: "api_instruction", msg: "register", data: idPlayer};
            			session.publish(channel, instruction);
            			break;
            		case "register":
            			var data = resp.data;
            			$("#cont_alert ul").append("<li>"+data.player.player.name+" is conneccted</li>");
            			var instruction = {type: "api_instruction", msg: "loadUserList"};
            			session.publish(channel, instruction);
            			break;
            		case "setMovement":
            			console.log("SM");
            			var data = resp.data;
            			console.log(data);
            			if(data.player.id != me.id){
            				var pawn = pawns[data.from.i][data.from.j];
            				var target = grid[data.to.i][data.to.j];

            				pawn.moveToTarget(target);
            			}
            			break;
            		case "nextPlayer":
            		console.log("NP");
            		//TODO: fucking bug with nextPlayer
            			nextPlayer(true);
            			break;
            		case "loadUserList":
            		console.log(resp.users);
            			var nbPlayers = resp.users.length;
            			var nbSeats = $("#hid_nb_seats").val();

            			for(var i=0; i<nbPlayers; i++){
            				var playerId = resp.users[i].id;
            				var playerName = resp.users[i].name;
            				var playerPosition = resp.users[i].position;

            				resp.users[i].me = false;

            				if(resp.users[i].id == meId){
            					resp.users[i].me = true;
            				}

            				$("#cont_seat_playername_"+resp.users[i].position+"").html(resp.users[i].name);
            				$("#hid_player_data_"+resp.users[i].position+"").attr("data-playername", resp.users[i].name);
            				$("#hid_player_data_"+resp.users[i].position+"").attr("data-playerid", resp.users[i].id);

            				players.push(resp.users[i]);

            				if(resp.users[i].me === true){
            					me = resp.users[i];
            				}
            			}

            			if(nbPlayers == nbSeats){
            				roomComplete = true;
            				players[0].side = sideColors[0];
            				players[1].side = sideColors[1];
            				activePlayer = players[playersIndex];

            				//console.log(me);
            				console.log(activePlayer);

            				if(me.side === sideColors[1]){
            					swap();
            				}  

            				//console.log(pawns);     	
            			}

            			if(roomComplete === true){
            				wsSession.publish(channel, {type: "communication", msg: "Game start"});
            			}else{
            				wsSession.publish(channel, {type: "communication", msg: "Waiting player"});
            			}
            			break;
            	}
            }                      
        });
	});

	webSocket.on("socket/disconnect", function (error) {
	    //error provides us with some insight into the disconnection: error.reason and error.code

	    console.log("Disconnected for " + error.reason + " with code " + error.code);
	});
}

function swap(){
	boardInversed = true;
	makeGrid(cols, rows, cellW);//Construct grid
	addPawns(cols, rows, cellW);

	cnv.redraw();
	//$("#board canvas").addClass("rotate");
	/*for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			if(pawns[i][j] != undefined){
				pawns[i][j].changeSide();
			}
		}
	}*/
}

function highlightActiveplayer(){
	var pos = activePlayer.position;

	//TODO: change style of active player row
	/*$(".seat_"+pos+"").removeClass("bg-light");
	$(".seat_"+pos+"").css("backgroundColor", "lightgreen");*/
}

function nextPlayer(wsInstruction){
	if(wsInstruction !== undefined&& wsInstruction === true){
		var nextIndex = playersIndex+1;//Increment index

		if(players[nextIndex] !== undefined){
			playersIndex++;	
		}else{
			playersIndex = 0;
		}

		activePlayer = players[playersIndex];

		highlightActiveplayer();

		console.log(activePlayer);
	}else{
		wsSession.publish(channel, {type: "api_instruction", msg: "setMovement", data: movement});
		wsSession.publish(channel, {type: "api_instruction", msg: "nextPlayer"});
	}	
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
			if(pawns[i][j] !== undefined&& activePlayer.me === true){
				if(playBothSide === false){
					if(pawns[i][j].contains(mouseX, mouseY)){					
						console.log(pawns[i][j]);
						
						movement.player = activePlayer;
						movement.from.i = j;			
						movement.from.j = i;

						pawns[i][j].calculateOptions();							
					}
				}else{
					if(pawns[i][j].contains(mouseX, mouseY)){	
						movement.player = activePlayer;
						movement.from.i = j;			
						movement.from.j = i;

						pawns[i][j].calculateOptions();						
					}
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

			movement.to.i = cell.i;
			movement.to.j = cell.j;

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