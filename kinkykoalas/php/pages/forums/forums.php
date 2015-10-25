
<?php if( isset($_GET["subforum"]) ): ?>

<?php
    include "view_subforum.php";
?>

<?php elseif( isset($_GET["topic"]) ): ?>

<?php
    include "view_topic.php";
?>

<?php else : ?>

<?php
    global $forums;
    $forums = getForumsFromDB();
?>

<link href="../../css/forums.css" rel="stylesheet" type="text/css"/>

<?php foreach( $forums as $forum ) : ?>
    
    <div id = "container" >
        <div id = "header" >
            <h1><?php echo $forum->getName(); ?> Forum</h1>
            <h2><?php echo $forum->getDescription(); ?></h2>
        </div>
        
        <div id = "subHeader" >
            <h1>SUB FORUM</h1>
            <h2>STATS</h2>
            <h3>LAST ACTIVITY</h3>
        </div>
        
        <div id = "subForums" >
            <?php foreach( $forum->getSubForums() as $k => $subForum ) : ?>
                <div id = "subForum" class = '<?php echo $k%2==0 ? "even" : ""; ?>' >
                    <a href = '<?php echo "?page=forums&subforum=" . $subForum->getID(); ?>' >
                        <div id = "name" >
                            <h1><?php echo $subForum->getName(); ?></h1>
                            <h2><?php echo $subForum->getDescription(); ?></h2>
                        </div>
                    </a>
                    
                    
                    <div id = "stats" >
                        <h1><b><?php echo number_format(getTopicCountFromDB( $subForum->getID() )); ?></b> Topics</h1>
                        <h2><b><?php echo number_format(getPostCountForumFromDB( $subForum->getID() )); ?></b> Posts</h2>
                    </div>
                    
                    <div id = "activity" >
                        <h1>Topic Name</h1>
                        <br>
                        <h2>By <a href = "#">Username,</a> Aug 01</h2>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    
<?php endforeach; ?>

<?php endif; ?>