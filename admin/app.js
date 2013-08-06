
var data;
var sortedData;
var categories;
var selectedCategory;
var selectedItem;

function renderScreen(){
	// generate list of categories
	renderC1();
	
	// is there a selected filter? generate the main view with that filter
	renderC2();
	
	// is there a selected item? show edit view
	// edit view should have options like
	// save, delete (with alert)
	// if there is no selected item
	// render new item in category?
	renderC3();
	
	// what about a new category?	
	
}

function sortData(){
	sortedData = {};
	for (var i in data){
			var item = data[i];

			var c = item.category;
			var i = item.item;
			var p = item.price;
	
			if (!sortedData[ c ]) sortedData[ c ]  = {};		
			sortedData[ c ][ i ] = p	;
	}
}

function renderC1(){
	categories = [];
	for ( i in data ){
		categories[data[i]["category"]] = 1;
	}
	
	// render the categories, make sure they are clickable
	// is there a selected filter already? make sure the one is high lighted
	var c1 = $("#col1");
	c1.append($("<h2>").html("Categories"));
	var u = $("<ul>").attr("id", "categories").appendTo($("#col1"));
	for (var c in categories){
		$("<li>").html(c).appendTo(u);
	}
}

function renderC2(){
	sortData();
	var c2 = $("#col2").html("");	
	
	var exist = false;
	
	if (selectedCategory){
		$("<h2>").html("showing items in <em>"+ selectedCategory + "</em> category").appendTo(c2);
		var table = $("<table>").appendTo(c2);
		
		var u = $("<tr>").appendTo(table);
		$("<th>").html("item").appendTo(u);
		$("<th>").html("price").appendTo(u);
		
		for (var c in sortedData){
			if (c == selectedCategory){
				var items = sortedData[c];
				for (var i in items){
					u = $("<tr>").appendTo(table);
					$("<td>").html(i).appendTo(u);
					$("<td>").html(items[i]).appendTo(u);
				}
				exist = true;
			}
		}
	}else{
		$("<p>").html("select a category on the left").appendTo(c2);
	}	
}

function renderC3(){

	if (selectedItem){
		
	}else{
		
	}

}

// category functions
// new category? this is new item with category thing open
// so we need new item view that has a selector or a input...

// rename category? yes but ask once
// can't delete category? yes but ask twice




$(function(){

	$("#publishButton").click(function(){
		var c = confirm("Are you sure you want to publish data to the apps?");
		
		if (c){
			// update the app cache file
			$.get("updateAppCache.php").done(function(d){

			});
		}
	});

	$("#uploadButton").click(function(){
		$("#uploadfile").click();
	});
	
	$("#uploadfile").change(function(){
		// file!
		
		console.log("submitting"+$(this).val());
		$("#uploadfileSubmit").click();
	});

	$(document).on("click", "#col1 li", function(){
		$("#col1 li").removeClass("selected");
		$(this).addClass("selected");
		selectedCategory = $(this).html();
		renderC2();
	});
	
	$(document).on("click", "#col3 li", function(){
		var filename = $(this).html();
		$.GET("replaceData.php", { name: filename });
	});

	$.get("json.php").done(function(dd){
		var d = JSON.parse(dd);
		data = d;
		renderScreen();		
	});
		
});