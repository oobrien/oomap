<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="minimal-ui, initial-scale=0.5, user-scalable=no, width=device-width">
<!--
		<meta property="og:title" content="OpenOrienteeringMap: The easy Street-O map creation tool" />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="https://oomap.co.uk/" />
		<meta property="og:description" content="Create orienteering maps of anywhere in the world with just a few clicks. Add controls and print high-quality vector PDFs, suitable for training events." />
		<meta property="og:image" content="https://oomap.co.uk/images/oom_screenshot.png" />
		<meta property="og:site_name" content="OpenOrienteeringMap: The easy Street-O map creation tool" />
		<meta property="fb:admins" content="507348039" />
		<meta property="fb:app_id" content="1592343544404355" />
-->
		<title>OpenOrienteeringMap: The easy Street-O map creation tool</title>
		<script type='text/javascript' src='https://lib.oomap.co.uk/proj4js/proj4js-compressed.js'></script>
		<script type='text/javascript' src='https://lib.oomap.co.uk/proj4js/defs/EPSG27700.js'></script>
		<script type='text/javascript' src='https://lib.oomap.co.uk/openlayers/OpenLayers-2.13.1/OpenLayers.js'></script>
		<script type='text/javascript' src='https://lib.oomap.co.uk/jquery-1.8.3.js'></script>
		<script type='text/javascript' src='https://lib.oomap.co.uk/jquery-ui-1.9.2.custom.js'></script>
		<script type='text/javascript' src='https://lib.oomap.co.uk/jquery.knob.js'></script>
		<script type='text/javascript' src='https://lib.oomap.co.uk/jquery.jqprint-0.3.js'></script>
<!--
		<script src="//platform.twitter.com/widgets.js"></script>
		<script type="text/javascript">
		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-424605-5']);
		  _gaq.push(['_setDomainName', 'oomap.co.uk']);
		  _gaq.push(['_trackPageview']);
		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'https://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();
		</script>
		<link rel="canonical" href="https://oomap.co.uk/">
-->
		<link rel='stylesheet' type='text/css' href='https://lib.oomap.co.uk/jquery-ui-1.11.4.custom/jquery-ui.css'>
		<link rel='stylesheet' type='text/css' href='style.css'>
	</head>
	<body style='background-color: #f4f2f1;'>
<!--
		<script>
		  window.fbAsyncInit = function() {
			FB.init({
			  appId      : '1592343544404355',
			  xfbml      : true,
			  version    : 'v2.8'
			});
		  };

		  (function(d, s, id){
			 var js, fjs = d.getElementsByTagName(s)[0];
			 if (d.getElementById(id)) {return;}
			 js = d.createElement(s); js.id = id;
			 js.src = "//connect.facebook.net/en_US/sdk.js";
			 fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));
		</script>
-->
<h1 style='margin: 40px 0 0 50px; font-size: 48px;'>OOMap</h1>
<!--
	<div style='float: left; width: 600px; height: 300px;  padding: 10px 30px 0 30px; margin: 30px 10px 30px 50px; border: 1px solid #aaa; background-color: white; opacity: 0.9;'>
		<h2>Mapping and Data Consultancy</h2>
		OOMap provides bespoke consultancy services, including data analysis, web development and digital cartography, as well as website hosting and management. Some of OOMap's recent public-facing projects include:
	<div style='margin: 50px auto 50px auto;'>
		<div style='clear: both;'>Maps:
			<a href="https://simd.scot/" style='width: 30px; height: 30px; background-color: #060; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>SIMD</a>
		Data:
			<a href="https://usp.scot/" style='width: 30px; height: 30px; background-color: #060; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>USP (Flow data)</a>
		</div><div style='margin-top: 60px;'>Both:
			<a href="https://tubeheartbeat.com/" style='width: 30px; height: 30px; background-color: #060; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>TubeHeartbeat</a>
			</div>
		</div>
	</div>


	<div style='float: left; width: 600px; height: 300px;  padding: 10px 30px 0 30px; margin: 30px 10px 30px 50px; border: 1px solid #aaa; background-color: white; opacity: 0.9;'>
		<h2>Bike Share Map: Live data on bikeshare from 300+ cities</h2>
		The Bike Share Map collects and maps data from docking stations around the world in real time. View the live status of each system, or  replay the last 48 hours of data to see the ebb and flow of bikeshare bikes.
		<div style='margin: 50px auto 50px auto;'>
			<a href="https://bikes.oobrien.com/" style='width: 30px; height: 30px; background-color: #08d; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Global</a>
			<a href="https://bikes.oobrien.com/london/" style='width: 30px; height: 30px; background-color: #08d; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>London</a>
			<a href="https://bikes.oobrien.com/paris/" style='width: 30px; height: 30px; background-color: #08d; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Paris</a>
			<a href="https://bikes.oobrien.com/newyork/" style='width: 30px; height: 30px; background-color: #08d; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>NYC</a>
		</div>
	</div>
