<?php 
    include "php/init.php";
    
    global $localUser;
    
    $pages = [
        'home',
        'forums',
        'servers',
        'bans',
        'community',
        'market'
    ];
    
    $page_menus = [
        'bans' => [ 'Guard Bans', 'Server Bans', 'Website Bans' ],
        'servers' => [ 'DarkRP', 'TTT', 'Deathrun', 'Jailbreak', 'Lobby' ],
        'market' => [ 'Community Market', 'Item Shop', 'Inventory' ]
    ];
    
    $currentPage = 'home';
    
    if(isset($_GET['page'])) {
        $currentPage  = $_GET['page'];
        
        if(!in_array( $currentPage, $pages )) {
            header('Refresh: 0.01; url = 404.php');
        }
    } else {
        $currentPage = 'home';
    }
?>


<html>
    <head>
        <title>Kinky Koalas</title>
        
        <link rel="stylesheet" type="text/css" href="css/main.css">
        <link rel="stylesheet" type="text/css" href="css/header.css">
        <link rel="stylesheet" type="text/css" href="css/footer.css">
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    </head>
    
    <header>
        <?php include "php/header.php"; ?>
    </header>
    
    <body>
        <?php include "php/pages/" . $currentPage . "/" . $currentPage . ".php"; ?>
        
        <?php include "php/footer.php"; ?>
    </body>
</html>