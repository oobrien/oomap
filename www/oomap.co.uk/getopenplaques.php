<?php
header('Content-Type: application/json');

$bounds = $_GET['bounds'];
$file = file_get_contents("http://openplaques.org/plaques.geojson?box=$bounds");
echo $file;

?>
