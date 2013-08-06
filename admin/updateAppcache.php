<?php
	require_once "base.php";
	
	function recursive_fwrite($fh,$dir){
		foreach (glob($dir."/*") as $filename){
			if (is_dir($filename)){
				recursive_fwrite($fh,$filename);
			}else{
				if (strpos($filename, ".manifest") === false && strpos($filename, ".html") === false){
					fwrite($fh, str_replace("../app/", "", $filename)."\n");
					echo wrap_tag("p", str_replace("../app/", "", $filename));
				}
			}
		}
	}

	$f = "../app/test.manifest";
	$fh = fopen($f, 'w') or die("can't open file");
	
	fwrite($fh, "CACHE MANIFEST\n");
	fwrite($fh, "#v".time()."\n");
	
	fwrite($fh, "CACHE:\n");
	
	recursive_fwrite($fh, "../app");
	
	fclose($fh);
	
	$f = "../app/js/idata.js";
	$fh = fopen($f, 'w') or die("can't open file");
	
	fwrite($fh, "var iData;\n");
	fwrite($fh, "iData = ");

	$db = get_db_sorted_json();
	fwrite($fh, get_db_sorted_json());
	echo($db);
	
	fclose($fh);
	
	
?>
