<?php
$username = "picturit"; // temporary for local testing
$password = "swagmaster123";
$db_name  = "picturit";

$dbh;

function connectDatabase(){
	global $dbh;
	global $username;
	global $password;
	global $db_name;
	$conf = 'mysql:host=localhost;dbname='.$db_name.';charset=utf8';
	$dbh = new PDO($conf, $username, $password);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	
	if(!tableExists("images")) createImagesTable();
}

function getAllImages(){
	global $dbh;
	$stmt = $dbh->prepare("SELECT * FROM `images`");
	$stmt->execute();
	$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
	return $res;
}

function createImagesTable(){
	global $dbh;
	$dbh->exec(
		"CREATE TABLE `images` (
			`name` VARCHAR(16) NOT NULL,
			`hash` VARCHAR(32) NOT NULL,
			`views` INT(11) DEFAULT 0,
			UNIQUE KEY `image_ix` (`name`, `hash`)
		) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;");
}

function imageExists($hash){
	global $dbh;
	$stmt = $dbh->prepare("SELECT * FROM `images` WHERE `hash`=?");
	$stmt->execute(array($hash));
	$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
	return $res;
}

function addImageRow($name, $hash){
	global $dbh;
	$stmt = $dbh->prepare("INSERT INTO `images` (`name`,`hash`) VALUES(:name, :hash)");
	$stmt->execute(array(":name"=>$name, ":hash"=>$hash));
}

function tableExists($id){
	global $dbh;
    $results = $dbh->query("SHOW TABLES LIKE '$id'");
    if($results->rowCount()>0){
		return TRUE;
	}
	return FALSE;
}
?>