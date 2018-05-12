<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">	
		<meta name="viewport" content="minimal-ui, initial-scale=0.5, user-scalable=no, width=device-width">

		<meta property="og:title" content="OpenOrienteeringMap: The easy Street-O map creation tool" />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="http://oomap.co.uk/" />
		<meta property="og:description" content="Create orienteering maps of anywhere in the world with just a few clicks. Add controls and print high-quality vector PDFs, suitable for training events." />
		<meta property="og:image" content="http://oomap.co.uk/images/oom_screenshot.png" />
		<meta property="og:site_name" content="OpenOrienteeringMap: The easy Street-O map creation tool" />    
		<meta property="fb:admins" content="507348039" />    
		<meta property="fb:app_id" content="1592343544404355" />    

		<title>OpenOrienteeringMap: The easy Street-O map creation tool</title>
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
			var country = "global";
		</script>
		<script type='text/javascript' src="/main.js?t=<?php echo time(); ?>"></script>
		<link rel="canonical" href="http://oomap.co.uk/">
		<link rel='stylesheet' type='text/css' href='http://lib.oomap.co.uk/jquery-ui-1.11.4.custom/jquery-ui.css'>
		<link rel='stylesheet' type='text/css' href='http://lib.oomap.co.uk/openlayers/v3.18.2-dist/ol.css'>
		<link rel='stylesheet' type='text/css' href='/style.css'>
	</head>
	<body>
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
		<div id='toppanel'>
				<form id='load'>Map ID: <input type='text' size='15' id='savedMapID' />
					<button id='loadButton' type="submit">Load</button>
				</form>
				<div id='title'>OPENORIENTEERINGMAP<span id='titlestatus'>v3.1</span></div>
		</div>
		<div id='editions'>
			<div id='messagePanelHolder'>
				<div class='messagePanel' id='messageZoom'>Tip: zoom in to see the orienteering map, before setting options or adding controls.</div>
				<div class='messagePanel' id='messageCentre'>Tip: click where you want the centre of your sheet to be. Don't forget you can drag the map to move it.</div>
				<div class='messagePanel' id='messageAdd'>Tip: click to add controls, To move the map, select and then drag the blue marker. Once done, click "Save" to get PDF.</div>
			</div>
			<table><tr><td>
			<div id='blueprint' class='editionbutton'><a href="/blueprint/">&nbsp;  Blueprint  &nbsp;</a></div></td><td>
			<div id='global' class='editionbutton currentedition'><a href="/global/">&nbsp;  Global  &nbsp;</a></div></td><td>
			<div id='uk' class='editionbutton'><a href="/gb/">&nbsp;  UK  &nbsp;</a></div></td><td>
			<div id='ireland' class='editionbutton'><a href="/ie/">&nbsp;  Ireland  &nbsp;</a></div></td><td>
			<div id='wishlist'>Was this useful for your event? Want to say thanks?<br />Here's a link to <a href="http://www.amazon.co.uk/registry/wishlist/2WLZDJ7S00ERD">my Amazon wish list</a>.</div>	</td><td>				
			<div class="fb-like" data-href="http://oomap.co.uk/global.php" data-send="false"  data-layout="button_count" data-width="150" data-show-faces="false" data-share="true" data-font="arial"></div></td><td>
			<div id='social'><a href="https://twitter.com/share" class="twitter-share-button" data-count="horizontal" data-via="oobr">Tweet</a></div></td>
			</tr></table>
		</div>
		<div id='optionspanel'>
			<div id='toolbar' class="ui-widget-header ui-corner-all">
				<table>
					<tr>
						<td rowspan='3' style='vertical-align: top;'>
							<div id="mapstyle" class="buttonset">
								<input type="radio" id="streeto_global" name="mapstyle" checked="checked" />
									<label for="streeto_global"><img src='/images/oom_s.png' alt='Street-O' style='width: 60px; height: 60px;' /><br />StreetO</label>
								<input type="radio" id="streeto_norail_global" name="mapstyle" />
									<label for="streeto_norail_global"><img src='/images/oom_snr.png' alt='Street-O xrail' style='width: 60px; height: 60px;' /><br />StreetO xrail</label>
								<input type="radio" id="oterrain_global" name="mapstyle" />
									<label for="oterrain_global"><img src='/images/oom_p.png' alt='PseudO' style='width: 60px; height: 60px;' /><br />PseudO</label>
								<!-- <input type="radio" id="blueprint" name="mapstyle" />
									<label for="blueprint"><img src='/images/oom_blueprint.png' alt='Blueprint' style='width: 60px; height: 60px;' /><br />Blueprint</label> -->
							</div>
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
					<tr>
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
					<tr>
						<td colspan='3'>	
							<div id="specialoptions">Special 
								<button id='deletesheet'>Delete Sheet</button>
								<button id='deleteXs'>Delete all X &amp; ][</button>
								<button id='getOpenplaques'>Add Plaques</button>
							</div>
						</td>					
					</tr>
				</table>  		
			</div>	
			<div id='create' class="ui-widget-header ui-corner-all">
				<button id='createmap'>Save & get PDF map</button>				
				<button id='getraster'>Get JPG</button>				
				<button id='getworldfile'>Get Worldfile</button>				
				<button id='createclue'>Show clue sheet</button>						
			</div>	
		</div>
		<div id='mainpanel'>
			<div id='controlpanel'>
				<table id='controldescriptions'>
					<tr id='spacerrow'><th style='width: 40px;'></th><th style='width: 30px;'></th><th></th><th></th><th style='width:64px;'></th></tr>
					<tr><th colspan='4' id='maptitle'></th><th><span class="edit" id="edittitle">Edit</span></th></tr>
					<tr>
						<th colspan='3' id='eventdate_holder'>Event Date<br /><input type="text" id="eventdate">&nbsp;<input type="text" id="eventdate_alternate" size="30"></th>
						<th colspan='2' id='club'>Club<br /><select id="club"><option value="none">None</option></select></th>
					</tr>
					<tr><th colspan='3' id='scalecaption'></th><th colspan='2'>10m&nbsp;contours</th></tr>
					<tr><td colspan='4' id='racedescription'></td><th><span class="edit" id="editinstructions">Edit</span></th></tr>
					<tr><th colspan='3' id='controlcaption'>0 controls</th><th colspan='2' id='pointscaption'>0 points</th></tr>
				</table>
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
			<div id='attribution'>
				<div>Created by <a href="http://blog.oomap.co.uk/">Oliver O'Brien</a><br /><a href="" onclick="alert('Background data is Copyright OpenStreetMap contributors 2015. The tile imagery used for the initial zoom layers is CC-By-SA OpenStreetMap. Plaques from Open Plaques project.'); return false;">Attribution</a> (OSM) <a href="http://blog.oomap.co.uk/oom/">About</a> <a href="http://blog.oomap.co.uk/oom/">Comments?</a></div>
			</div>
			<div id='map'></div>
		</div>
		<div id="newcontroloptions" title="Control options" style='display: none;'>
		  <p class="validateTips">Tip: There can only be one start/finish control. Adding another moves it.</p>
		  <fieldset>
			<table style='margin: 0 auto;'>
			<tr>
				<td id="c_type" class="buttonset">
					<input type="radio" id="c_regular" name="c_type" checked="checked" /><label for="c_regular"><img src='/images/c_regular.png' alt='Regular' style='width: 60px; height: 60px;' /><br />Control<br />&nbsp;</label>
					<input type="radio" id="c_startfinish" name="c_type" /><label for="c_startfinish"><img src='/images/c_startfinish.png' alt='Start and Finish' style='width: 60px; height: 60px;' /><br />Start/<br />Finish</label>
					<input type="radio" id="c_cross" name="c_type" /><label for="c_cross"><img src='/images/c_cross.png' alt='Do not Cross' style='width: 60px; height: 60px;' /><br />Do Not<br />Cross: X</label>
					<input type="radio" id="c_crossingpoint" name="c_type" /><label for="c_crossingpoint"><img src='/images/c_crossingpoint.png' alt='Crossing Point' style='width: 60px; height: 60px;' /><br />Crossing<br />Point: ][</label>
				</td>
				<td style='text-align: center; padding: 0 30px;'>
					<input type="text" id="c_angle" class="knob" value="45"><br /><label for="c_angle" id='anglelabel'>Number<br />position</label>
				</td>
			</tr>
			</table>
			<table style='margin: 0 auto;'>
			<tr>
				<td>	
					<label for="c_number">Number</label>
				</td>
				<td>
					<input type="text" name="c_number" id="c_number" size='3' maxlength='3' class="text ui-widget-content ui-corner-all" />
				</td>
				<td id="c_score" class="buttonset" colspan="2">
						Score
						<input type="radio" id="c_score10" value="10" name="c_score" checked="checked" /><label for="c_score10">10</label>
						<input type="radio" id="c_score20" value="20" name="c_score" /><label for="c_score20">20</label>
						<input type="radio" id="c_score30" value="30" name="c_score" /><label for="c_score30">30</label>
						<input type="radio" id="c_score40" value="40" name="c_score" /><label for="c_score40">40</label>
						<input type="radio" id="c_score50" value="50" name="c_score" /><label for="c_score50">50</label>
				</td>
			</tr>
			<tr>
				<td>
					<label for="c_description">Description</label>
				</td>
				<td colspan="3">  	
					<input type="text" size='45' maxlength='255' value="" name="c_description" id="c_description" class="text ui-widget-content ui-corner-all" />			
				</td>
			</tr>
			</table>
		  </fieldset>
		</div>
		<div id="newcontroloutsidemap" title="Control outside map" style='display: none;'>
			<p>
				<span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 50px 0;"></span>
				New controls must be placed within the map area of the current sheet.
			</p>
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
		<div id="setracedescription" title="Race instructions" style='display: none;'>
		  <p class="validateTips"></p>
		  <fieldset>
			<table>
			<tr>
				<td>
					<label for="s_racedescription">Instructions</label>
				</td>
				<td>  	
					<input type="text" size='70' maxlength='255' value="" name="racedescription" id="s_racedescription" class="text ui-widget-content ui-corner-all" />			
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
		<div id="openplaques_searching" title="Searching" style='display: none;'>
			<table>
				<tr><td class="ui-icon ui-icon-info" style='margin: 0 7px 20px 0;'></td><td style='padding-bottom: 20px; vertical-align: top'>Retrieving local plaques from Open Plaques project at openplaques.org...</td></tr>
			</table>
		</div>
		<div id="openplaques_error" title="Plaques Error" style='display: none;'>
			<table>
				<tr><td class="ui-icon ui-icon-alert" style="margin: 0 7px 20px 0;"></td><td style='padding-bottom: 20px; vertical-align: top'>Unfortunately local plaques could not be retrieved. An error occurred.</td></tr>
				<tr><td class="ui-icon ui-icon-info" style="margin: 0 7px 20px 0;"></td><td style='padding-bottom: 20px; vertical-align: top' id='openplaques_error_text'></td></tr>
			</table>
		</div>
		<div id="cluesheet" title="Clue Sheet" style='display: none;'>
			<table id='cs_fillinbox'>
				<tr><td colspan='2'>Name</td><td>Club</td></tr>
				<tr><td>Start</td><td>Finish</td><td>Time</td></tr>
				<tr><td>Score</td><td>Penalty</td><td>Total</td></tr>
			</table>
			<div id='cs_title'></div>
			<div id='cs_raceinstructions'></div>
			<br style='clear: both;' />
			<table id='cs_controls'>
				<tr><th></th></tr>
			</table>
		</div>
		<div id="welcome" title="OpenOrienteeringMap: Global Edition">
			<h2>Welcome to OpenOrienteeringMap, the easy Street-O map creation tool.</h2>		 
			You can quickly and easily set a map, add controls, and create a print-ready, high quality vector PDF. If you have any comments, leave them at the end <a href="http://blog.oomap.co.uk/oom/#commentform">here</a>. 
			You can also <a href="http://blog.oomap.co.uk/oom/">find out more</a> about OpenOrienteeringMap, and keep an eye on <a href="http://blog.oomap.co.uk/">my blog</a> for news on updates.
			<br /><br />
			<img src="../images/orienteeringfoundation.png" style='width: 300px; height: 135px; margin: 0 213px;' alt="The Orienteering Foundation" />
			<div style='margin: 20px 0; font-size: 12px;'>Development for the current version was part-funded by a grant from <a href="https://www.orienteeringfoundation.org.uk/">The Orienteering Foundation</a>, more details about the new features are <a href="http://blog.oomap.co.uk/2017/10/openorienteeringmap-version-3/">here</a>. 
			OpenOrienteeringMap remains completely free. If you really want to, you could please <a href="http://www.amazon.co.uk/gp/registry/wishlist/2WLZDJ7S00ERD/ref=cm_wl_huc_view">buy me something</a>. Or <a href="http://www.amazon.co.uk/ref=as_sl_pc_wdgt_ex?&linkCode=wey&tag=yepsport-21">buy yourself something</a>. Thank you in advance!</i>
			</div>
			<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
			<!-- OpenOrienteeringMap LB -->
			<ins class="adsbygoogle"
				 style="display:inline-block;width:728px;height:90px"
				 data-ad-client="ca-pub-3486529756444295"
				 data-ad-slot="8518177961"></ins>
			<script>
			(adsbygoogle = window.adsbygoogle || []).push({});
			</script>			
			<div style='font-size: 12px; margin: 20px 0;'>OpenOrienteeringMap's data is obtained from <a href="http://osm.org/">OpenStreetMap</a>, &copy; OSM contributors. Contours (UK edition) are Crown Copyright &amp; Database Right Ordnance Survey 2014.
			</div>
		</div>			
	</body>
</html>
