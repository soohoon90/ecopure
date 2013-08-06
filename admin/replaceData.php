
<a href="index.php"> go back to main page </a>

<?php

	require "base.php";
	
	db_query("DELETE FROM items");
	
	if (isset($_GET['name'])){
		$name = $_GET['name'];
		if (($handle = fopen("./uploads/$name", "r")) !== FALSE) {
			
			echo "<table border='1'>";
			while (($data = fgetcsv($handle)) !== FALSE) {
				$num = count($data);
				if ($num != 3){
					echo "wrong file format, make sure you have 3 columns, and the file is csv format (excel, save as csv)";
					break;
				}else{
					echo "<tr>";
					for ($c=0; $c < $num; $c++) {
						echo wrap_tag("td", $data[$c]);
					}
				
					db_query("insert INTO items(category, item, price) VALUES('?','?','?');",$data[0], $data[1], $data[2]);
					echo "</tr>";
				}
			}
			echo "</table>";
			fclose($handle);
		}else{
			echo "something went wrong";
		}
	}
	

	
	
?>
	
	<a href="index.php"> go back to main page </a>
	
	


