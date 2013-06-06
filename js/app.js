currentItems = [];

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

function getCategorizedCurrentItems(){

	var c = {};

	for (var i=0;i<currentItems.length;i++){
		var item = currentItems[i];
		if (!c[item.c]) c[item.c] = {};
		if (!c[item.c][item.i]) c[item.c][item.i] = 0;
		c[item.c][item.i] += 1;
	}

	console.log(c);
	return c;
}

function updateItemsList(){

	$("#lastItem").html("");
	$("#sidelist").html("");

	if (currentItems.length > 0){
		var lastItem = currentItems[currentItems.length-1];
		// $("#lastItem").html(lastItem.c + " - " + lastItem.i + " added.")	;

		var u = $("<li>").appendTo($("#sidelist"));
		var o = getCategorizedCurrentItems();

		for (c in o){
			$("<h3>").html(c).appendTo(u);
			var uu = $("<ul>").appendTo(u);
			for (i in o[c]){

				var num = o[c][i];
				$("<li>").html(num+"x "+i).appendTo(uu);
			}
		}

		$("#deleteLast").html("<strong>delete lastly added item</strong> <br/>("+lastItem.c + " - " + lastItem.i+")").show();
	}else{
		$("#lastItem").html("no items added");
		$("#deleteLast").hide();
	}
 	}

$(function(){

	$("#deleteLast").click(function(){
		currentItems.pop();
		updateItemsList();
	});

  $(document).on("click","#mainContentItems .items a", function(){
	var t = $(this).text();
	var tt = $("#mainSideItems a.selected").text();
	currentItems.push({c:tt, i:t});
	updateItemsList();
	// $("<li>").html("<strong>"+tt+"</strong>"+t).appendTo($("#sidelist"));
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

  showItemsForCategory("Pants",$("#mainContentItems"));
  $("#mainSideItems a:first-child").addClass("selected");
  updateItemsList();
});