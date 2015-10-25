<?php
	include "php/init.php";
    
    global $localUser;

	$currentPage = 'home';

	if(isset($_GET['page'])) {
        $currentPage  = $_GET['page'];
    }

	// Including all the components
	$compList = [];
	$components = array_slice(scandir( 'js/components' ), 2);

	foreach( $components as $comp ) {
		$files = array_slice(scandir( 'js/components/' . $comp ), 2);
		$compList[$comp] = [
			'comp' => $files[0],
			'style' => $files[1]
		];
	}
?>

<html>
	<head>
        <meta charset="UTF-8" />
	    <title>cs:go stuff</title>

	    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/JSXTransformer.js"></script>
	    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	    <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
	    <script>
	    	var currentPage = '<?php echo $currentPage; ?>';
	    </script>

	    <link rel="stylesheet" href="style.php?p=main.scss">

	    <?php foreach( $compList as $key => $comp ) : ?>
	    	<link rel="stylesheet" href="compstyle.php?comp=<?php echo $key; ?>&p=<?php echo $comp['style']; ?>">
	    	<script type="text/jsx" src="js/components/<?php echo $key; ?>/<?php echo $comp['comp']; ?>"></script>
	    <?php endforeach; ?>
    </head>

	<body>
		<div id = "video" >
			<video preload="auto" autoplay loop muted id = "cinematics">
				<source src="vid/cinematic.mp4" type="video/mp4"></source>
			</video>

			<script>
				var vid = document.getElementById("cinematics");
				vid.playbackRate = 1;
			    vid.play();
			</script>
			
		</div>
		<div id = "cinematicsMask" ></div>
		<div id = "cinematicsFadeMask" ></div>

		<?php include "php/header.php" ?>

		<div id = 'content' >
			<div id = "SponsSpace" ></div>
			<div id = "navigation" ></div>
			<script type="text/jsx" >
				$(document).ready(function () {
					React.render(
				        <NavBar />,
				        document.getElementById('navigation')
				    );
				});
			</script>


			<?php include "pages/" . $currentPage . "/index.php"; ?>
		</div>
		
	</body>

</html>

