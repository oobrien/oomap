<?php
header('Content-Type: application/json');

$bounds = $_GET['bounds'];
$file = file_get_contents("http://dracos.co.uk/made/nearest-postbox/nearest.php?bounds=$bounds");
echo $file;

?>