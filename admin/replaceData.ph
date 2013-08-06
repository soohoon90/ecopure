<?php

	require "base.php";
	
	if (($handle = fopen("data.csv", "r")) !== FALSE) {
	echo "<table border='1'>";
    while (($data = fgetcsv($handle)) !== FALSE) {
        $num = count($data); 	
		
		echo "<tr>";
        for ($c=0; $c < $num; $c++) {
            echo wrap_tag("td", $data[$c]);
        }
		db_query("insert INTO items(category, item, price) VALUES('?','?','?');",$data[0], $data[1], $data[2]);
		echo "</tr>";
		
    }
	echo "</table>";
    fclose($handle);
}
	
	
	

?>
