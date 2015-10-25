
<?php
    $subForum = getSubForumFromDB( $_GET["subforum"] );
    $currentPage = 1;
    $pageAmount = 10;
    
    if(isset($_GET['pagenum'])) {
        $currentPage = $_GET['pagenum'];
    }
    
    $subForum->setTopics( getTopicsFromDB( $subForum->getID(), ($currentPage*$pageAmount) - ($pageAmount-1), $pageAmount ) );
    $returnURL = $_SERVER['HTTP_HOST'] . "?page=forums";
?>

<link href="../../css/forums.css" rel="stylesheet" type="text/css"/>
<link href="../../css/subforum.css" rel="stylesheet" type="text/css"/>
<script src = "../../js/post_topic.js" ></script>

<div id = "container" >
    <div id = "header" >
        <h1><?php echo $subForum->getName(); ?></h1>
        <h2><?php echo $subForum->getDescription(); ?></h2>
        <?php if($loggedIn) : ?>
            <a href = "#" id = "createTopic" ><img src = "../../img/pencil.png"/>CREATE TOPIC</a>
        <?php endif; ?>
    </div>
    
    <div id = "subHeader" >
        <h1>TOPIC</h1>
        <h2>STATS</h2>
        <h3>LAST ACTIVITY</h3>
    </div>
    
    <div id = "subForums" >
        <?php foreach( $subForum->getTopics() as $k => $topic ) : ?>
            <div id = "subForum" class = '<?php echo $k%2==0 ? "even" : ""; ?>' >
                <a href = <?php echo "?page=forums&topic=" . $topic->getID(); ?> >
                    <div id = "name" >
                        <img id = "ava" src = <?php echo $topic->getCreator()->getAvatarMedium(); ?> />
                        <?php if( $topic->isStickied() ): ?>
                            <img id = "icon" src = "../../img/pin.png" />
                        <?php endif; ?>
                        <?php if( $topic->isClosed() ): ?>
                            <img id = "icon" src = "../../img/lock.png" />
                        <?php endif; ?>
                        <h1><?php echo $topic->getTitle(); ?></h1>
                        <br>
                        <h2><?php echo $topic->getCreator()->getName(); ?></h2>
                    </div>
                </a>
                
                <div id = "stats" >
                    <h1><b><?php echo number_format(getPostCountFromDB( $topic->getID() )); ?></b> Posts</h1>
                    <h2>Created <?php echo $topic->getFormattedCreationDate(); ?></h2>
                </div>
                
                <div id = "activity" >
                    
                    <h2>By <a href = "#">Username</a></h2>
                    <br>
                    <h1>5 minutes ago</h1>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<div id = "createbg" >
    <div id = "create" >
        <h1>Create a new topic</h1>
        <a id = "closeBtn" href = "#" ><img src = "../../img/close.png" ></a>
        
        <br>
        <form action = "php/pages/forums/post_topic.php" method = "post" >
            <h2>The title of the topic</h2>
            <br>
    		<input type = "text" name = "title" placeholder = "Title">
    		
    		<br>
    
    		<h2>The description / reason for the topic</h2>
    		<a id = "markdown" target = "_blank" href = "https://guides.github.com/features/mastering-markdown/" >Uses Markdown formatting*</a>
    		<textarea name = "message" placeholder = "Message" ></textarea>
    
    		<input type = "hidden" name = "returntopic" value = <?php echo $returnURL; ?> />
    		<input type = "hidden" name = "forum" value = <?php echo $subForum->getParentForum(); ?> />
    		<input type = "hidden" name = "subforum" value = <?php echo $subForum->getID(); ?> />
    		<input type = "hidden" name = "creator" value = <?php echo $localUser->getSteamID64(); ?> />
    
    		<input type = "submit" id = "submit" value = "CREATE">
    	</form>
    </div>
</div>