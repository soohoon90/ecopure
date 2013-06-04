function showCategories(dest){
	for (c in iData){
		$("<a>").html(c).appendTo(dest);
		//var items = iData[c];
	}
};

function showItemsForCategory(c, dest){
	items = iData[c];

	// create div
	var u = $("<div>").attr("class", "items").addClass("clearfix");
	
	// populate div
	for (i in items){
		var price = iData[c][i];
		$("<a>").html("<p>"+i+"</p>").appendTo(u);
	}

	// add div to dest
	dest.html(u);
}

$(function(){

  $(document).on("click","#mainContentItems .items a", function(){
	var t = $(this).html();
	var tt = $("#mainSideItems a.selected").html();
	$("<li>").html(t+" - "+tt).appendTo($("#sidelist"));
  });

  $(document).on("click","#mainSideItems a", function(){
  	$("#mainSideItems a").removeClass("selected");
  	$(this).addClass("selected");
  	var t = $(this).html();
  	showItemsForCategory(t,$("#mainContentItems"));
  });

  showCategories($("#mainSideItems"));
	// var u = $("<div>").attr("class", "items").addClass("clearfix").appendTo(dest);
	// for (i in items){
	// 	var price = iData[c][i];
	// 	$("<a>").html("<p>"+i+"</p>").appendTo(u);
	// }

  $("#debugData").html(JSON.stringify(iData, "", 2));
});