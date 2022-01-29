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

$conn = @mysqli_connect($dbhost, $dbuser, $dbpass); //Change to 127.0.0.1 for local dev
if (!$conn)
{
	$returnData = array('success'=>false, 'message'=>mysqli_error($conn));
	echo json_encode($returnData);
	return;
}

mysqli_select_db($conn, $dbdb);

$idquery = "select max(id) as max_id from map";

$result = mysqli_query($conn, $idquery);
if (!$result)
{
	$returnData = array('success'=>false, 'message'=>mysqli_error($conn));
	echo json_encode($returnData);
	mysqli_close($conn);
	return;
}

$result = mysqli_fetch_assoc($result);
if (!$result)
{
	$returnData = array('success'=>false, 'message'=>mysqli_error($conn));
	echo json_encode($returnData);
	mysqli_close($conn);
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
$action = mysqli_real_escape_string($conn, $inData['action']);
$title =  mysqli_real_escape_string($conn, $inData['title']);
$race_instructions = mysqli_real_escape_string($conn, $inData['race_instructions']);
$eventdate = '';//mysqli_real_escape_string($conn, $inData['eventdate']);
if ($eventdate === '')
{
	$eventdate = "null";
}
else
{
	$eventdate = "'" . $eventdate . "'";
}
$club = '';//club';//mysqli_real_escape_string($conn, $inData['club']);
$style = mysqli_real_escape_string($conn, $inData['style']);
$scale = mysqli_real_escape_string($conn, $inData['scale']);
$papersize = mysqli_real_escape_string($conn, $inData['papersize']);
$paperorientation = mysqli_real_escape_string($conn, $inData['paperorientation']);
$centre_lat = mysqli_real_escape_string($conn, $inData['centre_wgs84lat']);
$centre_lon = mysqli_real_escape_string($conn, $inData['centre_wgs84lon']);
$rotation = mysqli_real_escape_string($conn, $inData['rotation']);

$writequery = "insert into map values('$next_id', '$shortcode', '$action', '$title', '$race_instructions', $eventdate, '$club', '$style', '$scale', '$papersize', '$paperorientation', '$centre_lat', '$centre_lon', '$created_by', '$created_by_ip', '$created_by_domain', now(), 0, now(), '$rotation')";
$result = mysqli_query($conn, $writequery);
if (!$result)
{
	$returnData = array('success'=>false, 'message'=>mysqli_error($conn), 'data'=>$writequery);
	echo json_encode($returnData);
	mysqli_close($conn);
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

		$type = mysqli_real_escape_string($conn, $control['type']);
		$label = mysqli_real_escape_string($conn, $control['number']);
		$label_angle = mysqli_real_escape_string($conn, $control['angle']);

		if ($type == "c_cross")
		{
			$label = mysqli_real_escape_string($conn, $control['id']);
		}
		if ($type == "c_crossingpoint")
		{
			$label = mysqli_real_escape_string($conn, $control['id']);
		}
		$score = mysqli_real_escape_string($conn, $control['score']);
		$lat = mysqli_real_escape_string($conn, $control['wgs84lat']);
		$lon = mysqli_real_escape_string($conn, $control['wgs84lon']);
		$description = mysqli_real_escape_string($conn, $control['description']);

		$writequery = "insert into control values('$next_id', '$type', '$label', '$label_angle', '$score', '$lat', '$lon', '$description')";
		$result = mysqli_query($conn, $writequery);
		if (!$result)
		{
			$returnData = array('success'=>false, 'message'=>mysqli_error($conn), 'data'=>$writequery);
			echo json_encode($returnData);
			@mysqli_close($conn);
			return;
		}
	}
}

$returnData = array('success'=>true, 'message'=>$shortcode, 'data'=>'Successfully saved.');
echo json_encode($returnData);

mysqli_close($conn);
?>
