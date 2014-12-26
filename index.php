<?php $title="Upload"; require_once("header.php"); ?>
<img class='loading' src='img/loading.gif' />
<img class='loading' src='img/loading2.gif' />

<noscript class='loading'>
Whoops! It appears you are using a browser that doesn't support JavaScript. 
This site needs JavaScript to function properly. 
If possible, enable JavaScript or upgrade to a newer browser, then reload this site.
</noscript>

<div id="uploader" class='loading-hidden'>
	<div id="preview-div" class="clearfix">
		<br/><br/><br/><br/><br/><br/><br/><br/>
	</div>
	<form id="image_upload" enctype="multipart/form-data" action="upload.php" method="POST" class='loading-hidden button'>
		<p class="text">Select Images</p>
		<input type="hidden" name="MAX_FILE_SIZE" value="10000000" />
		<input id="userfile" name="userfile[]" type="file" title="Go ahead - it doesn't bite" multiple />
		<input type="submit" />
	</form>
	<p id="drop-info">Or drop images anywhere<br/><em>Limit of 8MB / 20 images per request</em></p>
	<div id="upload_button" class='button' title="Ready to go? Click me!"><p class='text'>Upload!</p></div>
	<progress id="upload_progress" style="display: none;"></progress>
	<pre id="json_response"></pre>
</div>

<?php require_once("footer.php"); ?>