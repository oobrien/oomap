<?php

//Takes in $pc parameter, strips spaces, does an SQL query lookup of the postcode and returns easting,northing string. The Javascript can take this and convert to LL and then 900913.

//Do input validation here. If blank, return helpful message/status code.
//Make sure input is only alphanumeric (and spaces) and not longer than 8 characters.

sleep(0.5);

include_once "../db.php";

global $pc;

if (!empty($_GET) && isset($_GET['pc'])) 
{ 
	$postcode = $_GET['pc'];
}
else if ($pc != null)
{
	$postcode = $pc;
}
else
{
	echo json_encode(array('success'=>false, 'message'=>'A postcode must be specified.'));
	return;
}

//Clean.
$postcode = strtoupper($postcode);
$postcode = str_replace(" ", "", $postcode);
$postcode = str_replace("'", "", $postcode);
$postcode = substr($postcode, 0, 7);

$conn = @mysqli_connect($dbhost, $dbuser, $dbpass); 

if (!$conn)
{
	echo json_encode(array('success'=>false, 'message'=>'Unable to connect to the database.'));
	return;
}

if (strlen($postcode) < 5 || strlen($postcode) > 7)
{
	echo json_encode(array('success'=>false, 'message'=>'Unrecognised postcode format. Should be in the standard form, e.g. SW1 1AA.'));
	return;
}

$postcode = mysqli_real_escape_string($conn, $postcode);

mysqli_select_db($conn, $dbdb); 
$rows = array();

//Form postcode_7 from postcode_ns
$outcode = substr($postcode, 0, strlen($postcode) - 3);
$incode = substr($postcode, -3);

$postcode_7 = $postcode;
if (strlen($outcode) == 3)
{
	$postcode_7 = $outcode . " " . $incode;
}
if (strlen($outcode) == 2)
{
	$postcode_7 = $outcode . "  " . $incode;
}

$query1 = "SELECT easting, northing, postcode_7 FROM postcodes WHERE postcode_7 = '" . $postcode_7 . "' LIMIT 1";

$result = mysqli_query($conn, $query1);    

if (mysqli_num_rows($result) == 0) 
{
	echo json_encode(array('success'=>false, 'message'=>'Unable to find that postcode in the database.'));
}	
else
{	
	$row = mysqli_fetch_assoc($result);
	//$rows['easting'] = $row[0];
	//$rows['northing'] = $row[1];
	//$rows['postcode_7'] = $row[2];
	//$result =  $rows['easting'] . "," . $rows['northing'] . "," . $rows['postcode_7'];

	$query2 = "INSERT INTO pcrequests (postcode_7, hits, source) value('$postcode_7', 1, 'oomap') 
	ON DUPLICATE KEY UPDATE hits = hits + 1";
	mysqli_query($conn, $query2);
	$returnData = array('success'=>true, 'message'=>'', 'easting'=>$row['easting'], 'northing'=>$row['northing'], 'postcode_7'=>$row['postcode_7']);
	echo json_encode($returnData);
	//return '(' . json_encode($row) . ")";	
}

?>
