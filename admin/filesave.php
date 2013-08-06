<?php


if (isset($_FILES['uploadfile'])){
	$uploadfile = time().basename($_FILES['uploadfile']['name']);
	@move_uploaded_file($_FILES['uploadfile']['tmp_name'], "./uploads/$uploadfile");
}

Header( "HTTP/1.1 301 Moved Permanently" );
Header( "Location: index.php" );

?>