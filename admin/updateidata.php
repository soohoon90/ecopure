<?php
	session_start();
	require "base.php";
	
	

	$f = "../app/js/idatatest.js";
	$fh = fopen($f, 'w') or die("can't open file");
	
	fwrite($fh, "var iData\n");
	fwrite($fh, "iData = {\n");

	fwrite($fh, get_db_sorted_json());
	
	fclose($fh);
	
?>
