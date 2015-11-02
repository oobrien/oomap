<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">	
		<title>OpenOrienteeringMap: The easy Street-O map creation tool</title>
		<script type='text/javascript' src='http://lib.oomap.co.uk/proj4js/proj4js-compressed.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/proj4js/defs/EPSG27700.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/openlayers/OpenLayers-2.13.1/OpenLayers.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/jquery-1.8.3.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/jquery-ui-1.9.2.custom.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/jquery.knob.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/jquery.jqprint-0.3.js'></script>
		<script type="text/javascript">
		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-424605-5']);
		  _gaq.push(['_setDomainName', 'oomap.co.uk']);
		  _gaq.push(['_trackPageview']);
		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();
		</script>
		<style>
			html
			{
				background: url('images/oom_background.png');
			}
		</style>
		<link rel='stylesheet' type='text/css' href='http://lib.oomap.co.uk/jquery-ui-1.11.4.custom/jquery-ui.css'>
		<link rel='stylesheet' type='text/css' href='style.css'>
	</head>
	<body>
	<div id='toppanel' style='border-bottom: 1px solid #aaa;'>
			<div id='editions'>
				<div id='global'><a href="global.php">&nbsp;  Global  &nbsp;</a></div>
				<div id='uk'><a href="uk.php">&nbsp;  UK  &nbsp;</a></div>
				<div id='ireland'><a href="ioa.php">&nbsp;  Ireland  &nbsp;</a></div>
			</div>
			<div id='title'>OPENORIENTEERINGMAP<span id='titlestatus'>v2.3</span></div>
	</div>
	<div style='padding: 20px 30px 30px 30px; margin: 30px; border: 1px solid #aaa; border-radius: 20px; background-color: white; opacity: 0.9; width: 725px;'>
		<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
		<!-- OpenOrienteeringMap LB -->
		<ins class="adsbygoogle"
			 style="display:inline-block;width:728px;height:90px"
			 data-ad-client="ca-pub-3486529756444295"
			 data-ad-slot="8518177961"></ins>
		<script>
		(adsbygoogle = window.adsbygoogle || []).push({});
		</script>		
		<h2>Welcome to OpenOrienteeringMap, the easy Street-O map creation tool.</h2>
		 
		<!--	<div style='color: black; background-color: yellow; padding: 5px; margin-bottom: 10px;'>[WARNING: SERVICE UNAVAILABLE FROM 1700 GMT ON FRIDAY 20 FEBRUARY TO 1200 GMT (AT RISK TO 1700 GMT) ON MONDAY 23 FEBRUARY DUE TO BUILDING POWER UPGRADE]</div>
		-->
		You can quickly and easily set a map, add controls, and create a print-ready, high quality vector PDF.
		<br /><br />
		There are three editions of OpenOrienteeringMap currently:
		<ul>
		<li><a href="uk.php">UK (BOF) edition</a> (with contours and daily updating from OpenStreetMap)</li>
		<li><a href="ioa.php">Ireland (IOA) edition</a> (with daily updating from OpenStreetMap)</li>
		<li><a href="global.php">Global edition</a> (with OpenStreetMap data as of 7 April 2015)</li>
		</ul>	
		
		If you have any comments, leave them at the end <a href="http://blog.oomap.co.uk/oom/#commentform">here</a>.<br />
		You can also <a href="http://blog.oomap.co.uk/oom/">find out more</a> about OpenOrienteeringMap, and keep an eye on <a href="http://blog.oomap.co.uk/">my blog</a> for news on updates.
		<br /><br />
		
		<div>	
		<i>If you are interested in commissioning a branded and ad-free version of the OpenOrienteeringMap website,<br />
		for example to include national, regional or club colours and logos, please contact me at o.obrien (at) outlook.com</i>
		</div>
		<div style='padding: 20px; margin: 20px 0; background-color: #fee; border-radius: 20px;'>
		OpenOrienteeringMap is completely free. If you really want to, you could  
		please <a href="http://www.amazon.co.uk/gp/registry/wishlist/2WLZDJ7S00ERD/ref=cm_wl_huc_view">buy me something on my gift-list</a> or <a href="http://shop.oobrien.com/">buy a print</a>. Or buy yourself something through my <a href="http://www.amazon.co.uk/ref=as_sl_pc_wdgt_ex?&linkCode=wey&tag=yepsport-21">Amazon store link</a>. Gifts will encourage further development and offset the costs of hosting the site.</i>
		</div>

		<div style='margin: 50px auto 50px auto;'>
			<a href="global.php" style='width: 30px; height: 30px; background-color: #00f; border-radius: 50px; margin: 10px; padding: 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Global</a>
			<a href="uk.php" style='width: 30px; height: 30px; background-color: #00f; border-radius: 50px; margin: 10px; padding: 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>UK</a>
			<a href="ioa.php" style='width: 30px; height: 30px; background-color: #00f; border-radius: 50px; margin: 10px; padding: 20px; color: white; text-align: center; vertical-align: middle; text-decoration: none; font-size: 24px;'>Ireland</a>

		</div>
		<div style='font-size: 10px; margin: 30px 0;'>OpenOrienteeringMap's data is obtained from <a href="http://osm.org/">OpenStreetMap</a> which is Copyright OpenStreetMap and contributors 
		and used under the Open Database Licence (ODbL). Contours (UK edition) are Crown Copyright and Database Right Ordnance Survey 2014.
		OpenOrienteeringMap is maintained by Oliver O'Brien (SLOW).</div>
		<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
		<!-- OpenOrienteeringMap LB -->
		<ins class="adsbygoogle"
			 style="display:inline-block;width:728px;height:90px"
			 data-ad-client="ca-pub-3486529756444295"
			 data-ad-slot="8518177961"></ins>
		<script>
		(adsbygoogle = window.adsbygoogle || []).push({});
		</script>		
	</div>		


	</body>
</html>
