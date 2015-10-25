<link rel="stylesheet" href="style.php?p=header.scss">

<div id = 'header' >
	<div id = "leftSide" >
		<img src = 'img/logo.png' height='60px' >
	</div>
	
	<div id = "rightSide" >
		<?php if( $loggedIn ) : ?>
			<!-- Draw user avatar and name -->
			<div id = "headerAvatar" >
				<?php if(true) : ?>
					<a id = "notificationCount" href = "#" >1</a>
				<?php endif; ?>
			</div>
			<a id = "usernameMenu" href = "#" >
				<p><?php echo $localUser->getName(); ?></p>
				<div id = "arrow" ></div>
				<div id = "quickMenu" ></div>
			</a>

			<!-- Draw the VIP status of the user -->
			<?php if(true) : ?>
				<a id = "vip" href = "#" >VIP</a>
			<?php endif; ?>

			<!-- Draw the Rank status of the user -->
			<?php if(true) : ?>
				<a id = "rank" href = "#" >OWNER</a>
			<?php endif; ?>
			<!-- Create the drop down menu -->

			<!-- Allpy the react component -->
			<script type="text/jsx" >
				$(document).ready(function () {
					React.render(
				        <Avatar user="<?php echo $localUser->getAvatarFull(); ?>" wide = "32px" />,
				        document.getElementById('headerAvatar')
				    );

				    React.render(
				        <QuickOptions></QuickOptions>,
				        document.getElementById('quickMenu')
				    );
				});
			</script>

		<?php else : ?>

			<!-- Not logged in: show the login button -->
			<?php echo $logInButton; ?>

		<?php endif; ?>
	</div>
	
</div>

