var debug = false;

//Constants
var prefix1 = "http://tiler1.oobrien.com/";
var prefix2 = "http://tiler2.oobrien.com/";
var prefix3 = "http://tiler3.oobrien.com/";
var defaultMapTitle = "OpenOrienteeringMap";
var defaultRaceDescription = "Race instructions";

var currentID = null;
var currentNumber = null;
var topID = 0;
var topNumber = 1;

var mapTitle = defaultMapTitle;
var raceDescription = defaultRaceDescription;
var mapstyle;
var paper;
var scale;
var tips;

var controlsSF = [];
var controlsX = [];
var controls = [];

//OpenLayers single-instance objects
var map;
var layerMapnik;
var layerMapBorder;
var layerMapCentre;
var layerSF;
var layerX;
var layerControls;
var titleFeature;
var dragControl;
var sheetCentreLL = null;
var newControlLL = new OpenLayers.LonLat(0, 0);
var mapBound;

//State
//initialzoom, placepaper, addcontrols 
var state = "initialzoom";
var controloptstate = "add";
var style_suffix = "";
var pdf_suffix = "";

OpenLayers.Control.ControlsClick = OpenLayers.Class(OpenLayers.Control, {                
	defaultHandlerOptions: {
	    'single': true,
	    'double': false,
	    'pixelTolerance': 0,
	    'stopSingle': false,
	    'stopDouble': false
	},
	
	initialize: function(options) {
	    this.handlerOptions = OpenLayers.Util.extend(
	        {}, this.defaultHandlerOptions
	    );
	    OpenLayers.Control.prototype.initialize.apply(
	        this, arguments
	    ); 
	    this.handler = new OpenLayers.Handler.Click(
	        this, {
	            'click': this.trigger
	        }, this.handlerOptions
	    );
	}, 
	
	trigger: function(e) {
		handleClick(e);
	    //handleNewControlLocate(map.getLonLatFromViewPortPx(e.xy));
	}
});


var styleMap = new OpenLayers.StyleMap({ 
	pointRadius: 15, 
	fill: false, 
	stroke: true,
	strokeColor: "#ff00ff", 
	strokeWidth: 2, 
	label: "${label}",
	labelAlign: "cc",
	labelXOffset: "${xoff}",
	labelYOffset: "${yoff}",
	fontColor: "#ff00ff",
	fontFamily: "arial, verdana, sans-serif",
	fontSize: "24px",
	fontWeight: "bold"
});

var dotStyle = OpenLayers.Util.applyDefaults(
{ 
	pointRadius: 2, 
	fill: true, 
	stroke: false, 
	fillColor: "#ff00ff", 
	fillOpacity: 1 
}, OpenLayers.Feature.Vector.style["default"]);

var sfStyle = OpenLayers.Util.applyDefaults(
{
	pointRadius: 15, 
	fill: false, 
	stroke: true,
	strokeColor: "#ff00ff", 
	strokeWidth: 2, 
	label: "S/F",
	labelAlign: "cc",
	labelXOffset: 0,
	labelYOffset: 0,
	fontColor: "#ff00ff",
	fontFamily: "arial, verdana, sans-serif",
	fontSize: "15px",
	fontWeight: "bold"
}, OpenLayers.Feature.Vector.style["styleMap"]);

var sfStyleOuter = OpenLayers.Util.applyDefaults(
{
	pointRadius: 20, 
	fill: false, 
	strokeColor: "#ff00ff", 
	strokeWidth: 2 
}, OpenLayers.Feature.Vector.style["default"]);

var xStyle = OpenLayers.Util.applyDefaults(
{
	pointRadius: 1, 
	fill: false, 
	stroke: true,
	strokeColor: "#ff0000", 
	strokeWidth: 0.5, 
	label: "X",
	labelAlign: "cc",
	labelXOffset: 0,
	labelYOffset: 0,
	fontColor: "#ff0000",
	fontFamily: "arial, verdana, sans-serif",
	fontSize: "18px",
	fontWeight: "normal"
}, OpenLayers.Feature.Vector.style["styleMap"]);

var controlsClick  = new OpenLayers.Control.ControlsClick();

/* Initialisation */

