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
})