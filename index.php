<!-- The data encoding type, enctype, MUST be specified as below -->
<form enctype="multipart/form-data" action="upload.php" method="POST">
    <!-- MAX_FILE_SIZE must precede the file input field -->
    <input type="hidden" name="MAX_FILE_SIZE" value="10000000" />
    <!-- Name of input element determines name in $_FILES array -->
    Send this file: <input name="userfile" type="file" />
	<input type="text" style="display:none;" name="verify1" value="" />
	<input type="text" style="display:none;" name="verify2" value="swag" /> <!-- replace with CSRF or something -->
    <input type="submit" value="Send File" />
</form>