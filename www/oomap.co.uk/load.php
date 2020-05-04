<?php

//sleep(1);
//header("Content-type: application/json", true);

include_once "db.php";

$inData = $_POST['shortcode'];

if ($inData == false)
{
	$returnData = array('success'=>false, 'message'=>'No data supplied.');
	echo json_encode($returnData);
	return;
}

$conn = @mysqli_connect($dbhost, $dbuser, $dbpass); //Change to 127.0.0.1 for local dev
if (!$conn) 
{
	$returnData = array('success'=>false, 'message'=>mysqli_error($conn));
	echo json_encode($returnData);
	return;
}

mysqli_select_db($conn, $dbdb);

$shortcode = mysqli_real_escape_string($conn, $inData);

$mapquery = "select id, title, race_instructions, eventdate, club, style, scale, papersize, paperorientation, centre_lat, centre_lon from map where shortcode = '$shortcode' limit 1";

$result = mysqli_query($conn, $mapquery);
if (!$result)
{
	$returnData = array('success'=>false, 'message'=>mysqli_error($conn));
	echo json_encode($returnData);
	mysqli_close($conn);
	return;
}

$num_rows = mysqli_num_rows($result);
if ($num_rows < 1)
{
	$returnData = array('success'=>false, 'message'=>'Map not found - check number.');
	echo json_encode($returnData);
	mysqli_close($conn);
	return;
}

$row = mysqli_fetch_assoc($result);
if (!$row)
{
	$returnData = array('success'=>false, 'message'=>mysqli_error($conn));
	echo json_encode($returnData);
	mysqli_close($conn);
	return;
}

$data = array();

$map_id = $row['id'];
$data["title"] = $row['title'];
$data["race_instructions"] = $row['race_instructions'];
$data["eventdate"] = $row['eventdate'];
$data["club"] = $row['club'];
$data["style"] = $row['style'];
$data["scale"] = $row['scale'];
$data["papersize"] = $row['papersize'];
$data["paperorientation"] = $row['paperorientation'];
$data["centre_lat"] = $row['centre_lat'];
$data["centre_lon"] = $row['centre_lon'];

// Increment the counter here.
$update_query = "update map set access_count = access_count + 1, last_accessed = now() where id = $map_id limit 1;";
@mysqli_query($conn, $update_query);

$controlquery = "select type, label, label_angle, score, lat, lon, description from control where map_id = $map_id";

$result = mysqli_query($conn, $controlquery);
if (!$result)
{
	$returnData = array('success'=>false, 'message'=>mysqli_error($conn));
	echo json_encode($returnData);
	mysqli_close($conn);
	return;
}

$controls = array();
while($row = mysqli_fetch_assoc($result))
{
	$control = array();
	$control["type"] = $row['type'];
	$control["number"] = $row['label'];
	$control["angle"] = $row['label_angle'];
	$control["score"] = $row['score'];
	$control["wgs84lat"] = $row['lat'];
	$control["wgs84lon"] = $row['lon'];
	$control["description"] = $row['description'];
	$controls[] = $control;
}

$data["controls"] = $controls;

$returnData = array('success'=>true, 'message'=>$shortcode, 'data'=>$data);
echo json_encode($returnData);

mysqli_close($conn);
?>