function init() 
{
    map = new OpenLayers.Map ( 
    {
     	div: "map",
       	displayProjection: "EPSG:4326",
        projection: "EPSG:900913"
    });
    
    if (country == "ioa" || country == "global")
	{
	    map.addControl( new OpenLayers.Control.Attribution("OpenStreetMap"));	
	}
	else
	{
	    map.addControl( new OpenLayers.Control.Attribution("OpenStreetMap, Ordnance Survey"));	
	}
	if (country == "ioa" || country == "bof")
	{
 		map.setOptions({restrictedExtent: new OpenLayers.Bounds(-12, 47, 8, 63).transform("EPSG:4326", "EPSG:900913")});
	}


    if (debug)
    {
		map.addControl( new OpenLayers.Control.Permalink());
    }
    map.addControl(new OpenLayers.Control.ScaleLine({geodesic: true}));
   
    if (country =="global")
    {
	pdf_suffix = "_global";
	style_suffix = "_global";
    }
    if (country == "ioa")
    {
	pdf_suffix = "_ioa";
	style_suffix = "";
    }
 
    layerMapnik = new OpenLayers.Layer.OSM("mapnik", null, 
    	{ numZoomLevels: 16, isBaseLayer: true, attribution: "" });
	var layerStreetO = new OpenLayers.Layer.OSM("streeto", [prefix1 + "streeto" + style_suffix + "/${z}/${x}/${y}.png", prefix2 + "streeto" + style_suffix + "/${z}/${x}/${y}.png", prefix3 + "streeto" + style_suffix + "/${z}/${x}/${y}.png"],
		{numZoomLevels: 18, isBaseLayer: true, attribution: "", tileOptions: {crossOriginKeyword: null}});
	var layerStreetONoRail = new OpenLayers.Layer.OSM("streeto_norail", [prefix1 + "streeto_norail" + style_suffix + "/${z}/${x}/${y}.png", prefix2 + "streeto_norail" + style_suffix + "/${z}/${x}/${y}.png", prefix3 + "streeto_norail" + style_suffix + "/${z}/${x}/${y}.png"],
		{numZoomLevels: 18, isBaseLayer: true, attribution: "", tileOptions: {crossOriginKeyword: null}});
	var layerOTerrain = new OpenLayers.Layer.OSM("oterrain", [prefix1 + "oterrain" + style_suffix + "/${z}/${x}/${y}.png", prefix2 + "oterrain" + style_suffix + "/${z}/${x}/${y}.png", prefix3 + "oterrain" + style_suffix + "/${z}/${x}/${y}.png"],
		{numZoomLevels: 18, isBaseLayer: true, attribution: "", tileOptions: {crossOriginKeyword: null}});
	var layerUrbanSkeleton = new OpenLayers.Layer.OSM("urban_skeleton", [prefix1 + "urban_skeleton" + "/${z}/${x}/${y}.png", prefix2 + "urban_skeleton" + "/${z}/${x}/${y}.png", prefix3 + "urban_skeleton" + "/${z}/${x}/${y}.png"],
		{numZoomLevels: 18, isBaseLayer: true, attribution: "", tileOptions: {crossOriginKeyword: null}});
	var layerBlueprint = new OpenLayers.Layer.OSM("blueprint", [prefix1 + "blueprint" + "/${z}/${x}/${y}.png", prefix2 + "blueprint" + "/${z}/${x}/${y}.png", prefix3 + "blueprint" + "/${z}/${x}/${y}.png"],
		{numZoomLevels: 18, isBaseLayer: true, attribution: "", tileOptions: {crossOriginKeyword: null}});


	layerMapBorder = new OpenLayers.Layer.Vector("mapborder");
	layerMapCentre = new OpenLayers.Layer.Vector("mapcentre");
	layerSF = new OpenLayers.Layer.Vector("controlsSF", {styleMap: styleMap});
	layerX = new OpenLayers.Layer.Vector("controlsX", {styleMap: styleMap});
	layerControls = new OpenLayers.Layer.Vector("controls", {styleMap: styleMap});
	
    map.addLayers([layerStreetO, layerStreetONoRail, layerOTerrain, layerBlueprint, layerMapnik, 
    	layerMapBorder, layerMapCentre, layerSF, layerX, layerControls]);

	map.setBaseLayer(layerMapnik);

	if (map.getZoom() == 0)
	{	
		if (country == "ioa")
		{
	 		map.setCenter(new OpenLayers.LonLat(-8.3, 52.88).transform("EPSG:4326", "EPSG:900913"), 8);
		
		}
		else if (country == "bof")
		{
	 		map.setCenter(new OpenLayers.LonLat(-0.92, 51.78).transform("EPSG:4326", "EPSG:900913"), 8);
		}
		else
		{
			map.setCenter(new OpenLayers.LonLat(-0.13599, 51.52194).transform("EPSG:4326", "EPSG:900913"), 4);
		}
	}
	
	dragControl = new OpenLayers.Control.DragFeature(layerMapCentre, { 
		onComplete: function(feature, pixel) { 
			dragControl.deactivate();
			sheetCentreLL = new OpenLayers.LonLat(feature.geometry.getCentroid().x, feature.geometry.getCentroid().y);
			rebuildMapSheet();
		} 
	});
	map.addControl(dragControl);
	dragControl.activate();
	
	map.addControl(controlsClick);
	controlsClick.activate();

	map.events.register("zoomend", null, function(e) { handleZoom(); });

	$( "#mapstyle" ).buttonset();
			
	$( "#mapscale" ).buttonset();
	$( "#papersize" ).buttonset();
	$( "#paperorientation" ).buttonset();

	$("#portrait").button( { icons: {primary:'ui-icon-document'} } );
	$("#landscape").button( { icons: {primary:'ui-icon-document-b'} } );

	$( "#c_type" ).buttonset();
	$( "#c_score" ).buttonset();

	$( "#mapstyle input[type=radio]" ).change(handleZoom);
	$( "#mapscale input[type=radio]" ).change(handleOptionChange);
	$( "#papersize input[type=radio]" ).change(handleOptionChange);
	$( "#paperorientation input[type=radio]" ).change(handleOptionChange);
	$( "#c_type input[type=radio]" ).change(handleControlTypeChange);

	$( "#createmap" ).button({ icons: { primary: "ui-icon-disk" } }).click(function() { handleGenerateMap(); });
	$( "#createclue" ).button().click(function() { handleGenerateClue(); });
	$( "#deletesheet" ).button({ icons: { primary: "ui-icon-trash" } }).click(function() { handleDeleteSheet(); });
	$( "#deleteXs" ).button({ icons: { primary: "ui-icon-trash" } }).click(function() { handleDeleteXs(); });
	$( "#getPostboxes" ).button({ icons: { primary: "ui-icon-pin-s" } }).click(function() { handleGetPostboxes(); });
	$( "#getOpenplaques" ).button({ icons: { primary: "ui-icon-pin-s" } }).click(function() { handleGetOpenplaques(); });


	$( "#createmap" ).button("disable");
	$( "#createclue" ).button("disable");
	$( "#deletesheet" ).button("disable");
	$( "#deleteXs" ).button("disable");
	$( "#getPostboxes" ).button("disable");
	$( "#getPlaques" ).button("disable");

	$( "#edittitle" ).click(function() { handleTitleEdit(); })	
	$( "#editinstructions" ).click(function() { handleRaceDescriptionEdit(); }) 

    tips = $( ".validateTips" );	

	handleZoom();	
	initDescriptions();
	if(!!document.createElement('canvas').getContext)	
	{
		$( ".knob" ).knob({
		'width':65,
		'fgColor':"#222222",
		'cursor':30,
		'thickness':0.3,
		'min':0,
		'max':360,
		'height':65,
		'release' : function (v) { }
		});		    
	}
	var c_number = $( "#c_number" ),
      allFields = $( [] ).add( c_number );
      
    function checkNumber( o, n, type ) 
    {
    	if (type == "c_startfinish" || type == "c_cross")
    	{
    		return true;
    	}
    
		if (o.val() == null || o.val().length < 1)
		{
			o.addClass( "ui-state-error" );
			updateTips( "You must enter a number." );
			return false;      		
		}     
		for(var i = 0; i < controls.length; i++)
		{
			if (o.val() == controls[i].number && o.val() != currentNumber)
			{
				o.addClass( "ui-state-error" );
				updateTips( "This number has already been used." );
				return false;
			}
		}
		return true;
	}
           
	$( "#newcontroloptions" ).dialog({
	  autoOpen: false,
	  height: 350,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  var bValid = true;
		  allFields.removeClass( "ui-state-error" );

		  bValid = bValid && checkNumber( c_number, "Number", $("#c_type :radio:checked").attr("id"));

		  if ( bValid ) {
		  	var control = new Object();
		  	
		  	control.id = topID++;
		  	
		  	control.number = c_number.val();
			if (!isNaN(parseInt(control.number))) 
			{
				control.number = parseInt(control.number);
				if (control.number > topNumber) 
				{ 
					topNumber = control.number; 
				} 
			}  	
		  	
		  	control.angle = $("#c_angle").val();
			control.angle = parseInt(control.angle);	

			control.score = $("#c_score :radio:checked").val();
			control.score = parseInt(control.score);	
			//control.score_id = $("#c_score :radio:checked").attr("id");

			control.type = $("#c_type :radio:checked").attr("id");

			control.description = $("#c_description").val();

			control.lat = newControlLL.lat; 
			control.lon = newControlLL.lon;

			control.wgs84lat = newControlLL.clone().transform("EPSG:900913", "EPSG:4326").lat;
			control.wgs84lon = newControlLL.clone().transform("EPSG:900913", "EPSG:4326").lon;
			
			if (control.type == "c_startfinish") 
			{	
				control.score = 0;

				//Delete any existing S/F control	
				controlsSF = [];
				controlsSF.push(control);	
  			}
  			else if (control.type == "c_cross")
  			{
  				if (controloptstate == "new")
  				{
  					controlsX.push(control);	  			
				}
				else if (controloptstate == "edit")
				{
					for (var i = 0; i < controlsX.length; i++)
					{
						if (currentID == controlsX[i].id)
						{
							controlsX[i] = control;
						} 
					}
				}
  			}
  			else
  			{
  				if (controloptstate == "new")
  				{
  					controls.push(control);	  			
				}
				else if (controloptstate == "edit")
				{
					for (var i = 0; i < controls.length; i++)
					{
						if (currentID == controls[i].id)
						{
							controls[i] = control;
						} 
					}
				}
  			}
		  	rebuildMapControls();
		  	rebuildDescriptions();
		  		  
			$( this ).dialog( "close" );
		  }
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	
	$( "#setmaptitle" ).dialog({
	  autoOpen: false,
	  height: 350,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  
		    mapTitle = $("#s_maptitle").val();		  	
		  	initDescriptions();
	  		if (state == "addcontrols" || state == "zoom")
			{
				rebuildMapSheet();	
			}			
		  		  
			$( this ).dialog( "close" );
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	
	$( "#setracedescription" ).dialog({
	  autoOpen: false,
	  height: 350,
	  width: 700,
	  modal: true,
	  buttons: {
		OK: function() {
		  
		    raceDescription = $("#s_racedescription").val();		  	
		  	initDescriptions();		  		  
			$( this ).dialog( "close" );
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	
	$( "#saving" ).dialog({
	  autoOpen: false,
	  height: 140,
	  modal: true
	});
	$( "#saveerror" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		"Create anyway": function() {
		  
			generateMap();
			$( this ).dialog( "close" );
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#validationerror" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		"Save and create anyway": function() {
			saveMap();
			$( this ).dialog( "close" );
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#generating" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#loaderror" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});	
	$( "#postcode_searching" ).dialog({
	  autoOpen: false,
	  height: 140,
	  modal: true
	});
	$( "#postcode_error" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});	
	$( "#postboxes_searching" ).dialog({
	  autoOpen: false,
	  height: 140,
	  modal: true
	});
	$( "#postboxes_error" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});	
	$( "#openplaques_searching" ).dialog({
	  autoOpen: false,
	  height: 140,
	  modal: true
	});
	$( "#openplaques_error" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});	
	$( "#cluesheet" ).dialog({
	  autoOpen: false,
	  height: 700,
	  width: 900,
	  modal: true,
	  buttons: {
		"Print clue sheet": function() {		  
			$(this).jqprint();
		},
		Close: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	
	$("#search").submit(function() { handleSearchPostcode(); return false });
	$("#load").submit(function() { handleLoadMap(); return false; });
	
	$( "#searchButton" ).button().css('font-size', 10);
	$( "#loadButton" ).button().css('font-size', 10);
	
	//Handle loading in a map with ID.
	if (location.search.length > 0)
	{
		var shortcode = (location.search.match(new RegExp('map' + "=(.*?)($|\&)", "i")) || [])[1]
		if (shortcode !== undefined)
		{
			$.post('load.php', {"shortcode":shortcode}, handleLoadCallback);
		}
	}
	
}

function updateTips( t ) {
  tips
	.text( t )
	.addClass( "ui-state-highlight" );
  setTimeout(function() {
	tips.removeClass( "ui-state-highlight", 1500 );
  }, 500 );
}

/* Resetting and reinitialisation */

function initDescriptions()
{
	$( ".edit").button({ icons: { primary: "ui-icon-pencil" }, text: false });		    
	$( ".delete").button({ icons: { primary: "ui-icon-trash" }, text: false });	
	
	$("#maptitle").text(mapTitle);
	$("#racedescription").text(raceDescription);
}

function resetControlAddDialog(pid)
{
	$("#c_angle").trigger('configure', { "readOnly":false });
	$("#c_score input[type=radio]").button("enable");
	$("#c_number").removeAttr('disabled');
	$("#c_description").removeAttr('disabled');

	$('[for=c_regular]').click(); //Overlying label
	$("#c_regular").click(); //Underlying button
	
	if (pid != null)
	{
		var control;
		for (var i = 0; i < controls.length; i++)
		{
			if (controls[i].id == parseInt(pid.substring(1)))
			{
				control = controls[i];
				break;
			}
		}
		$("#c_angle").val(control.angle).trigger('change');

		$('[for=c_score' + control.score + ']').click(); //Overlying label
		$("#c_score" + control.score).click(); //Underlying button
		$("#c_number").val(control.number);
		$("#c_description").val(control.description);
		
		newControlLL.lat = control.lat;
		newControlLL.lon = control.lon;		
	}
	else
	{		
		$("#c_angle").val(45).trigger('change');
		//$("#c_score").val(10); //Don't change this - useful to keep current value.
		$("#c_number").val("");
		$("#c_description").val("");
	}
}

/* Deal with user actions */

function handleControlTypeChange()
{
	var type = $("#c_type :radio:checked").attr("id");
	if (type == "c_startfinish" || type == "c_cross")
	{
		$("#c_angle").val(45).trigger('change');
		//$("#c_score").val(10); //Don't change this - useful to keep current value.
		$("#c_number").val("");
		$("#c_description").val("");

		$("#c_angle").trigger('configure', { "readOnly":true });
		$("#c_score input[type=radio]").button("disable");
		$("#c_number").attr('disabled','disabled');
		$("#c_description").attr('disabled','disabled');
	}
	else
	{
		$("#c_angle").trigger('configure', { "readOnly":false });
		$("#c_score input[type=radio]").button("enable");
		$("#c_number").removeAttr('disabled');
		$("#c_description").removeAttr('disabled');

	}
}

function handleZoom()
{
	if (!map)
	{
		return;
	}
	
	$( "#createmap" ).button("disable");
	$( "#deletesheet" ).button("disable");
	$( "#deleteXs" ).button("disable");
	$( "#getPostboxes" ).button("disable");	
	$( "#getOpenplaques" ).button("disable");	

	if (controlsX.length > 0)
	{
		$( "#deleteXs" ).button("enable");
	}
	
	if (map.getZoom() < 12)
	{
		if (state == "placepaper")
		{
			state = "initialzoom";
			$("#messageCentre").hide();
			$("#messageZoom").show("pulsate", {}, 500);
		}
		else if (state == "addcontrols")
		{
			state = "zoom";
			$("#messageAdd").hide();
			$("#messageZoom").show("pulsate", {}, 500);
			rebuildMapSheet();
		}		
		map.setBaseLayer(layerMapnik);
	}
	else
	{
		if (state == "initialzoom")
		{
			state = "placepaper";
			$("#messageZoom").hide();
			$("#messageAdd").hide();
			$("#messageCentre").show("pulsate", {}, 500);					
		}
		else if (state == "zoom")
		{
			state = "addcontrols";
			$("#messageZoom").hide();
			$("#messageCentre").hide();
			$("#messageAdd").show("pulsate", {}, 500);	
			rebuildMapSheet();		
		}
		else if (state == "addcontrols")
		{
			$("#messageCentre").hide();
			rebuildMapSheet();		
		}
		
		mapstyle = $("#mapstyle :radio:checked").attr("id"); 
		if (country == "ioa")
		{
			var pos = mapstyle.indexOf("_ioa");
			mapstyle = mapstyle.substring(0, pos);
		}
		if (country == "global")
		{
            var pos = mapstyle.indexOf("_global");
            if (pos > 0)
            {
            	mapstyle = mapstyle.substring(0, pos);
			}
		}
		map.setBaseLayer(map.getLayersByName(mapstyle)[0]);		
	}
	
	if (map.getZoom() < 7 && country != "global")
	{
		map.setCenter(map.getCenter(), 7);
	}	
}

function handleControlEditOptions(pid)
{
			controloptstate = "edit";
			currentID = parseInt(pid.substring(1));
			currentNumber = null;
			for (var i = 0; i < controls.length; i++)
			{
				var control = controls[i];
				if (control.id == currentID)
				{
					currentNumber = control.number;
					newControlLL.lat = control.lat;
					newControlLL.lon = control.lon;		
					break;
				}	
			}	
			for (var i = 0; i < controlsX.length; i++)
			{
				var control = controlsX[i];
				if (control.id == currentID)
				{
					currentNumber = control.number;
					newControlLL.lat = control.lat;
					newControlLL.lon = control.lon;		
					break;
				}	
			}	
			$( "#newcontroloptions" ).dialog( "open" );
			resetControlAddDialog(pid);
}

function handleControlDelete(pid)
{

	currentID = parseInt(pid.substring(1));
	for (var i = 0; i < controls.length; i++)
	{
		if (currentID == controls[i].id)
		{
			controls.splice(i, 1);
			break;
		} 
	}
	for (var i = 0; i < controlsX.length; i++)
	{	
		if (currentID == controlsX[i].id)
		{
			controlsX.splice(i, 1);
			break;
		} 

	}
	
	rebuildMapControls();
	rebuildDescriptions();
}

function handleDeleteSheet()
{
	layerMapBorder.destroyFeatures();
	layerMapCentre.destroyFeatures();
	controls = [];
	controlsSF = [];
	
	topID = 0;
	topNumber = 1;
	
	rebuildMapControls();
	rebuildDescriptions();
	state = "initialzoom";
	handleZoom();
	$( "#deletesheet" ).button("disable");
	$( "#getPostboxes" ).button("disable");	
	$( "#getOpenplaques" ).button("disable");	
}

function handleDeleteXs()
{
	controlsX = []; 
	rebuildMapControls();
	$( "#deleteXs" ).button("disable");

}

function handleTitleEdit()
{
	$( "#setmaptitle" ).dialog( "open" );
	$("#s_maptitle").val(mapTitle);
	updateTips("Tip: Long titles will be reduced in size when creating sheet.");
}

function handleRaceDescriptionEdit()
{
	$( "#setracedescription" ).dialog( "open" );
	$("#s_racedescription").val(raceDescription);
	updateTips("Tip: The race instructions will appear at the top of the clue sheet.");
}

function handleLoadMap()
{
	var shortcode = $("#savedMapID").val();
	$.post('load.php', {"shortcode":shortcode}, handleLoadCallback);
}

function handleGenerateMap()
{
	$("#saved_mapid").html("");
	$("#saveerror_text").html("");
	$("#validationerror_text").html("");
	
	if (validate())
	{
		saveMap();
	}
}	

function validate()
{
	var validationMsg = "";

	if (mapTitle == defaultMapTitle)
	{
		validationMsg += "Map title not changed from default.<br />";
	} 
	if (raceDescription == defaultRaceDescription)
	{
		validationMsg += "Race instructions not changed from default.<br />";
	} 

	var currScore = 0;
	for (var i = 0; i < controls.length; i++)
	{
		var control = controls[i];
		if (control.score < currScore)
		{
			validationMsg += "One or more controls with higher number but lower score.<br />";			
			break;
		}
		currScore = control.score;
	}

	var controlNumbers = [];
	for (var i = 0; i < controls.length; i++)
	{
		var control = controls[i];
		if ($.inArray(control.number, controlNumbers) > -1 && control.type != "c_startfinish" && control.type != "c_cross")
		{		
			validationMsg += "Two or more controls have the same number.<br />";	
			if (debug)
			{
				console.log(controlNumbers);		
				console.log(control.number);
			}
			break;
		}
		controlNumbers.push(control.number);
	}
		
	if (validationMsg != "")
	{
		$( "#validationerror" ).dialog( "open" );	
		$("#validationerror_text").html(validationMsg);	
		return false;
	}
	else
	{
		return true;
	}
}

function handleSaveCallback(json)
{
	$( "#saving" ).dialog( "close" );
	var result = JSON.parse(json);
	if (result.success)
	{
		$( "#generating" ).dialog( "open" );
		$("#saved_mapid").html("The map # is " + result.message + ". Note this code down now if you wish to reload the map in the future!");
		if (debug)
		{
			console.log(result.data); 
		}
		generateMap();
	}	
	else
	{
		$( "#saveerror" ).dialog( "open" );
		$( "#saveerror_text" ).html(result.message);
	}
}

function handleLoadCallback(json)
{
	$("#loaderror_text").html("");
	
	var result = JSON.parse(json);
	if (result.success)
	{
		if (debug)
		{
			console.log(result.data); 
		}
		loadMap(result.data);
	}	
	else
	{
		$( "#loaderror" ).dialog( "open" );
		$( "#loaderror_text" ).html(result.message);
	}
}
	
function handleGenerateClue()
{
	//TODO Do warning that this action does not save - person needs to press Create Map Sheet. 
	$( "#cluesheet" ).dialog( "open" );

	$("#cs_title").html(mapTitle);
	$("#cs_raceinstructions").html(raceDescription);
	
	$("#cs_controls tr").remove();
	
	$("#cs_controls").find('tbody')
		.append($('<tr>')
			.append($('<th>').append('No'))
			.append($('<th>').append('Score'))
			.append($('<th>').append('Description'))
			.append($('<th>').append('Answer'))
		);

	var currentScore = 0;
	var emphasise = false;
	for (var i = 0; i < controls.length; i++)
	{
		var control  = controls[i];
		if (currentScore != control.score && currentScore != 0)
		{
			emphasise = true;
		}
		else
		{
			emphasise = false;		
		}
		currentScore = control.score;
		
		if (emphasise)
		{
			$("#cs_controls").find('tbody')
				.append($('<tr>').addClass('cs_spacer')
					.append($('<td>')
						.append(control.number).css('width', '50').css('fontWeight', 'bold')
					  )
					.append($('<td>')
						.append(control.score).css('width', '50')
					  )
					.append($('<td>')
						.append(control.description).css('textAlign', 'left')
					  )    
					.append($('<td>').css('width', '100')
					  )    
				);		
		}
		else
		{
			$("#cs_controls").find('tbody')
				.append($('<tr>')
					.append($('<td>')
						.append(control.number).css('width', '50').css('fontWeight', 'bold')
					  )
					.append($('<td>')
						.append(control.score).css('width', '50')
					  )
					.append($('<td>')
						.append(control.description).css('textAlign', 'left')
					  )    
					.append($('<td>').css('width', '100')
					  )    
				);
		}
	}
}

//TODOs
//About/Comments/attribution links.

//Missing features from this version:
//Label overlay
//Aerial imagery overlay
//lat/lon jump.

function handleOptionChange()
{
	//console.log(state);
	if (state == "initialzoom")
	{
		$("#messageZoom").effect("pulsate", {}, 500);
		return;
	}
	if (state == "addcontrols" || state == "zoom")
	{
		rebuildMapSheet();	
		return;
	}			
}

function handleClick(e)
{
	//console.log(state);
	if (state == "addcontrols")
	{
		newControlLL = map.getLonLatFromViewPortPx(e.xy);
		if (!mapBound.containsLonLat(newControlLL))
		{
			$( "#newcontroloutsidemap" ).dialog({
			  modal: true,
			  buttons: {
				Ok: function() {
				  $( this ).dialog( "close" );
				}
			  }
			});
		}
		else
		{
			controloptstate = "new";
			$( "#newcontroloptions" ).dialog( "open" );
			resetControlAddDialog(null);
		}
		return;
	}
			
	if (state == "initialzoom" || state == "zoom")
	{
		$("#messageZoom").effect("pulsate", {}, 500);
		return;
	}
	
	if (state == "placepaper")
	{
		sheetCentreLL = map.getLonLatFromViewPortPx(e.xy);
		rebuildMapSheet();	
		state = "addcontrols";
		$("#messageCentre").hide();
		$("#messageAdd").effect("pulsate", {}, 500);
	}
}

/* Actions */

function saveMap()
{
	var controlsForDB = controls.concat(controlsSF).concat(controlsX);

	var json = {"data":{
		"action": "savemap",
		"title": mapTitle,
		"race_instructions": raceDescription,
		"style": mapstyle, 
		"scale": $("#mapscale :radio:checked").attr("id"), 
		"papersize": $("#papersize :radio:checked").attr("id"), 
		"paperorientation": $("#paperorientation :radio:checked").attr("id"), 
		"centre_lat": sheetCentreLL.lat,
		"centre_lon": sheetCentreLL.lon,
		"centre_wgs84lat": sheetCentreLL.clone().transform("EPSG:900913", "EPSG:4326").lat,
		"centre_wgs84lon": sheetCentreLL.clone().transform("EPSG:900913", "EPSG:4326").lon,
		"controls": controlsForDB
	}};

	$.post('save.php', json, handleSaveCallback);
	$( "#saving" ).dialog( "open" );
}
	
function generateMap()
{
	//Construct the URL to the PDF.
	var escapeTitleText = escape(mapTitle);

	var startText = ""
	var xText = "";
	if (controlsSF.length > 0)
	{
		startText = controlsSF[0].lat.toFixed(0) + "," + controlsSF[0].lon.toFixed(0);
	}
	if (controlsX.length > 0)
	{
		for (var i = 0; i < controlsX.length; i++)
		{
			var control = controlsX[i]
			xText += control.lat.toFixed(0) + "," + control.lon.toFixed(0) + ",";
		}
		xText  = xText.substring(0, xText.length - 1);
	}
	
	if (mapstyle == "blueprint" || mapstyle == "urban_skeleton")
	{
		pdf_suffix = "";
	}
	
	url = prefix1 + "pdf"
		+ "/?style=" + mapstyle 
		+ pdf_suffix 
   		+ "|paper=" + paper 
		+ "|scale=" + scale 
		+ "|centre=" + sheetCentreLL.lat.toFixed(0) + "," + sheetCentreLL.lon.toFixed(0)
		+ "|title=" + escapeTitleText
		+ "|start=" + startText
		+ "|crosses=" + xText
		+ "|controls=";
		
	if (controls.length > 0)
	{
		for (var i = 0; i < controls.length; i++)
		{
			var control = controls[i]
			url += control.number + "," + control.angle + "," + control.lat.toFixed(0) + "," + control.lon.toFixed(0) + ",";
		}
		url  = url.substring(0, url.length - 1);
	}
	//url += "|id=" + id; //TODO Add the shortcode in here.
	
	if (debug)
	{
		console.log(url);
	}
	self.location=url;	
}

function loadMap(data)
{
	state = "zoom";

	mapTitle = data.title;
	raceDescription = data.race_instructions;
	var $style = $("#" + data.style);
	var $styleL = $("[for=" + data.style + "]");
	var $scale = $("#" + data.scale);
	var $scaleL = $("[for=" + data.scale + "]");
	var $papersize = $("#" + data.papersize);
	var $papersizeL = $("[for=" + data.papersize + "]");
	var $paperorientation = $("#" + data.paperorientation);
	var $paperorientationL = $("[for=" + data.paperorientation + "]");

	$style.click();
	$styleL.click();
	$scale.click();
	$scaleL.click();
	$papersize.click();
	$papersizeL.click();
	$paperorientation.click();
	$paperorientationL.click(); 

	sheetCentreLL = new OpenLayers.LonLat(data.centre_lon, data.centre_lat).transform("EPSG:4326", "EPSG:900913");
	if (data.scale == "s7500" || data.scale == "s5000" || data.scale == "s4000")
	{
		map.setCenter(sheetCentreLL, 15);
	}
	else
	{
		map.setCenter(sheetCentreLL, 14);	
	}
	if (debug)
	{
		console.log(sheetCentreLL);
	}
	controlsSF = [];
	controlsX = [];
	controls = [];

	for (var i = 0; i < data.controls.length; i++)
	{
		var control = data.controls[i];
		control.id = topID++;		
		if (!isNaN(parseInt(control.number))) 
		{ 
			control.number = parseInt(control.number); 
			if (control.number > topNumber)
			{
				topNumber = control.number;
			}
		}  			
		control.angle = parseInt(control.angle);	
		control.score = parseInt(control.score);
		var controlLL = new OpenLayers.LonLat(control.wgs84lon, control.wgs84lat).transform("EPSG:4326", "EPSG:900913");
		control.lat = controlLL.lat;
		control.lon = controlLL.lon;

		if (control.type == "c_startfinish")
		{
			controlsSF.push(control);
		}
		else if (control.type == "c_cross")
		{
			controlsX.push(control);
		}
		else
		{
			controls.push(control);
		}
	}

	handleZoom();	
	rebuildMapControls();
}

function rebuildMapSheet()
{
	//console.log("rebuildMapSheet");
	if (!sheetCentreLL)
	{
		sheetCentreLL = map.getCenter();
	}
	
	layerMapBorder.destroyFeatures();
	layerMapCentre.destroyFeatures();

	var papersize = "";
	var paper_pieces = [];

	papersize = $("#papersize :radio:checked").attr("id");

	if ($("#portrait").prop('checked')) {  paper_pieces[0] = 0.0001 * papersize.substring(6); paper_pieces[1] = 0.0001 * papersize.substring(1, 5); }
	else { paper_pieces[0] = 0.0001 * papersize.substring(1, 5); paper_pieces[1] = 0.0001 * papersize.substring(6); }
	paper = paper_pieces[0] + "," + paper_pieces[1];
		
	scale = -1;
	
	scale = $("#mapscale :radio:checked").val();
	scale = parseInt(scale);
		
	var centroidllWGS84 = sheetCentreLL.clone().transform("EPSG:900913", "EPSG:4326");
	var fudgeFactor = Math.cos(centroidllWGS84.lat * Math.PI/180);
	var trueScale = scale / fudgeFactor;
	//console.log("True scale is " + trueScale);

	var paper_dlon = paper_pieces[0] * trueScale;
	var paper_dlat = paper_pieces[1] * trueScale;

	var map_nm_dlat = 0.014 * trueScale; 
	var map_em_dlon = 0.008 * trueScale; 
	var map_sm_dlat = 0.013 * trueScale;
	var map_wm_dlon = 0.008 * trueScale;

	var map_dlon = (paper_dlon - map_wm_dlon) - map_em_dlon
	var map_dlat = (paper_dlat - map_nm_dlat) - map_sm_dlat

	mapBound = new OpenLayers.Bounds(sheetCentreLL.lon-map_dlon/2, sheetCentreLL.lat-map_dlat/2, sheetCentreLL.lon+map_dlon/2, sheetCentreLL.lat+map_dlat/2);
	var paperBound = new OpenLayers.Bounds(
	(sheetCentreLL.lon - map_dlon/2) - map_wm_dlon, 			
	(sheetCentreLL.lat - map_dlat/2) - map_sm_dlat, 			
	(sheetCentreLL.lon + map_dlon/2) + map_em_dlon, 			
	(sheetCentreLL.lat + map_dlat/2) + map_nm_dlat);
	var paperWMBound = new OpenLayers.Bounds(	paperBound.left,	mapBound.bottom, 	mapBound.left,		mapBound.top);
	var paperEMBound = new OpenLayers.Bounds(	mapBound.right,		mapBound.bottom, 	paperBound.right,	mapBound.top);
	var paperNMBound = new OpenLayers.Bounds(	paperBound.left, 	mapBound.top,		paperBound.right, 	paperBound.top);
	var paperSMBound = new OpenLayers.Bounds(	paperBound.left, 	paperBound.bottom, 	paperBound.right, 	mapBound.bottom);

	var marginStyle = OpenLayers.Util.applyDefaults({ fill: true, fillOpacity: 1, fillColor: '#ffffff', strokeColor: '#ffffff'}, OpenLayers.Feature.Vector.style["default"]);
	var sheetStyle = OpenLayers.Util.applyDefaults({ fill: false, strokeWidth: 1, strokeColor: '#000000'}, OpenLayers.Feature.Vector.style["default"]);
	var contentStyle = OpenLayers.Util.applyDefaults({ strokeColor: '#ffffff', fillColor: '#cccccc' }, OpenLayers.Feature.Vector.style["default"]);
	var adornmentStyle = OpenLayers.Util.applyDefaults({ fill: false, stroke:false }, OpenLayers.Feature.Vector.style["default"]);
	var centreStyle = OpenLayers.Util.applyDefaults({ fillColor: '#0000ff', strokeColor: '#0000ff', pointRadius: 5 }, OpenLayers.Feature.Vector.style["default"]);

	var sheet = new OpenLayers.Feature.Vector(paperBound.toGeometry(), {}, sheetStyle);
	var content = new OpenLayers.Feature.Vector(mapBound.toGeometry(), {}, contentStyle);
	var westMargin = new OpenLayers.Feature.Vector(paperWMBound.toGeometry(), {}, marginStyle);
	var eastMargin = new OpenLayers.Feature.Vector(paperEMBound.toGeometry(), {}, marginStyle);
	var northMargin = new OpenLayers.Feature.Vector(paperNMBound.toGeometry(), {}, marginStyle);
	var southMargin = new OpenLayers.Feature.Vector(paperSMBound.toGeometry(), {}, marginStyle);	
	var centreMarker = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(sheetCentreLL.lon, sheetCentreLL.lat), {}, centreStyle);

	var titleFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(mapBound.left, mapBound.top + (0.002 * trueScale)), {}, adornmentStyle);

	var titleSizeArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5, 10, 20, 40, 80, 160, 320];
	var fontSizeFromArr = (titleSizeArr[map.getZoom()]*(scale/10000)).toFixed(0);
	var titleStyle = OpenLayers.Util.applyDefaults(
		{ 
			fill: false,
			stroke: false,
			label: mapTitle.toUpperCase(),
			labelAlign: "lb",
			fontColor: "#000000",
			fontFamily: "arial, verdana, sans-serif",
			fontSize: fontSizeFromArr,
			fontWeight: "normal",
			fontStyle: "italic"
		}, OpenLayers.Feature.Vector.style["default"]);
	titleFeature.style = titleStyle;

	layerMapBorder.addFeatures([content, westMargin, eastMargin, northMargin, southMargin, sheet, titleFeature]);
	layerMapCentre.addFeatures([centreMarker]);

	dragControl.activate();
	rebuildDescriptions();

	$( "#createmap" ).button("enable");
	$( "#deletesheet" ).button("enable");
	$( "#getPostboxes" ).button("enable");	
	$( "#getOpenplaques" ).button("enable");
}

function rebuildMapControls()
{
	layerSF.destroyFeatures();
	layerControls.destroyFeatures();
	layerX.destroyFeatures();
	
	for (var i = 0; i < controlsSF.length; i++)
	{
		var control = controlsSF[i];
	
		var controlSF = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(control.lon, control.lat), {}, sfStyle);
		var controlSFOuter = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(control.lon, control.lat), {}, sfStyleOuter);

		layerSF.addFeatures([controlSF, controlSFOuter]);
	}

	for (var i = 0; i < controlsX.length; i++)
	{
		var control = controlsX[i];
	
		var controlX = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(control.lon, control.lat), {}, xStyle);
		layerX.addFeatures([controlX]);
	}

	
	for (var i = 0; i < controls.length; i++)
	{
		var control = controls[i];
	
		var controlPoint = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(control.lon, control.lat));
		controlPoint.attributes.label = control.number; 
		controlPoint.attributes.number = control.number; 
		controlPoint.attributes.xoff = 35 * Math.sin((control.angle*Math.PI)/180)
		controlPoint.attributes.yoff = 35 * Math.cos((control.angle*Math.PI)/180)

		var controlDot = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(control.lon, control.lat), {}, dotStyle);	

		layerControls.addFeatures([controlPoint, controlDot]);		
	}
	
	if (controlsX.length > 0)
	{
		$( "#deleteXs" ).button("enable");
	}
	
	if (controls.length > 0)
	{
		$( "#createclue" ).button("enable");
	}
	else
	{
		$( "#createclue" ).button("disable");		
		$( "#getPostboxes" ).button("enable");	
		$( "#getOpenplaques" ).button("enable");	
	}	
}

function rebuildDescriptions()
{
	$("#controldescriptions tr.controlrow").remove();
	
	controls.sort(function(a, b) 
	{
		if (isNaN(a.number - b.number))
		{
			return a.number < b.number ? -1 : 1;
		}
		return a.number - b.number;
	});
	
	var controlnum = controls.length;
	var maxscore = 0;	

	for (var i = 0; i < controls.length; i++)
	{
		maxscore += controls[i].score;
	}
		
	$("#scalecaption").text('1:' + scale);	
	$("#controlcaption").text('' + controlnum + " control" + (controlnum == 1 ? "" : "s"));	
	$("#pointscaption").text('' + maxscore + " points");	
   
	for (var i = 0; i < controls.length; i++)
	{
		var control  = controls[i];
		$("#controldescriptions").find('tbody')
			.append($('<tr>').addClass('controlrow')
				.append($('<td>')
					.append(control.number)
				  )
				.append($('<td>')
					.append(control.score)
				  )
				.append($('<td>').attr('colspan', '2')
					.append(control.description.length > 28 ? control.description.substring(0,25) + "..."  : control.description)
				  )    
				.append($('<th>')
					.append($('<span>').addClass('edit').attr('id', 'e' + control.id).text('Edit').click(function() { handleControlEditOptions(this.id); })
					  )
					.append($('<span>').addClass('delete').attr('id', 'd' + control.id).text('Delete').click(function() { handleControlDelete(this.id); })
					  )
				  )     			
			);
	}
	
	initDescriptions();
}

/* Search handling */

function handleSearchPostcode()
{
	var pc = $("#postcode").val(); 
	var url = 'postcode.php?pc=' + escape(pc);
    $.get(url, null, handleSearchPostcodeCallback);
	$( "#postcode_searching" ).dialog( "open" );
}

function handleSearchPostcodeCallback(json)
{
	$( "#postcode_searching" ).dialog( "close" );
	var result = JSON.parse(json);
	if (result.success)
	{
		var start = new OpenLayers.LonLat(result.easting, result.northing);
		var zoom = map.getZoom();
		if (zoom < 13)
		{
			zoom = 13;
		}
		map.setCenter(start.transform("EPSG:27700", "EPSG:4326").transform("EPSG:4326", "EPSG:900913"), zoom);
	}	
	else
	{
		$( "#postcode_error" ).dialog( "open" );
		$( "#postcode_error_text" ).html(result.message);
	}
}

function handleGetPostboxes()
{
	var bounds = new OpenLayers.Bounds(mapBound.left, mapBound.bottom, mapBound.right, mapBound.top).transform("EPSG:900913", "EPSG:4326");
	//var url = 'http://dracos.co.uk/made/nearest-postbox/nearest.php?bounds=' + mapBound.left + "%2C" + mapBound.bottom + "%2C" + mapBound.right + "%2C" + mapBound.top;
	var url = '/getpostboxes.php?bounds=' + bounds.left + "%2C" + bounds.bottom + "%2C" + bounds.right + "%2C" + bounds.top;
    $.get(url, null, handleGetPostboxesCallback);
	$( "#postboxes_searching" ).dialog( "open" );

}

function handleGetPostboxesCallback(result)
{
	$( "#postboxes_searching" ).dialog( "close" );
	if (result.length > 0)
	{
		for(var i = 0; i < result.length; i++)
		{
		  	var control = new Object();		  	
		  	control.id = topID++;		  	
		  	control.number = topNumber++;
		  	//TODO Use a different number if one is already being used.		  	
		  	control.angle = 45;
			control.score = 10;
			if (control.number >= 20) { control.score = 20; } 
			if (control.number >= 30) { control.score = 30; } 
			if (control.number >= 40) { control.score = 40; } 
			if (control.number >= 50) {	control.score = 50;	} 
			control.type = "c_regular";
			control.description = "Postbox " + result[i].ref;
			//control.description = "Postbox";
			control.lat = new OpenLayers.LonLat(result[i].lon, result[i].lat).transform("EPSG:4326", "EPSG:900913").lat; 
			control.lon = new OpenLayers.LonLat(result[i].lon, result[i].lat).transform("EPSG:4326", "EPSG:900913").lon;  
			control.wgs84lat = result[i].lat; 
			control.wgs84lon = result[i].lon;				
			var dupe = false;
			for (var j = 0; j < controls.length; j++)
			{
				if (controls[j].wgs84lat == control.wgs84lat && controls[j].wgs84lon == control.wgs84lon)
				{
					dupe = true;
				} 
			}
			if (!dupe)
			{
				controls.push(control);
			}
		}
		$( "#getPostboxes" ).button("disable");	
		rebuildMapControls();
	  	rebuildDescriptions();

	}	
	else
	{
		$( "#postboxes_error" ).dialog( "open" );
		$( "#postboxes_error_text" ).html(result.message);
	}

}

function handleGetOpenplaques()
{
	var bounds = new OpenLayers.Bounds(mapBound.left, mapBound.bottom, mapBound.right, mapBound.top).transform("EPSG:900913", "EPSG:4326");
	var url = '/getopenplaques.php?bounds=[' + bounds.top + "%2C" + bounds.left + "]%2C[" + bounds.bottom + "%2C" + bounds.right + "]";
    $.get(url, null, handleGetOpenplaquesCallback);
	$( "#openplaques_searching" ).dialog( "open" );

}

function handleGetOpenplaquesCallback(result)
{
	$( "#openplaques_searching" ).dialog( "close" );
	if (result !== undefined && result.features !== undefined && result.features.length > 0)
	{
		for(var i = 0; i < result.features.length; i++)
		{
		  	var control = new Object();		  	
		  	control.id = topID++;		  	
		  	control.number = topNumber++;
		  	//TODO Use a different number if one is already being used.		  	
		  	control.angle = 45;
			control.score = 10;
			if (control.number >= 20) { control.score = 20; } 
			if (control.number >= 30) { control.score = 30; } 
			if (control.number >= 40) { control.score = 40; } 
			if (control.number >= 50) {	control.score = 50;	} 
			control.type = "c_regular";
			control.description = "Plaque: " + result.features[i].properties.inscription;
			//control.description = "Postbox";
			control.lat = new OpenLayers.LonLat(result.features[i].geometry.coordinates[0], result.features[i].geometry.coordinates[1]).transform("EPSG:4326", "EPSG:900913").lat; 
			control.lon = new OpenLayers.LonLat(result.features[i].geometry.coordinates[0], result.features[i].geometry.coordinates[1]).transform("EPSG:4326", "EPSG:900913").lon;  
			control.wgs84lat = result.features[i].geometry.coordinates[1]; 
			control.wgs84lon = result.features[i].geometry.coordinates[0];				

			var dupe = false;
			for (var j = 0; j < controls.length; j++)
			{
				if (controls[j].wgs84lat == control.wgs84lat && controls[j].wgs84lon == control.wgs84lon)
				{
					dupe = true;
				} 
			}
			if (!dupe)
			{
				controls.push(control);
			}
		}
		$( "#getOpenplaques" ).button("disable");	
		rebuildMapControls();
	  	rebuildDescriptions();

	}	
	else
	{
		$( "#openplaques_error" ).dialog( "open" );
		$( "#openplaques_error_text" ).html("There are no plaques in this area recorded on the Open Plaques database, or a system error is preventing retrieval of plaques for this area. Open Plaques has a high number of plaques in the UK, USA and Germany. Check the Open Plaques website at http://openplaques.org/places/");
	}

}

$(document).ready(function()
{
	init();
});
