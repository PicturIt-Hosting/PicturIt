<?php $title="Upload"; require_once("header.php"); ?>

<form id="image_upload" enctype="multipart/form-data" action="upload.php" method="POST">
	<input type="hidden" name="MAX_FILE_SIZE" value="10000000" />
	Send this file: <input name="userfile" type="file" />
	<input type="text" style="display:none;" name="verify1" value="" />
	<input type="text" style="display:none;" name="verify2" value="swag" /> <!-- replace with CSRF or something -->
	<input type="submit" value="Send File" />
</form>
<progress id="upload_progress"></progress>
<pre id="json_response"></pre>

<?php require_once("footer.php"); ?>