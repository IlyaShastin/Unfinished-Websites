<?php 

    include "../../mysql.php";
    
    $message = $_POST["message"];
	$creator = $_POST["creator"];
	$replyto = $_POST["replyto"] or 0;
	$topic = $_POST["topic"];
	$returnURL = "http://" . $_SERVER['HTTP_HOST'] . "?page=forums&topic=" . $topic;
	$date = time();
	
	$selected = mysql_select_db("Kinky Koalas Main", $mysql_conn) or die("Could not select forums DB");
	$return = mysql_query("INSERT INTO Post ( CREATOR, DATE, MESSAGE, LASTEDIT, REPLYTO, TOPIC ) VALUES ( '{$creator}', '{$date}', '{$message}', '0', '{$replyto}', '{$topic}')") or die(mysql_error());
    
    header("Refresh: 0.5; URL = {$returnURL}");
?>