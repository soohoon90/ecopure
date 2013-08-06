<?

	require "base.php";

	if (isset($_GET['category'],$_GET['item'],$_GET['price'])){
		db_query("insert into INTO items(category, item, price) VALUES('?','?','?');",$_GET['category'],$_GET['item'],$_GET['price']);
	}

?>