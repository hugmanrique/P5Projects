<html>
<head>
    <meta charset="utf-8">
    <title>P5 Projects - Hugmanrique</title>
</head>
<body>
<h1>P5 Projects:</h1>
<ul>
<?php
$files = scandir(__DIR__);
$files = array_filter($files, function($item) {
    return !is_dir(__DIR__ . '/' . $item) && strpos($item, 'html') !== false;
});

foreach($files as $file){
    echo '<li><a href=' . $file . '>' . $file . '</a></li>';   
}
?>
</ul>
</body>
</html>