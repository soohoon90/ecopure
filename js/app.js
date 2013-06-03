$(function(){

  $(document).on("click","#main .items a", function(){
	var t = $(this).html();
	$("<li>").html(t).appendTo($("#sidelist"));
  });

  var dest = $("#main")
  for (c in iData){
	var items = iData[c];
	var u = $("<div>").attr("class", "items").appendTo(dest);
	$("<h3>").html(c).appendTo(u);
	for (i in items){
		var price = iData[c][i];
		$("<a>").html(i).appendTo(u);
	}
  }
  $("#debug").html(JSON.stringify(iData, "", 2));
});