<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">	
		<meta name="viewport" content="minimal-ui, initial-scale=0.5, user-scalable=no, width=device-width">

		<meta property="og:title" content="OOMap Blueprint: The easy colour-a-map creation tool!" />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="http://oomap.co.uk/" />
		<meta property="og:description" content="Create colouring-in maps of anywhere in the world with just a few clicks. Print high-quality vector PDFs." />
		<meta property="og:image" content="http://oomap.co.uk/images/blueprint_screenshot.png" />
		<meta property="og:site_name" content="OOMap Blueprint: The easy colour-a-map creation tool!" />    
		<meta property="fb:admins" content="507348039" />    
		<meta property="fb:app_id" content="1592343544404355" />    

		<title>OOMap Blueprint: The easy colour-a-map creation tool!</title>
		<script type='text/javascript' src='http://lib.oomap.co.uk/proj4.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/openlayers/v3.18.2-dist/ol-debug.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/jquery-1.11.3.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/jquery-ui-1.11.4.custom/jquery-ui.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/jquery.knob.js'></script>
		<script type='text/javascript' src='http://lib.oomap.co.uk/jquery.jqprint-0.3.js'></script>
		<script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script>
		<script src="//platform.twitter.com/widgets.js"></script>			
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
		<script type='text/javascript'>
			var country = "blueprint";
		</script>
		<script type='text/javascript' src="/main.js?t=<?php echo time(); ?>"></script>
		<link rel="canonical" href="http://oomap.co.uk/">
		<link rel='stylesheet' type='text/css' href='http://lib.oomap.co.uk/jquery-ui-1.11.4.custom/jquery-ui.css'>
		<link rel='stylesheet' type='text/css' href='http://lib.oomap.co.uk/openlayers/v3.18.2-dist/ol.css'>
		<link rel='stylesheet' type='text/css' href='/style.css'>
	</head>
	<body style="background-image: url('../images/blueprint_background.png')">
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
		<div id='toppanel' style="background-image: url('../images/blueprint_background.png')">
				<form id='load'>Map ID: <input type='text' size='15' id='savedMapID' />
					<button id='loadButton' type="submit">Load</button>
				</form>
				<div id='title' style='background-color: #08c;'>OOMAP Blueprint<span id='titlestatus'></span></div>
		</div>
		<div id='editions'>
			<div id='messagePanelHolder'>
				<div class='messagePanel' id='messageZoom'>Tip: zoom in to see the Blueprint map.</div>
				<div class='messagePanel' id='messageCentre'>Tip: click where you want the centre of your sheet to be. Click and then drag the blue dot to move the sheet.</div>
				<div class='messagePanel' id='messageAdd'>Tip: Happy with your map? Click "Save & get PDF map".</div>
			</div>
			<table><tr><td>
			<div id='blueprint' class='editionbutton' style='background-color: black;'><a href="/blueprint/">&nbsp;  Blueprint  &nbsp;</a></div></td><td>
			<div id='global' class='editionbutton'><a href="/global/">&nbsp;  Global  &nbsp;</a></div></td><td>
			<div id='uk' class='editionbutton'><a href="/gb/">&nbsp;  UK  &nbsp;</a></div></td><td>
			<div id='ireland' class='editionbutton'><a href="/ie/">&nbsp;  Ireland  &nbsp;</a></div></td><td>
			<div id='wishlist'>Want to say thanks? Here's a link<br />to <a href="http://www.amazon.co.uk/registry/wishlist/2WLZDJ7S00ERD">my Amazon wish list</a>.</div></td><td>
			<div class="fb-like" data-href="http://oomap.co.uk/blueprint/" data-send="false"  data-layout="button_count" data-width="150" data-show-faces="false" data-share="true" data-font="arial"></div></td><td>
			<div id='social'><a href="https://twitter.com/share" class="twitter-share-button" data-count="horizontal" data-via="oobr">Tweet</a></div></td>
			</tr></table>
		</div>

		<div id='optionspanel'>
			<div id='toolbar' class="ui-widget-header ui-corner-all">
				<table>
					<tr style='height: 27px'>
						<td rowspan='3' style='vertical-align: top;'>
						</td>
						<td colspan='3'> 
							<div id="mapscale">Scale 1:
								<input type="radio" id="s5000" value="5000" name="mapscale" /><label for="s5000">5000</label>
								<input type="radio" id="s7500" value="7500" name="mapscale" /><label for="s7500">7500</label>
								<input type="radio" id="s10000" value="10000" name="mapscale" checked="checked" /><label for="s10000">10000</label>
								<input type="radio" id="s12500" value="12500" name="mapscale" /><label for="s12500">12500</label>
								<input type="radio" id="s15000" value="15000" name="mapscale" /><label for="s15000">15k</label>
								<input type="radio" id="s20000" value="20000" name="mapscale" /><label for="s20000">20k</label>
								<input type="radio" id="s40000" value="40000" name="mapscale" /><label for="s40000">40k</label>
							</div>
						</td>
					</tr>
					<tr style='height: 27px'>
						<td>	
							<div id="papersize">Sheet 
								<input type="radio" id="p2970-2100" name="papersize" checked="checked" /><label for="p2970-2100">A4</label>
								<input type="radio" id="p4200-2970" name="papersize" /><label for="p4200-2970">A3</label>
								<!-- <input type="radio" id="p4430-3140" name="papersize" /><label for="p4430-3140">RA3</label> -->
							</div>
						</td>
						<td>
							<div id="paperorientation"> 
								<input type="radio" id="portrait" name="paperorientation" /><label for="portrait">Portrait</label>
								<input type="radio" id="landscape" name="paperorientation" checked="checked" /><label for="landscape">Landscape</label>
							</div>
						</td>
						<td></td>
					</tr>
					<tr style='height: 26px'>
						<td colspan='3'>	
							<div id="specialoptions">Special 
								<button id='deletesheet'>Delete Sheet</button>
							</div>
						</td>					
					</tr>
				</table>  	
	
			</div>	
			<div id='create' class="ui-widget-header ui-corner-all">
				<button id='createmap'>Save & get PDF map</button>					
			</div>	
		</div>
		<div id='mainpanel'>
			<div id='controlpanel'>
				<table id='controldescriptions'>
					<tr id='spacerrow'><th style='width: 40px;'></th><th style='width: 30px;'></th><th></th><th></th><th style='width:64px;'></th></tr>
					<tr><th colspan='4' id='maptitle'></th><th><span class="edit" id="edittitle">Edit</span></th></tr>
					<tr><th colspan='3' id='scalecaption'></th><th colspan='2'></th></tr>
				</table>
				<div style='margin: 10px 0; padding: 10px; background-color: white;'>
				Welcome to Blueprint by OOMap!<br /><br />To create a map:
				<ol>
					<li>Zoom and pan to your favourite area, using the standard map on the left. Once zoomed in a certain amount, the Blueprint map will show.</li>
					<li>If you like, you can zoom in further for more detail!</li>
					<li>Use the controls at the top to place a sheet on the map, and adjust scale/size etc.</li>
					<li>Optionally, set the title of your map using the edit button on the top right.</li>
					<li>Create your high quality PDF map by clicking the "Save and get PDF map" button on the top right.</li>
					<li>A PDF will download a few seconds later. You can now open and print this PDF!</li>
				</ol>
				</div>
			</div>
			<!--
			<div id='supported'>
				<div style='padding: 0 30px 10px 30px; margin: 0; border: 1px dotted #00f;'>
				<h2>Tip Jar</h2>
					Like this service? Did it create a useful map for your successful event? All tip jar donations are gratefully appreciated and go towards hosting and bandwidth costs for the website. Thanks!<br /><br />
					<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
						<input type="hidden" name="cmd" value="_s-xclick">
						<input type="hidden" name="hosted_button_id" value="AF24M2DV983GJ">
						<input type="image" src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online.">
						<img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">
					</form>
				</div>
			</div>	
			-->
			<div id='sponsor'>
				<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
				<!-- OpenOrienteeeringMap -->
				<ins class="adsbygoogle"
    				 style="display:inline-block;width:300px;height:250px"
    				 data-ad-client="ca-pub-3486529756444295"
  				   data-ad-slot="6719111565"></ins>
				<script>
					(adsbygoogle = window.adsbygoogle || []).push({});
				</script>	
			</div>	
			<div id='attribution' style='background-color: white;'>
				<div>Created by <a href="http://blog.oomap.co.uk/">Oliver O'Brien</a><br /><a href="" onclick="alert('Background data is Copyright OpenStreetMap contributors 2017. The tile imagery used for the initial zoom layers is CC-By-SA OpenStreetMap. Plaques from Open Plaques project.'); return false;">Attribution</a> (OSM) <a href="http://blog.oomap.co.uk/oom/">About</a> <a href="http://blog.oomap.co.uk/oom/">Comments?</a><br />Supported by <a href="http://www.orienteeringfoundation.org.uk">The Orienteering Foundation</a>.</div>
			</div>
			<div id='map' style='background-color: white;'></div>
		</div>
		<div id="setmaptitle" title="Map title" style='display: none;'>
		  <p class="validateTips"></p>
		  <fieldset>
			<table>
			<tr>
				<td>
					<label for="s_maptitle">Title</label>
				</td>
				<td>  	
					<input type="text" size='30' maxlength='50' value="" name="maptitle" id="s_maptitle" class="text ui-widget-content ui-corner-all" />			
				</td>
			</tr>
			</table>
		  </fieldset>
		</div>
		<div id="validationerror" title="Validation Error" style='display: none;'>
			<table>
				<tr><td class="ui-icon ui-icon-alert" style='margin: 0 7px 20px 0;'></td><td style='padding-bottom: 20px; vertical-align: top'>There were one or more errors validating your map.</td></tr>
				<tr><td class="ui-icon ui-icon-info" style='margin: 0 7px 20px 0;'></td><td style='padding-bottom: 20px; vertical-align: top' id='validationerror_text'></td></tr>
			</table>
		</div>
		<div id="saving" title="Saving" style='display: none;'>
			<table>
				<tr><td class="ui-icon ui-icon-info" style='margin: 0 7px 20px 0;'></td><td style='padding-bottom: 20px; vertical-align: top'>Saving map and descriptions to the database...</td></tr>
			</table>
		</div>
		<div id="saveerror" title="Save Error" style='display: none;'>
			<table>
				<tr><td class="ui-icon ui-icon-alert" style="margin: 0 7px 20px 0;"></td><td style='padding-bottom: 20px; vertical-align: top'>Unfortunately your map and descriptions could not be saved. An error occurred.</td></tr>
				<tr><td class="ui-icon ui-icon-info" style="margin: 0 7px 20px 0;"></td><td style='padding-bottom: 20px; vertical-align: top' id='saveerror_text'></td></tr>
			</table>
		</div>
		<div id="generating" title="Saved" style='display: none;'>
			<table>
				<tr><td class="ui-icon ui-icon-check" style="margin: 0 7px 20px 0;"></td><td style='padding-bottom: 20px; vertical-align: top'>Your map and descriptions have been successfully saved. The map is now being generated and will automatically download to your computer in the next few seconds.</td></tr>
				<tr><td class="ui-icon ui-icon-info" style="margin: 0 7px 20px 0;"></td><td style='padding-bottom: 20px; vertical-align: top' id='saved_mapid'></td></tr>
			</table>
		</div>
		<div id="loaderror" title="Load Error" style='display: none;'>
			<table>
				<tr><td class="ui-icon ui-icon-alert" style="margin: 0 7px 20px 0;"></td><td style='padding-bottom: 20px; vertical-align: top'>Unfortunately your map and descriptions could not be loaded. An error occurred.</td></tr>
				<tr><td class="ui-icon ui-icon-info" style="margin: 0 7px 20px 0;"></td><td style='padding-bottom: 20px; vertical-align: top' id='loaderror_text'></td></tr>
			</table>
		</div>
	</body>
</html>
