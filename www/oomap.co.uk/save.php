<?php

//sleep(1);
//header("Content-type: application/json", true);

include_once "db.php";

$inData = $_POST['data'];

if ($inData == false)
{
	$returnData = array('success'=>false, 'message'=>'No data supplied.');
	echo json_encode($returnData);
	return;
}

$created_by = $_SERVER['HTTP_REFERER'];
$created_by_ip = $_SERVER['REMOTE_ADDR'];
$created_by_domain = "";

if (isset($_SERVER['REMOTE_HOST']))
{
	$created_by_domain = $_SERVER['REMOTE_HOST'];
}

$conn = @mysql_connect($dbhost, $dbuser, $dbpass); //Change to 127.0.0.1 for local dev
if (!$conn) 
{
	$returnData = array('success'=>false, 'message'=>mysql_error());
	echo json_encode($returnData);
	return;
}

mysql_select_db($dbdb, $conn);

$idquery = "select max(id) as max_id from map";

$result = mysql_query($idquery, $conn);
if (!$result)
{
	$returnData = array('success'=>false, 'message'=>mysql_error());
	echo json_encode($returnData);
	mysql_close($conn);
	return;
}

$result = mysql_fetch_assoc($result);
if (!$result)
{
	$returnData = array('success'=>false, 'message'=>mysql_error());
	echo json_encode($returnData);
	mysql_close($conn);
	return;
}

$max_id = $result['max_id'];

if ($max_id == NULL)
{
	$max_id = 0;
}

$next_id = ++$max_id;

$shortcode = uniqid();

//Don't forget safety stripping
$action = mysql_real_escape_string($inData['action']);
$title =  mysql_real_escape_string($inData['title']);
$race_instructions = mysql_real_escape_string($inData['race_instructions']);
$eventdate = mysql_real_escape_string($inData['eventdate']);
$club = mysql_real_escape_string($inData['club']);
$style = mysql_real_escape_string($inData['style']);
$scale = mysql_real_escape_string($inData['scale']);
$papersize = mysql_real_escape_string($inData['papersize']);
$paperorientation = mysql_real_escape_string($inData['paperorientation']);
$centre_lat = mysql_real_escape_string($inData['centre_wgs84lat']);
$centre_lon = mysql_real_escape_string($inData['centre_wgs84lon']);

$writequery = "insert into map values($next_id, '$shortcode', '$action', '$title', '$race_instructions', '$eventdate', '$club', '$style', '$scale', '$papersize', '$paperorientation', $centre_lat, $centre_lon, '$created_by', '$created_by_ip', '$created_by_domain', now(), 0, now())";
$result = mysql_query($writequery, $conn);
if (!$result)
{
	$returnData = array('success'=>false, 'message'=>mysql_error(), 'data'=>$writequery);
	echo json_encode($returnData);
	mysql_close($conn);
	return;
}

$controls = null;

if (isset($inData['controls']))
{
	$controls = $inData['controls'];
}

if ($controls != null)
{
	foreach($controls as $control)
	{

		$type = mysql_real_escape_string($control['type']);
		$label = mysql_real_escape_string($control['number']);
		$label_angle = mysql_real_escape_string($control['angle']);

		if ($type == "c_cross")
		{
			$label = mysql_real_escape_string($control['id']);
		}
		$score = mysql_real_escape_string($control['score']);
		$lat = mysql_real_escape_string($control['wgs84lat']);
		$lon = mysql_real_escape_string($control['wgs84lon']);
		$description = mysql_real_escape_string($control['description']);

		$writequery = "insert into control values($next_id, '$type', '$label', $label_angle, '$score', $lat, $lon, '$description')";
		$result = mysql_query($writequery, $conn);
		if (!$result)
		{
			$returnData = array('success'=>false, 'message'=>mysql_error(), 'data'=>$writequery);
			echo json_encode($returnData);
			@mysql_close($conn);
			return;
		}
	}
}

$returnData = array('success'=>true, 'message'=>$shortcode, 'data'=>'Successfully saved.');
echo json_encode($returnData);

mysql_close($conn);
?>