<?php
    include "../../mysql.php";

	$title = substr($_POST["title"], 0, 60);
	$message = $_POST["message"];
	$creator = $_POST["creator"];
	$returnURL = "http://" . $_POST["returntopic"];
	$forum = $_POST["forum"];
	$subforum = $_POST["subforum"];
	$date = time();
	$topic = NULL;

	$selected = mysql_select_db("Kinky Koalas Main", $mysql_conn) or die("Could not select forums DB");
	$return = mysql_query("INSERT INTO Topic ( TITLE, CREATOR, DATE, STICKIED, CLOSED, SUBFORUM ) VALUES ( '{$title}', '{$creator}', '{$date}', '0', '0', '{$subforum}' )") or die(mysql_error());
    
    $retreiveTopic = mysql_query("SELECT ID FROM Topic WHERE TITLE = '{$title}' AND CREATOR = '{$creator}' AND DATE = '{$date}'") or die(mysql_error());
    
	$row = mysql_fetch_assoc($retreiveTopic);
	$topic = $row['ID'];

	$returnURL = $returnURL . "&topic=" . $topic;

	$_return = mysql_query("INSERT INTO Post ( CREATOR, DATE, MESSAGE, TOPIC ) VALUES ( '{$creator}', '{$date}', '{$message}', '{$topic}' ) ") or die(mysql_error());

	header("Refresh: 0.5; URL = {$returnURL}");
?>