-->
	<div style='float: left; width: 600px; height: 300px; padding: 10px 30px 0 30px;margin: 30px 10px 30px 50px; border: 1px solid #aaa; background-color: white; opacity: 0.9;'>
		<h2>OpenOrienteeringMap: The easy Street-O map creation tool</h2>

		<!--	<div style='color: black; background-color: yellow; padding: 5px; margin-bottom: 10px;'>[WARNING: SERVICE UNAVAILABLE FROM 1700 GMT ON FRIDAY 20 FEBRUARY TO 1200 GMT (AT RISK TO 1700 GMT) ON MONDAY 23 FEBRUARY DUE TO BUILDING POWER UPGRADE]</div>
		-->
		This adaptation of OpenOrienteeringMap has a single edition:
		<ul>
		<li>UK (BOF) edition (with contours and daily updating from OpenStreetMap)</li>
<!--
		<li>Ireland (IOA) edition (with daily updating from OpenStreetMap)</li>
		<li>Denmark edition (with daily updating from OpenStreetMap)</li>
		<li>Global edition (with OpenStreetMap data updated annually) </li>
		<li>Blueprint (a simplified version of the Global edition, showcasing the Blueprint style map)</li>
-->
		</ul>


		<div style='margin: 50px auto 50px auto;'>
<!--
			<a href="/global/" style='width: 30px; height: 30px; background-color: #c00; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Global</a>
-->
			<a href="/gb/" style='width: 30px; height: 30px; background-color: #c00; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>UK</a>
<!--
			<a href="/ie/" style='width: 30px; height: 30px; background-color: #c00; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>IE</a>
			<a href="/dk/" style='width: 30px; height: 30px; background-color: #c00; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>DK</a>
			<a href="/blueprint/" style='width: 30px; height: 30px; background-color: #c00; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Blueprint</a>
-->
		</div>
	</div>

	<div style='float: left; width: 600px; height: 300px;  padding: 10px 30px 0 30px; margin: 30px 10px 30px 50px; border: 1px solid #aaa; background-color: white; opacity: 0.9;'>
		<div style='margin: 50px auto 50px auto;'>
		<div style='clear: both;'>Social:
			<a href="https://twitter.com/oobr" style='width: 30px; height: 30px; background-color: #aaa; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Twitter</a>
			<a href="https://www.linkedin.com/in/oliver-o-brien-17a459/" style='width: 30px; height: 30px; background-color: #aaa; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Linked-In</a>
		</div><div style='margin-top: 60px;'>Content:
			<a href="https://oobrien.com/" style='width: 30px; height: 30px; background-color: #aaa; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Blog</a>
			<a href="https://portfolio.oobrien.com/" style='width: 30px; height: 30px; background-color: #aaa; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Portfolio</a>
			<a href="https://mappinglondon.co.uk/" style='width: 30px; height: 30px; background-color: #aaa; margin: 0 20px 10px 0; padding: 15px 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Mapping London</a>
		</div>
		<div style='margin: 50px auto 30px auto;'>
		OOMap is a creation of Oliver O'Brien, based in London, UK. Email: o.obrien [at] outlook.com
		</div>
	</div>
	<div style='position: absolute; bottom: 0; left: 10px; transform: rotate(-90deg); transform-origin: top left 0;'>&copy; Oliver O'Brien 2019</div>
	</body>
</html>
