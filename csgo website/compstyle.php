<?php 
	require "lib/scssphp/scss.inc.php";
    $component  = $_GET['comp'];

	// Compile the scss files from the page to css
    $scss = new scssc();
    $scss->setFormatter("scss_formatter");

   	$server = new scss_server( 'js/components/' . $component, null, $scss);
    $server->serve();
?>