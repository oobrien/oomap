<?php
header('Content-Type: application/json');

$bounds = $_GET['bounds'];
$file = file_get_contents("https://postboxes.dracos.co.uk/nearest.php?bounds=$bounds");
echo $file;

?>