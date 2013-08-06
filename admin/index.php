<?php
	session_start();
	require_once "base.php";
	
	/*
	if (isset($_GET['category'],$_GET['item'],$_GET['price'])){
		db_query("insert INTO items(category, item, price) VALUES('?','?','?');",$_GET['category'],$_GET['item'],$_GET['price']);
	}
	*/
?>

	<html lang="en">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<script src="jquery.min.js"></script>
	<script src="app.js"></script>
	<link href="style.css" rel="stylesheet" TYPE="text/css" MEDIA="screen" >
	<body>
	<div id="appWrapper">
	<div id="topBar">
		<div id="header">
			<h1>
				EcoPure Insurance Item Manager
			</h1>
		</div>
		<div id="control">
			<div id="publishButton">Publish Data</div>
			<div id="uploadButton">Upload .CSV file</div>
			<form enctype="multipart/form-data" action="filesave.php" method="POST" style="display: none" >
				<input id="uploadfile" name="uploadfile" type="file" />
				<input id="uploadfileSubmit" type="submit" value="Upload File" />
			</form>
		</div>
	</div>
	
	<div id="mainBar">
		<div id="col1"></div>
		<div id="col2">loading data...</div>
		<div id="col3">
			<h2>Uploaded Files</h2>
			<ul id="filelist">
				<?php 
					$dir = dir("uploads");
					while (($file = $dir->read()) !== false){
						if ($file != "." && $file!="..") echo wrap_tag("li", uploadFileLink($file));
					}
				?>
			</ul>
		</div>
	</div>

<div id="entry">
</div>

</div>
</div>

</body>
</html>