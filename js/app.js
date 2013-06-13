(function(view) {
"use strict";

var currentItems = [];
var categorizedItems = {};

function showCategories(dest){
	for (var c in iData){
		$("<a>").html(c).appendTo(dest);
		//var items = iData[c];
	}
};

function showItemsForCategory(c, dest){
	var items = iData[c];

	// create div
	var u = $("<div>").attr("class", "items").addClass("clearfix");
	
	// populate div
	for (var i in items){
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

function setCategorizedItemCount( c, i, n ) {

	if (!categorizedItems[c]) categorizedItems[c] = {};
	categorizedItems[c][i] = n;

}

function updateItemsListFromCategorizedItems(){
	$("#lastItem").html("");
	$("#sidelist").html("");
	$("#deleteLast").hide();

	var u = $("<li>").appendTo($("#sidelist"));
	var o = categorizedItems;

	for (var c in o){
		$("<h3>").html(c).appendTo(u);
		var uu = $("<ul>").appendTo(u);
		for (var i in o[c]){

			var num = o[c][i];
			$("<li>")
				.data("item", i)
				.data("count", num)
				.data("category", c)
				.html(num+"x "+i)
				.appendTo(uu);
		}
	}
}

function updateItemsListFromCurrentItems(){

	$("#lastItem").html("");
	$("#sidelist").html("");

	if (currentItems.length > 0){
		var lastItem = currentItems[currentItems.length-1];
		// $("#lastItem").html(lastItem.c + " - " + lastItem.i + " added.")	;

		var u = $("<li>").appendTo($("#sidelist"));
		var o = getCategorizedCurrentItems();

		for (var c in o){
			$("<h3>").html(c).appendTo(u);
			var uu = $("<ul>").appendTo(u);
			for (var i in o[c]){

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

function showModalForSelectedItem(){

	var selectedItem = $("#sidelist .selected").data("item");

}


function saveToSpreadsheet(){
	saveAs(
			  new Blob(
				  [JSON.stringify(categorizedItems, "", 2)]
				, {type: "text/plain;charset=" + document.characterSet}
			)
			, "exported.txt"
		);
}


$(function(){
	$("#deleteLast").click(function(){
		currentItems.pop();
		updateItemsList();
	});

	$("#exportData").click(saveToSpreadsheet);	

	// Selecting item
	$(document).on("click","#mainContentItems .items a", function(){
		var item = $(this).text();
		var category = $("#mainSideItems a.selected").text();

		// get new number
		var num = prompt("How many " + item + " of " + category + "?", "");
		setCategorizedItemCount(category, item, num);
		updateItemsListFromCategorizedItems();

		//currentItems.push({c:tt, i:t});
		//updateItemsList();
		// $("<li>").html("<strong>"+tt+"</strong>"+t).appendTo($("#sidelist"));
	});

	// Selecting category
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
	updateItemsListFromCategorizedItems();
});

}(self));