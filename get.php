<?php
/////////////////// IMPORTANT!!! Activate the fileinfo.(dll|so) extension in php.ini before running this!
function getMimeType($filename) {
    $result = new finfo();
    return $result->file($filename, FILEINFO_MIME_TYPE);
}

// increment view counter here
$basedir = "images/";

if(!isset($_GET['image'])) die("Whoops, it seems a server side error occurred. Sorry!");
if(!file_exists($basedir.$_GET['image'])){
	header("Content-Type: image/png");
	die(file_get_contents("404.png"));
}
$type = getMimeType($basedir.$_GET['image']);
header("Content-Type: ".$type);

echo file_get_contents($basedir.$_GET['image']); // POTENTIAL SECURITY ISSUE - FIX LATER
?>