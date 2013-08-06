<?php

if (isset($_FILES['uploadedfile'])){
	// Where the file is going to be placed 
	
	$uploadfile = time().basename($_FILES['uploadedfile']['name']);

	echo '<pre>';
	
	if (move_uploaded_file($_FILES['uploadedfile']['tmp_name'], "./uploads/$uploadfile")) {
		echo "File is valid, and was successfully uploaded.\n";
	} else {
		echo "Failed \n";
	}
	
	echo 'Here is some more debugging info:';
	
	print_r($_FILES);

	print "</pre>";

}
?>

<form enctype="multipart/form-data" action="" method="POST">
	Choose a file to upload: <input name="uploadedfile" type="file" />
	<input type="submit" value="Upload File" />
</form>