function loadFreshContent(elmnt, controllerAction, dataType){
	var url = controllerAction;
	var element = $("#"+elmnt+"");
	$.ajax({
	  dataType: dataType,
	  url: url,
	  data: {},
	  success: function(resp){
	  	element.html(resp);	
	  	$("#info_nbplayer").html($("#hid_info_nbplayer").val());//hid_info_nbplayer: see home/list.html.twig
	  	$("#info_nbroom").html($("#hid_info_nbroom").val());//hid_info_nbplayer: see home/list.html.twig
	  }
	});

	setTimeout('loadFreshContent("'+elmnt+'", "'+controllerAction+'", "'+dataType+'")', 20000);
}

function ajaxQuery(controller, action, data, callback){
	var url = controller;
	var data = {action: action, data: data};
	var dataString = JSON.stringify(data);

	var req = $.ajax({
	    method: "post",
	    url: url,
	    data: {params: dataString},
	    dataType: "json",
	}).done( function(response) {
	    callback(response);
	}).fail(function(jxh,textmsg,errorThrown){
	    console.log(errorThrown+": "+jxh.responseText);
	});
}

var handleSeatAssign = function(result){
	if(result.data !== ""){
		//redirect
		document.location.href = "room/"+result.data+"";
	}else{
		alert(result.error);
	}
}

$(document).ready(function(){
	if($("#player_list")){
		loadFreshContent("player_list", "user/list/1" , "html");
	}

	if($("#home_rooms")){
		loadFreshContent("home_rooms", "room/list/1" , "html");
	}

	if($("#room_private")){
		$("#room_private").on("click", function(){
			if($(this).prop("checked") === true){
				$("#room_password").removeAttr("disabled");
			}else{
				$("#room_password").attr("disabled", "disabled");
			}
		})
	}

	$("#home_rooms").on("click", ".get_seat", function(e){
		e.preventDefault();

		var idSeat = $(this).attr("data-seatid");
		var position = $(this).attr("data-seatposition");
		var idUser = $(this).attr("data-userid");

		var data = [{'idSeat': idSeat, 'idUser': idUser}];
		var req = ajaxQuery("seat/assign", "assign", data, handleSeatAssign)
	})
})