<?php
header('Content-Type: application/json');

$bounds = $_GET['bounds'];
$file = file_get_contents("https://openplaques.org/plaques.geojson?box=$bounds");
echo $file;

?>
