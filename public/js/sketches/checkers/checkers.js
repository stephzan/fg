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

var activePawn;

var target;//{Pawn that will be cathced,  Cell behind target}

var dicLetters;

var playerOne;
var playerTwo;
var players=[];
var playersIndex = 0;
var activePlayer;
var me;

var playBothSide = true;//Set to false for test and prod

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
	nextPlayer();

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
			side = (j < 4) ? "dark" : "light";
			if( ((j < 3)|| (j > 4))&& ((i + j) % 2 != 0) )
				pawns[i][j] = new Pawn(i, j, cellW, color, side);
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

	var webSocket = WS.connect("ws://127.0.0.1:8080");

	webSocket.on("socket/connect", function (session) {
	    //session is an Autobahn JS WAMP session.

	    //console.log("Successfully Connected!");

	    session.subscribe("channel/room/"+roomId+"", function (uri, payload) {
            //console.log("Received message", payload);
            //msgList.append("<li>"+payload.msg+"</li>");
            if(payload.msg.includes("api_instruction")){
            	var resp = JSON.parse(payload.msg);
            	var instruction = resp.comm.instruction;
            	switch(instruction){
            		case "loadUserList":
            			var nbPlayers = resp.users.length;
            			var nbSeats = $("#hid_nb_seats").val();

            			for(var i=0; i<nbPlayers; i++){
            				var playerId = resp.users[i].id;
            				var playerName = resp.users[i].name;
            				var playerPosition = resp.users[i].position;

            				$("#cont_seat_playername_"+resp.users[i].position+"").html(resp.users[i].name);
            				$("#hid_player_data_"+resp.users[i].position+"").attr("data-playername", resp.users[i].name);
            				$("#hid_player_data_"+resp.users[i].position+"").attr("data-playerid", resp.users[i].id);

            				players.push(resp.users[i]);
            			}

            			if(nbPlayers == nbSeats){
            				roomComplete = true;
            				players[0].side = "light";
            				players[1].side = "dark";
            				activePlayer = players[0];
            			}

            			if(roomComplete === true){
            				session.publish("channel/room/"+roomId+"", "Game start");
            			}else{
            				session.publish("channel/room/"+roomId+"", "Waiting player");
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

/*function loadPlayers(){
	var webSocket = WS.connect("ws://127.0.0.1:8080");
	roomId = $("#hid_room_id").val();
	nbSeats = $("#hid_nb_seats").val();	

	webSocket.on("socket/connect", function (session) {
		session.subscribe("channel/room/"+roomId+"", function(uri, payload){
			//console.log(uri);
			console.log(payload.msg);

			var pl = JSON.parse(payload.msg);
			var type = "text";		
			var instruction = "";	
			if(pl.comm.type !== undefined){
				type = pl.comm.type;
				instruction = pl.comm.instruction;

				console.log(type+": "+instruction);
			}

			switch(type){
				default:
				case "text":
					$("#cont_alert").html(payload.msg);
					$("#cont_alert").show();
					setTimeout('$("#cont_alert").hide()', 2000);
					break;
				case "api_instruction":
					switch(pl.comm.instruction){
						case "loadUserList":
							var users = pl.users;
							for(var i = 0; i<users.length; i++){
								console.log(users[i]);

								$("#cont_seat_playername_"+users[i].position+"").html(users[i].name);
								$("#hid_player_data_"+users[i].position+"").attr("data-playername", users[i].name);
								$("#hid_player_data_"+users[i].position+"").attr("data-playerid", users[i].id);

								players.push(users[i]);
							}

							console.log(players);
							console.log(players.length);
							console.log(users);
							console.log(parseInt(nbSeats));

							if(players.length === parseInt(nbSeats)){
								tableComplete = true;
								console.log("complete");
							}
							break;
					}
					break;

			}

			console.log(tableComplete);
			if(tableComplete === true){
				//Start game
				players[0].side = "light";
				players[1].side = "dark";

				activePlayer = players[playersIndex];
				console.log(activePlayer);
			}else{
				var loadPlayersMsg = {type: "api_instruction", msg: "loadUserList"};
		    	session.publish("channel/room/"+roomId+"", loadPlayersMsg);
			}						
		})			
		var loadPlayersMsg = {type: "api_instruction", msg: "loadUserList"};
    	session.publish("channel/room/"+roomId+"", loadPlayersMsg);
	});
}*/

/*function loadPlayers(){	
	var nbSeats = $("#hid_nbseats").val();
	var playerData = $(".hid_player_data");	

	if(playerData.length === 0){
		setTimeout("loadPlayers();", 2000);
	}else{
		$.each(playerData, function(){
			var playerId = $(this).attr("data-playerid");
			var playerName = $(this).attr("data-playername");
			var player = {id: playerId, name: playerName, side: ""};
			
			var playerLoaded = false;
			$.each(players, function(){
				if(this.id === playerId){
					playerLoaded = true;
				}
			})

			if(playerLoaded === false){
				players.push(player);
			}

		})

		var roomComplete = (nbSeats === playerData.length);

		if(roomComplete === false){
			setTimeout("loadPlayers();", 2000);
			//console.log(players);
		}else{
			//Start game
			activeplayer = players[playersIndex];
		}
	}	
}*/

function nextPlayer(){
	var nextIndex = playersIndex+1;//Increment index

	if(players[nextIndex] !== undefined){
		playersIndex++;	
	}else{
		playersIndex = 0;
	}

	activePlayer = players[playersIndex];

	console.log(activePlayer);
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
			if(pawns[i][j] !== undefined&& pawns[i][j].side === activePlayer.side){
				if(playBothSide === false){
					if(activePlayer === me){
						if(pawns[i][j].contains(mouseX, mouseY)){					
							pawns[i][j].calculateOptions();
						}
					}
				}else{
					if(pawns[i][j].contains(mouseX, mouseY)){					
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