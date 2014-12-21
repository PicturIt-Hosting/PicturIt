<?php $title="Upload"; require_once("header.php"); ?>

<div id="uploader">
	<div id="preview-div">
		<img id="preview" />
	</div>
	<form id="image_upload" enctype="multipart/form-data" action="upload.php" method="POST">
		<p id="text">Select Image</p>
		<input type="hidden" name="MAX_FILE_SIZE" value="10000000" />
		<input id="userfile" name="userfile" type="file" title="Go ahead - it doesn't bite" />
		<input type="text" style="display:none;" name="verify1" value="" />
		<input type="text" style="display:none;" name="verify2" value="swag" /> <!-- replace with CSRF or something -->
		<input type="submit" />
	</form>
	<p id="drop-info">Or drop images anywhere</p>
</div>
<progress id="upload_progress"></progress>
<pre id="json_response"></pre>

<?php require_once("footer.php"); ?>