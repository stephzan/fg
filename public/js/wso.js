var wSocket;
var resourceId;

var players = [];

var wsSession;

var Wso = function(channel){
	this.channel = channel;
      this.msgField = $("#alert ul");

	wSocket = WS.connect("ws://127.0.0.1:8080");

	wSocket.on("socket/connect", function (session) {
            session.subscribe("channel/community/1", function(uri, payload){    
                  alert(payload.msg);           
            });		
	});
};
Wso.prototype.displayMessage = function(message){
      var msg = "<li>"+message+"</li>"
      this.msgField.append(msg);
}
Wso.prototype.testConnection = function(){
	console.log(this.channel);
}
Wso.prototype.handleInstruction = function(instruction){
      switch(instruction){
            default:
                  console.log("Bad instruction: ");
                  break;
            case "subscribe":
                  var data = resp.data;
                  var idPlayer = $("#hid_player_id").val();
                  resourceId = data.resourceId;
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

                  players.push(data.player.player);

                  console.log(players);


                  break;      
      }
}
Wso.prototype.subscribe = function(){
      this._session.subscribe(this.channel, function(uri, payload){    
            //console.log(payload.msg)          ;
            //console.log(typeof(payload.msg));
            if(payload.msg.includes("api_instruction")){
                  var resp = JSON.parse(payload.msg);      
                  var instruction = resp.comm.instruction;

                  if(instruction !== undefined){
                        this.handleInstruction(instruction);
                  }else{
                        this.displayMessage("Error WS request: No instruction");
                        this.displayMessage(resp);
                  }                       
            }else{
                  this.displayMessage(payload.msg)
            }           
      });
}