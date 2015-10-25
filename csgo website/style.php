<?php 
	require "lib/scssphp/scss.inc.php";

	$currentPage;

	if(isset($_GET['page'])) {
        $currentPage  = $_GET['page'];
    }

	// Compile the scss files from the page to css
    $scss = new scssc();
    $scss->setFormatter("scss_formatter");

   	$server = new scss_server( isset($currentPage) ? 'pages/' . $currentPage . '/scss' : 'scss', null, $scss);
    $server->serve();
?>