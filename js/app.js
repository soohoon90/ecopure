(function(view) {
"use strict";


var claimdata = {};
var itemData;
var localItemData = {};
var categorizedItems;

function loadItemData(){
	itemData = iData;
	localItemData = JSON.parse(localStorage.getItem("localItemData"));

	if (!localItemData){
		localItemData = {};
	}

	for (var c in localItemData){
		for (var i in localItemData[c]){
			itemData[c][i] = localItemData[c][i];
		}
	}
}

function showCategories(){
	for (var c in iData){
		$("<a>").html(c).appendTo($("#mainSideItems"));
		//var items = iData[c];
	}
};

function showItemsForCategory(c){
	var items = itemData[c];
	var items2 = localItemData[c];

	// create div
	var u = $("<div>").attr("class", "items").addClass("clearfix");
	
	// populate div
	for (var i in items){
		var price = items[i];
		$("<a>").html("<p>"+i+"</p>").appendTo(u);
	}

	$("<a>").addClass("describeButton").html("<p>Add a new Item</p>").appendTo(u);

	// add div to dest
	$("#mainContentItems").html(u);
}

function setCategorizedItemCount( c, i, n ) {

	var claim = claimdata.claims[claimdata.selectedClaim];
	var r = claim.rooms[claimdata.selectedRoom];

	if (!r[c]) r[c] = {};
	if (!r[c][i]) r[c][i] = 0;
	r[c][i] += parseInt(n);

	saveClaimData();
	updateRoomlist();
}

function updateClaimlist(){
	var u = $("#claimList").html("");
	console.log("updating claim list");
	for (var i in claimdata.claims){
		var c = claimdata.claims[i];
		console.log(c);
		$("<div>").html( Date.parse(c.date) ).appendTo(u);
	}
}

function updateRoomlist(){
	var u = $("#roomList").html("");

	var claim = claimdata.claims[claimdata.selectedClaim];

	for (var i in claim.rooms){
		var r = claim.rooms[i];
		console.log(r);
		var totalItems = 0;
		var differentItems = 0;
		for (var c in r){
			for (var n in r[c]){
				differentItems++;
				totalItems += r[c][n];
			}
		}
		$("<div>")
			.html("Room #" + (parseInt(i)+1) + " (" + differentItems + "/" + totalItems + ")" )
			.data("r", i)
			.appendTo(u);
	}

}

function updateSidebar(){
	var uu = $("#sidebarContent").html("");

	$("<h3>").html("Room #" + (parseInt(claimdata.selectedRoom)+1)).appendTo(uu);
	
	var claim = claimdata.claims[claimdata.selectedClaim];
	var room = claim.rooms[claimdata.selectedRoom];

	var totalItems = 0;
	var differentItems = 0;
	for (var c in room){
		for (var n in room[c]){
			differentItems++;
			totalItems += room[c][n];
		}
	}

	$("<h3>").html(differentItems + " different items. " + totalItems + " items total.").appendTo(uu);

	var u = $("<div>").appendTo(uu);
	var o = room;

	for (var c in o){
		console.log(c);
		$("<strong>").html(c).appendTo(u);
		var uu = $("<ul>").appendTo(u);
		for (var i in o[c]){

			var num = o[c][i];
			$("<li>")
				.data("item", i)
				.data("count", num)
				.data("category", c)
				.html("<span>"+num+"x </span> "+i)
				.appendTo(uu);
		}
	}
}

function saveToSpreadsheet(){
	saveAs(
			  new Blob(
				  [itemsToCSV(false)]
				, {type: "text/plain;charset=" + document.characterSet}
			)
			, "exported.csv"
		);
}

function quoteString(string){
	return '"'+string+'"';
}

function itemsToCSV(withPrice){
	var rows = [];

	rows.push(quoteString("room number") + "," + quoteString("category") + "," + quoteString("description") + "," + quoteString("quantity"))


	var claim = claimdata.claims[claimdata.selectedClaim];

	for (var ri in claim.rooms){
		for (var c in claim.rooms[ri]){
			for (var i in claim.rooms[ri][c]){
				var row = ""
				row += quoteString(ri+1);
				row += ',' + quoteString(c);
				row += ','+ quoteString(i);
				row += ','+ quoteString(claim.rooms[ri][c][i]);
				rows.push(row);
			}
		}
	}

	// for (var ri in claim.rooms){
	// 	rows.push("room "+ ri+1);
	// 	for (var c in claim.rooms[ri]){
	// 		for (var i in claim.rooms[ri][c]){
	// 			var row = quoteString(c);
	// 			row += ','+ quoteString(i);
	// 			row += ','+ quoteString(claim.rooms[ri][c][i]);
	// 			rows.push(row);
	// 		}
	// 	}
	// }

	// for (var r in categorizedItems){
	// 	for (var c in categorizedItems[r]){
	// 		for (var i in categorizedItems[r][c]){
	// 			var r = "";
	// 			r += quoteString(r);
	// 			r += ','+ quoteString(c);
	// 			r += ','+ quoteString(i);
	// 			r += ','+ quoteString(categorizedItems[r][c][i]);
	// 			rows.push(r);
	// 		}
	// 	}
	// }

	return rows.join("\r\n");
}

function showModalForSwitchingClaim(){
	var h = $("#modalHeader").html("");
	var m = $("#modalContent").html("");
	var f = $("#modalFooter").html("");

	$("<h2>")
		.html("Switch claim you are working on:")
		.appendTo(h);

	for (var i in claimdata.claims){
		
		var d = new Date(claimdata.claims[i].date);
		var s = "";
		s += "Claim " + (parseInt(i)+1);
		s += " with " + claimdata.claims[i].rooms.length + " rooms <br/>";
		s += "created at " + d.toUTCString();
		

		$("<div>")
			.addClass("claimButton")
			.html(s)
			.data("i", i)
			.click(function(){
				claimdata.selectedClaim = $(this).data("i");
				updateRoomlist();
				claimdata.selectedRoom = claimdata.claims[claimdata.selectedClaim].rooms.length-1;
				updateSidebar();
				$("#modal").hide();
			})
			.appendTo(m);
	}

	$("<div>")
		.addClass("cancelButton")
		.click(function(){ $("#modal").hide(); })
		.html("cancel")
		.appendTo(f);

	$("#modal").show();
}

function showModalForNewItem(c){
	var h = $("#modalHeader").html("");
	var m = $("#modalContent").html("");
	var f = $("#modalFooter").html("");

	$("<h2>")
		.html("Adding a new item descryption for " + c + " category")
		.appendTo(h);

	var doneThisModal = function(i){
		var category = c;
		var item = i;
		if (confirm("add '" + item + "' for " + c + " category?")){
			if (!localItemData) localItemData = {};
			if (!localItemData[c]) localItemData[c] = {};
			localItemData[c][i] = daprice.val();
			console.log(localItemData);

			localStorage.setItem("localItemData", JSON.stringify(localItemData));

			showItemsForCategory(c,$("#mainContentItems"));
			$("#modal").hide();
			loadItemData();
			showItemsForCategory(c);
			showModalForAddItem(category,item);
		}
	}

	var dainput = $("<input>")
		.addClass("promptInput")
		.attr("placeholder", "item descryption")
		.data("c",c)
		.keypress(function(e){
			var key=e.keyCode || e.which;
			if (key==13){
				doneThisModal(dainput.val());
			}
		})
		.appendTo(m);

	$("<br>").appendTo(m);

	$("<label>").html("$").appendTo(m);

	var daprice = $("<input>")
		.attr("type", "number")
		.val(10)
		.data("c",c)
		.appendTo(m);

	$("<div>")
		.addClass("doneButton")
		.click(function(){ 
			doneThisModal(dainput.val());
		})
		.html("add")
		.appendTo(f);

	$("<div>")
		.addClass("cancelButton")
		.click(function(){ $("#modal").hide(); })
		.html("cancel")
		.appendTo(f);

	$("#modal").show();
	dainput.focus();
}

function showModalForAddItem(c,i){
	var h = $("#modalHeader").html("");
	var m = $("#modalContent").html("");
	var f = $("#modalFooter").html("");

	$("<h2>")
		.html("Adding how many " + i + " item (" + c + ")?")
		.appendTo(h);

	var dainput = $("<div>")
		.addClass("promptInput")
		.data("c",c)
		.data("i",i)
		.html("")
		.keypress(function(e){
			var key=e.keyCode || e.which;
			if (key==13){
				var category = $(this).data("c");
				var item = $(this).data("i");
				var num = $(this).html();
				if (num){
					setCategorizedItemCount(category, item, num);
					updateSidebar();
				}
				$("#modal").hide();
			}
		})
		.appendTo(m);

	for (var i=1; i <= 10; i++){
		var j;
		(i == 10) ? j = 0 : j = i;

		$("<div>")
			.addClass("numButton")
			.click(function(){
				var d = dainput.html();
				var dd = $(this).html();
				dainput.html(d+dd);
			})
			.html(j)
			.appendTo(m);

		if (i % 3 == 0){
			$("<br>").appendTo(m);
		}
	}

	$("<div>")
		.addClass("numButton")
		.click(function(){
			dainput.html("");
		})
		.html("CLEAR")
		.appendTo(m);

	$("<div>")
		.addClass("doneButton")
		.click(function(){ 
			var inputElement = $("#modalContent .promptInput");
			var category = inputElement.data("c");
			var item = inputElement.data("i");
			var num = inputElement.html();
			if (num){
				setCategorizedItemCount(category, item, num);
				updateSidebar();
			}
			$("#modal").hide();
		})
		.html("add")
		.appendTo(f);

	$("<div>")
		.addClass("cancelButton")
		.click(function(){ $("#modal").hide(); })
		.html("cancel")
		.appendTo(f);

	$("#modal").show();
	//$("#modalContent input").focus();

}


function promptForNumberOfItems(c,i){

	if (false) {
		var num = prompt("How many " + i + " (" + c + ")?", "");
	}else{
		showModalForPrompt(c,i);
	//	$("#modalContent input").focus();
	}

	return num;
}

function newClaim(){
	if (!claimdata.claims) claimdata.claims = [];

	claimdata.claims.push({});
	claimdata.selectedClaim = claimdata.claims.length-1;

	var c = claimdata.claims[claimdata.selectedClaim];

	c.date = new Date();
	c.rooms = [];
	c.rooms.push({});

	claimdata.selectedRoom = 0;

	saveClaimData();
	updateRoomlist();
	debug();
}

function newRoom(){
	var c = claimdata.claims[claimdata.selectedClaim];
	console.log(c);
	c.rooms.push({});
	claimdata.selectedRoom = c.rooms.length-1;

	saveClaimData();
	updateRoomlist();
	updateSidebar();
	debug();
}

function saveClaimData(){
	localStorage.setItem("claimdata", JSON.stringify(claimdata));
}

function debug(){
	var u = $("#dataPanel").html("");
	$("<h3>").html("Claim #<strong>" + (parseInt(claimdata.selectedClaim)+1) + "</strong>").appendTo(u);
	//$("<h3>").html(claimdata.claims.length + " claims total").appendTo(u);
	console.log(claimdata);
	if (claimdata.selectedClaim){
		var c = claimdata.claims[claimdata.selectedClaim];
		//$("<p>").html(c.rooms.length + " rooms [" + claimdata.selectedRoom + "]").appendTo(u);
		console.log(JSON.stringify(claimdata));
		console.log(claimdata.selectedRoom);
	}
}

$(function(){

	loadItemData();
	
	if(localStorage.getItem("claimdata")){
		claimdata = JSON.parse(localStorage.getItem("claimdata"));
		if (typeof claimdata.selectedClaim == "undefined"){
			newClaim();
			saveClaimData();	
		}
		debug();
	}

	updateRoomlist();

	

	$("#deleteLast").click(function(){
		currentItems.pop();
		updateItemsList();
	});

	$("#debugDelete").click(function(){
		claimdata = {};
		saveClaimData();
	});

	$("#debugOut").click(function(){
		debug();
	});

	$("#newClaim").click(newClaim);
	$("#switchClaim").click(showModalForSwitchingClaim);
	$("#newRoom").click(newRoom);
	$("#exportData").click(saveToSpreadsheet);	

	// $("#deleteData").click(function(){
	// 	if (confirm("are you sure to start over?")){
	// 		categorizedItems = {};
	// 		localStorage.removeItem("items")
	// 		updateSidebar();
	// 	}
	// });	

	// Selecting item
	$(document).on("click","#mainContentItems .items a", function(){
		var item = $(this).text();
		var category = $("#mainSideItems a.selected").text();
		showModalForAddItem(category, item);
	});

	$(document).on("click","#mainContentItems .items a.describeButton", function(){
		var category = $("#mainSideItems a.selected").text();
		showModalForNewItem(category);
	});

	// Selecting category
	$(document).on("click","#mainSideItems a", function(){
		$("#mainSideItems a").removeClass("selected");
		$(this).addClass("selected");
		var t = $(this).html();
		showItemsForCategory(t);
	});

	$(document).on("click","#roomList div", function(){
		var r = $(this).data("r");
		console.log(r);
		claimdata.selectedRoom = r;
		saveClaimData();
		updateSidebar();
	});


	$(document).on("click", "#sidebar ul li", function(){
		var c = $(this).data("category");
		var i = $(this).data("item");
		var n = $(this).data("item");
		if (confirm("Remove " + n + "x " + i + " from this room?")){
			var claim = claimdata.claims[claimdata.selectedClaim];
			var room = claim.rooms[claimdata.selectedRoom];
			delete room[c][i];
		}
		updateSidebar();
		saveClaimData();
	});

	showCategories();
	$("#debugData").html(JSON.stringify(iData, "", 2));

	showItemsForCategory("Pants");
	$("#mainSideItems a:first-child").addClass("selected");
	updateSidebar();


	$("#modal").hide();
});

}(self));