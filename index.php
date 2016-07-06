<html>
<head>
    <meta charset="utf-8">
    <title>P5 Projects - Hugmanrique</title>
</head>
<body>
<h1>P5 Projects:</h1>
<?php
$files = scandir(__dir);

foreach($files as $file){
    echo '<a href=' . $file . '>' . $file . '</a>';   
}
?>
</body>
</html>