<?php
    // stuff
?>

<div id = "navBar" >
    <img id = "logo" src = "../img/logoKoalaVector.png" />
    <h1 id = logoText >KINKY KOALAS</h1>
    
    <ul id = "pageNav" > 
        <?php foreach( $pages as $key => $val ) : ?>
            <li>
                <div>
                    <a id = "pageButton" class = '<?php echo $currentPage == $val ? 'current' : ''; ?>'  href = '<?php echo "?page=" . $val; ?>' >
                        <?php echo $val; ?>
                    </a>
                    
                    <?php if( array_key_exists( $val, $page_menus ) ) : ?>
        				<img src = "../img/arrow.png" >
        				<ul>
        					<?php foreach( $page_menus[$val] as $subpage ) : ?>
        						<li><a href = "#" ><?php echo $subpage; ?></a></li>
        					<?php endforeach; ?>
        				</ul>
    			    <?php endif; ?>
                </div>
            </li>
        <?php endforeach; ?>
    </ul>
</div>

<div id = "profileBar">
    <?php if($loggedIn) : ?>
        <a href = "#" >
            <img id = "avatar" src = '<?php echo $localUser->getAvatarMedium(); ?>' />
        </a>
        <a id = "logout" href = "?logout" >LOGOUT</a>
    <?php else : ?>
        <?php echo $logInButton; ?>
    <?php endif; ?>
</div>
