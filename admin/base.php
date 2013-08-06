<?php

	//$dbhost = "localhost";
	//$dbuser = "test";
	//$dbpass = "test";
	//$dbname = "test";

	$hostname="db483801627.db.1and1.com";
	$database="db483801627";
	$username="dbo483801627";
	$password="Ecopure2013";
	
	function wrap_tag($tag, $content='', $class=null){
		if ($class){
			$class="class=\"$class\"";
		}
		return "<$tag $class>$content</$tag>";
	}
	
	//connect to database
	function db_connect(){
		GLOBAL $dbhost, $dbuser, $dbpass, $dbname;
		$link = mysql_connect($dbhost, $dbuser, $dbpass) or die('Connection failed: ' . mysql_error());
		$db_selected = mysql_select_db($dbname, $link) or die ('Can\'t select database: ' . mysql_error());
	}
	
	function uploadFileLink($name){
		return "<a href='replaceData.php?name=$name'>$name</a>";
	}
	
	//prevent injection
	function db_query($query) {
	  db_connect();
	  $args  = func_get_args();
	  $query = array_shift($args);
	  $query = str_replace("?", "%s", $query);
	  $args  = array_map('mysql_real_escape_string', $args);
	  array_unshift($args,$query);
	  $query = call_user_func_array('sprintf',$args);
	  $result = mysql_query($query) or die(mysql_error());
		  if($result){
			return $result;
		  }else{
			 $error = "Error";
			 return $result;
		  }
	}

	function db_output($result){
		ob_start(); 
		$numOfCols = mysql_num_fields($result); 
		$numOfRows = mysql_num_rows($result);
		echo "<table border='1'>";
		echo "<tr>";
		for ($i = 0; $i < $numOfCols; $i++){
			echo "<td>".mysql_field_name($result, $i)."</td>";
		}
		echo "</tr>";
		while($row=mysql_fetch_array($result,MYSQL_BOTH)){
			echo "<tr>";
			for ($i = 0; $i < $numOfCols; $i++){
				echo "<td>".$row[$i]."</td>";
			}
			echo "</tr>";
		}
		echo "</table>";
		return ob_get_clean();
	}
	
	function db_editable_output($result){
		ob_start(); 
		$numOfCols = mysql_num_fields($result); 
		$numOfRows = mysql_num_rows($result);
		echo "<table border='1'>";
		echo "<tr>";
		for ($i = 0; $i < $numOfCols; $i++){
			echo wrap_tag("td", mysql_field_name($result, $i));
		}
		echo "</tr>";
		while($row=mysql_fetch_array($result,MYSQL_BOTH)){
			echo "<tr>";
			for ($i = 0; $i < $numOfCols; $i++){
				$x =$row[$i];
				if ($i == 2) $x = number_format($x, 2);
				echo wrap_tag("td", "<input value='$x'>");
			}
			echo "</tr>";
		}
		echo "</table>";
		return ob_get_clean();
	}
	
	function db_editable_output2($result){
		ob_start(); 
		$numOfCols = mysql_num_fields($result); 
		$numOfRows = mysql_num_rows($result);
		echo "<table>";
		echo "<tr>";
		for ($i = 0; $i < $numOfCols; $i++){
			echo wrap_tag("th", mysql_field_name($result, $i));
		}
		echo wrap_tag("th", Edit);
		echo "</tr>";
		while($row=mysql_fetch_array($result,MYSQL_BOTH)){
			echo "<tr>";
			for ($i = 0; $i < $numOfCols; $i++){
				$x =$row[$i];
				if ($i == 2) $x = number_format($x, 2);
				echo wrap_tag("td", $x);
			}
			echo wrap_tag("th", wrap_tag("button", "edit"));
			echo "</tr>";
		}
		echo "</table>";
		return ob_get_clean();
	}

	function db_table($tablename){
		if ($result = db_query("SELECT * FROM $tablename")){
			echo wrap_tag("h2",$tablename);
			echo db_output($result);
		}else{
			echo "<p>Error outputting $tablename table</p>";
		}
	}
	
	function db_table2($category){
		if ($result = db_query("SELECT item, price FROM items WHERE category='$category'")){
			echo wrap_tag("h2",$tablename);
			echo db_output($result);
		}else{
			echo "<p>Error outputting $tablename table</p>";
		}
	}
	
	function db_editable_table($tablename){
		if ($result = db_query("SELECT category, item, price FROM $tablename")){
			echo wrap_tag("h2","showing all items");
			echo db_editable_output($result);
		}else{
			echo "<p>Error outputting $tablename table</p>";
		}
	}
	
	function db_editable_table2($tablename, $category){
		if ($result = db_query("SELECT item, price FROM $tablename WHERE category='$category'")){
			echo wrap_tag("h2","showing all items from $category category");
			echo db_editable_output($result);
		}else{
			echo "<p>Error outputting $tablename table</p>";
		}
	}
	
	function db_editable_table3($category){
		if ($result = db_query("SELECT item, price FROM items WHERE category='$category'")){
			echo wrap_tag("h2","showing all items from $category category");
			echo wrap_tag("p","click on edit to edit");
			echo db_editable_output2($result);
		}else{
			echo "<p>Error outputting items</p>";
		}
	}
	
	function db_editable_table4($category){
		if ($result = db_query("SELECT item, price FROM items WHERE category='$category'")){
			echo wrap_tag("h2","showing all items from $category category");
			echo wrap_tag("p","click on edit to edit");
			echo db_editable_output2($result);
		}else{
			echo "<p>Error outputting items</p>";
		}
	}
	
	function db_output_json(){
		$result = db_query("SELECT * from items");
		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows[] = $r;
		}
		print json_encode($rows);
	}
	
	function get_db_sorted_json(){
		$result = db_query("SELECT category, item, price from items");
		$data = array();
		
		while($r = mysql_fetch_assoc($result)) {
			if (!isset($data[$r['category']])) $data[$r['category']] = array();
			$data[ $r['category'] ][ $r['item'] ] = $r['price'];
		}
		
		return json_encode($data, JSON_PRETTY_PRINT);
	}

?>