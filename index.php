<!-- It's a test rig; not full HTML yet-->
<form enctype="multipart/form-data" action="upload.php" method="POST">
    <input type="hidden" name="MAX_FILE_SIZE" value="10000000" />
    Send this file: <input name="userfile" type="file" />
	<input type="text" style="display:none;" name="verify1" value="" />
	<input type="text" style="display:none;" name="verify2" value="swag" /> <!-- replace with CSRF or something -->
    <input type="submit" value="Send File" />
</form>
<progress id="swag" style="display:none;"></progress>
<pre></pre>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript">
$("form").submit(function(e){
	e.preventDefault();
    var formData = new FormData($(this)[0]);
	$("#swag").show();
    $.ajax({
        url: "upload.php",
        type: 'POST',
        data: formData,
        async: true,
        success: function (data) {
            $("#swag").hide();
			$("pre").text(JSON.stringify(data));
        },
        cache: false,
        contentType: false,
        processData: false
    });
    return false;
});
</script>