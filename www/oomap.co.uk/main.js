proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs");
ol.proj.proj4.register(proj4);
var debug = false;

var currentID = null;
var currentNumber = null;
var topID = 0;
var topNumber = 0;

var rotAngle = 0;
var magDec;
const hitTol = 8;	//pixel tolerance when selecting map features

var mapTitle = defaultMapTitle;
var mapTitleDisplay = mapTitle;
var raceDescription = defaultRaceDescription;
var mapStyleID = "streeto-NONE-0";
var mapStyleIDOnSource;
var paper;
var paper_pieces = [];
var scale;
var trueScale = 10000;
var tips;
var eventdate = "";
var fontSizeFromArr;
var mapID = "new";
var reqMapID = "new";
var select;
var contourSeparation;


var controlsSF = [];
var controlsX = [];
var controlsCP = [];
var controls = [];
var dpi=150;
var drives=false;
var rail=true;
var walls=true;
var grid=true;
var trees=true;
var hedges=true;
var fences=true;

//OpenLayers single-instance objects
var olMap;
var args;
var layerMapnik;
var layerOrienteering;
var layerMapBorder;
var layerMapCentre;
var layerMapSheet;
var layerMapTitle;
var layerMapContent;
var layerSF;
var layerX;
var layerCP;
var layerControls;
var titleFeature;
var dragControl;
var sheetCentreLL;
var newControlLL = [0, 0];
var mapBound;
var wgs84Poly;
var orienteeringAttribution;
var layerGPX;
var purple = 'rgba(220, 40, 255, 1)';

//State
//initialzoom, placepaper, addcontrols
var state = "initialzoom";
var controloptstate = "add";


let dragAndDropInteraction;

function setInteraction() {
  if (dragAndDropInteraction) {
    olMap.removeInteraction(dragAndDropInteraction);
  }
  dragAndDropInteraction = new ol.interaction.DragAndDrop({
    formatConstructors: [
      ol.format.GPX,
    ],
  });
  dragAndDropInteraction.on('addfeatures', function (event) {
    const vectorSource = new ol.source.Vector({
      features: event.features,
    });
    olMap.addLayer(
      layerGPX = new ol.layer.Vector({
        source: vectorSource,
      })
    );
    olMap.getView().fit(vectorSource.getExtent());
  });
  olMap.addInteraction(dragAndDropInteraction);
}


function controlStyle(feature, resolution)
{
	var size = trueScale/(resolution * 16000);
	return [
	new ol.style.Style({
		image: new ol.style.Circle({
			fill: new ol.style.Fill({ color: purple}),
			radius: 10 * size
		})
	}),
	new ol.style.Style({
		image: new ol.style.Circle ({
			stroke: new ol.style.Stroke({color: purple, width: 10 * size}),
			radius: 75 * size
		}),
		text: new ol.style.Text({
			  textAlign: "center",
			  font: "bold " + 120 * size + "px arial, verdana, sans-serif",
			  text: feature.get('number'),
			  fill: new ol.style.Fill({color: purple}),
			  offsetX: feature.get('xoff') * 5 * size,
			  offsetY: feature.get('yoff') * 5 * size
		})
	})
]};

var dotStyle = new ol.style.Style({
});

function sfStyle(feature, resolution)	//start/finish - triangle and 2 circles
{
	var size = trueScale/(resolution * 16000);
	return [
		new ol.style.Style({
			image: new ol.style.RegularShape({
				points: 3,
				stroke: new ol.style.Stroke({color: purple, width: 10 * size}),
				radius: 110 * size
			})
		}),
		new ol.style.Style({
			image: new ol.style.Circle({
				stroke: new ol.style.Stroke({color: purple, width: 10 * size}),
				radius: 70 * size
			})
		}),
		new ol.style.Style({
			image: new ol.style.Circle({
				stroke: new ol.style.Stroke({color: purple, width: 10 * size}),
				radius: 90 * size
    })
	})
]};


function xStyle(feature, resolution)
{
	var size = trueScale/(resolution * 16000);
	return [
	new ol.style.Style({
		image: new ol.style.Circle({
			stroke: new ol.style.Stroke({color: 'rgba(255,0,255,0)', width: 5 * size}),
			radius: 1 * size
		}),
		text: new ol.style.Text({
			  textAlign: "center",
				baseAlign: "middle",
			  font: "bold " + 90 * size + "px arial, verdana, sans-serif",
			  text: "X",
			  fill: new ol.style.Fill({color: purple}),
			  offsetX: 0,
			  offsetY: 0
		})
	})
]};

function cpStyle(feature, resolution)
{
	var size = trueScale/(resolution * 16000);
	return [
		new ol.style.Style({
			image: new ol.style.Circle({
				stroke: new ol.style.Stroke({color: 'rgba(255,0,0,0)', width: 0.5}),
				radius: 1
			}),
			text: new ol.style.Text({
				  textAlign: "center",
				  baseAlign: "middle",
				  font: 90 * size + "px arial, verdana, sans-serif",
				  text: "][",
				  fill: new ol.style.Fill({color: purple}),
				  offsetX: 0,
				  offsetY: 0,
				  rotation: feature.get('angle')*Math.PI/180
			})
		})
	]
}

var marginStyle = new ol.style.Style({
	fill: new ol.style.Fill({ color: [255, 255, 255, 1]})
});

var sheetStyle  = new ol.style.Style({
	stroke: new ol.style.Stroke({ color: [0, 0, 0, 1], width: 1})
});

function titleStyle(feature, resolution)
{
	var size = trueScale/(resolution * 16000);
	return [
	 new ol.style.Style({
		text: new ol.style.Text({
			text: feature.get('mapTitleDisplay'),
			textAlign: "left",
			textBaseline: "middle",
          	fill: new ol.style.Fill({color: 'rgba(0,0,0,1)'}),
			font: "italic " + 150 * size + "px arial, verdana, sans-serif",
          	offsetX: feature.get('xoff'),
          	offsetY: feature.get('yoff'),
		})
	})
]};


var contentStyle = new ol.style.Style({ fill: new ol.style.Fill({ color: [200, 200, 200, 0.3]})

});
var centreStyle = new ol.style.Style({
	image: new ol.style.Circle({
		stroke: new ol.style.Stroke({color: 'rgba(0,0,255,1)', width: 1}),
		fill: new ol.style.Stroke({color: 'rgba(0,0,255,0.5)'}),
		radius: 5
	})
});

var keys = ['unused', 'mapID', 'mapStyleID', 'zoom', 'lon', 'lat'];
args = [];

function setDefaults()
{
	/* Specified by user in URL. */
	var hash = window.location.hash;

	if (hash.length > 0)
	{
		var elements = hash.split('#');
		var pieces = elements[1].split('/');
		for(var i = 0; i < keys.length; i++)
		{
			if (pieces[i])
			{
				args[keys[i]] = pieces[i];
			}
		}
		if (args['zoom']) { args['zoom'] = parseInt(args['zoom']); }
		if (args['lon']) { args['lon'] = parseFloat(args['lon']); }
		if (args['lat']) { args['lat'] = parseFloat(args['lat']); }
	}
}

//var controlsClick  = new OpenLayers.Control.ControlsClick();

/* Initialisation */

function init()
{
	$( "#mapstyle" ).buttonset();

	$( "#mapscale" ).buttonset();
	$( "#papersize" ).buttonset();
	$( "#paperorientation" ).buttonset();

	$( "#contours" ).buttonset();

	$( "#portrait" ).button( { icons: {primary: 'ui-icon-document'} } );
	$( "#landscape" ).button( { icons: {primary: 'ui-icon-document-b'} } );

	$( "#c_type" ).buttonset();
	$( "#c_score" ).buttonset();

	$( "#mapstyle input[type=radio]" ).on('change', handleStyleChange);
	$( "#mapscale input[type=radio]" ).on('change', handleOptionChange);
	$( "#papersize input[type=radio]" ).on('change', handleOptionChange);
	$( "#paperorientation input[type=radio]" ).on('change', handleOptionChange);
	$( "#c_type input[type=radio]" ).on('change', handleControlTypeChange);

	$( "#contours input[type=radio]" ).on('change', handleStyleChange);

	$( "#createmap" ).button({ icons: { primary: "ui-icon-disk" } }).on('click', function() { handleGenerateMap(); });
	$( "#getraster" ).button().on('click', function() { generateMap("jpg"); });
	$( "#getworldfile" ).button().on('click', function() {generateMap("jgw"); });
	$( "#getkmz" ).button().on('click', function() {generateMap("kmz"); });
	$( "#getkml" ).button().on('click', function() {generateKML(); });
	$( "#opts" ).button().on('click', function() {handleAdvancedOptions(); });
	$( "#createclue" ).button().on('click', function() { handleGenerateClue(); });
	$( "#deletesheet" ).button({ icons: { primary: "ui-icon-trash" } }).on('click', function() { handleDeleteSheet(); });
	$( "#deleteXs" ).button({ icons: { primary: "ui-icon-trash" } }).on('click', function() { handleDeleteXs(); });
	$( "#getPostboxes" ).button({ icons: { primary: "ui-icon-pin-s" } }).on('click', function() { handleGetPostboxes(); });
	$( "#getOpenplaques" ).button({ icons: { primary: "ui-icon-pin-s" } }).on('click', function() { handleGetOpenplaques(); });

	$( "#createmap" ).button("disable");
	$( "#getraster" ).button("disable");
	$( "#getworldfile" ).button("disable");
	$( "#getkmz" ).button("disable");
	$( "#getkml" ).button("disable");
	$( "#createclue" ).button("disable");
	$( "#deletesheet" ).button("disable");
	$( "#deleteXs" ).button("disable");
	$( "#getPostboxes" ).button("disable");
	$( "#getPlaques" ).button("disable");

	$( "#edittitle" ).on('click', function() { handleTitleEdit(); })
	$( "#editinstructions" ).on('click', function() { handleRaceDescriptionEdit(); })

	$( "#eventdate").datepicker({
		dateFormat: "D d M yy",
      	altField: "#eventdate_alternate",
      	altFormat: "yy-mm-dd",
    });

    tips = $( ".validateTips" );

	setDefaults();

	var currentLat = 51.1;
	var currentLon = -0.1;
	var currentZoom = 4;
	var minZoom = 1;

	mapStyleID = "streeto-LIDAR-5";

	if (args['zoom'])
	{
		currentZoom = args['zoom'];
	}
	else
	{
			currentZoom = 8;
	}
	if (args['lat'] && args['lon'])
	{
		currentLat = parseFloat(args['lat']); /* Necessary for lat (only) for some reason, otherwise was going to 90-val. Very odd... */
		currentLon = parseFloat(args['lon']);
	}
	else
	{
		currentLat = 51.8;
		currentLon = -0.9;
	}
	if (args['mapID'])
	{
		reqMapID = args['mapID'];
	}

 	layerMapnik = new ol.layer.Tile({ title: "OpenStreetMap", source: new ol.source.OSM({
		"wrapX": true,
		attributions: [
			'Alt-Shift-Drag to rotate. Try drag & dropping a GPX file!<br>',
			ol.source.OSM.ATTRIBUTION,
		],
		crossOrigin: null
	})});
	layerOrienteering = new ol.layer.Tile({opacity: 1, zIndex: 1});
	layerMapBorder = new ol.layer.Vector({ title: "mapborder", style: marginStyle, source: new ol.source.Vector({}) , zIndex: 2});
	layerMapCentre = new ol.layer.Vector({ title: "mapcentre", style: centreStyle, source: new ol.source.Vector({}) , zIndex: 2});
	layerMapSheet = new ol.layer.Vector({ title: "mapsheet", style: sheetStyle, source: new ol.source.Vector({}), zIndex: 2});
	layerMapTitle = new ol.layer.Vector({ title: "maptitle", style: titleStyle, source: new ol.source.Vector({}) , zIndex: 2});
	layerMapContent = new ol.layer.Vector({ title: "mapcontent", style: contentStyle, source: new ol.source.Vector({}) });
	layerSF = new ol.layer.Vector({ title: "controlsSF", style: sfStyle, source: new ol.source.Vector({}) });
	layerX = new ol.layer.Vector({ title: "controlsX", style: xStyle, source: new ol.source.Vector({}) });
	layerCP = new ol.layer.Vector({ title: "controlsCP", style: cpStyle, source: new ol.source.Vector({}) });
	layerControls = new ol.layer.Vector({ title: "controls", style: controlStyle, source: new ol.source.Vector({})});

	//orienteeringAttribution = new ol.Attribution({ 'html': 'Copyright OpenStreetMap contributors and OS Crown Copyright & Database Right Ordnance Survey 2016.'});

	if (args['mapStyleID'])
	{
		mapStyleID = args['mapStyleID'];
 	}
	$('#' + mapStyleID.split("-")[0]).prop('checked', true);
	$('#mapstyle').buttonset('refresh');
	$('#' + mapStyleID.split("-")[1]+"-"+mapStyleID.split("-")[2]).prop('checked', true);
	$('#contours').buttonset('refresh');
 	var theRestrictedExtent = undefined;

	if (mapStyleID.split("-")[0] == "blueprint")
	{
		mapTitle = "Blueprint";
	}

	select = new ol.interaction.Select({
		layers: [layerMapCentre, layerControls, layerSF, layerX, layerCP], hitTolerance: hitTol
	});

	var translate = new ol.interaction.Translate({
  	features: select.getFeatures()
	});

	translate.on('translateend', handleDrag)

	olMap = new ol.Map(
	{
		target: "map",
		layers:
		[
			layerMapnik,
			layerOrienteering,
	  		layerMapBorder,
	  		layerMapContent,
	  		layerMapSheet,
	  		layerMapTitle,
	  		layerMapCentre,
	  		layerSF,
	  		layerX,
	  		layerCP,
	  		layerControls
		],

		controls: ol.control.defaults({rotateOptions: {
		      label: "M",
		      autoHide: false,
		      tipLabel: "M: To Mag North / N: to True North",
		      resetNorth: function()
		      {
		        //var contrls = map.getControls(); // this is a ol.Collection
		        //contrls.forEach(function(con){
		        //    console.info(contrl instanceof ol.control.Zoom);
		        //});
		        if (magDec == null) { //If no mag N details available, look up.
		          var coords = olMap.getView().getCenter();
		          //Use view centre unless sheet has been placed.
		          if (state != 'initialzoom' && state != 'placepaper') { coords = sheetCentreLL; }
		          lookupMag(ol.proj.transform(coords, "EPSG:3857", "EPSG:4326")[1],ol.proj.transform(coords, "EPSG:3857", "EPSG:4326")[0]);
		          this.Er.innerHTML = 'N';
		        }
		        else if (Math.PI - Math.abs(Math.abs((-magDec * Math.PI/180) - olMap.getView().getRotation()) - Math.PI) > 0.016) { //If mag N available, and not current orientation, change to Mag N
		          olMap.getView().setRotation(-magDec * Math.PI/180);
		          this.Er.innerHTML = 'N';
		        }
		        else {  //Otherwise rotate to True N
		          olMap.getView().setRotation(0);
		                    this.Er.innerHTML = 'M';
		        }
		      }
		    } }).extend(
		[
			new ol.control.ScaleLine({'geodesic': true, 'units': 'metric'})
		]),
		view: new ol.View({
			projection: "EPSG:3857",
			maxZoom: 20,
			minZoom: minZoom,
			zoom: currentZoom,
			center: ol.proj.transform([currentLon, currentLat], "EPSG:4326", "EPSG:3857"),
			extent: theRestrictedExtent
		}),
		interactions: ol.interaction.defaults().extend([select, translate]),
	});

 	olMap.getView().on('change:resolution', handleZoom);
	olMap.on("moveend", updateUrl);

	olMap.on("singleclick", function(evt) {
		handleClick(evt);
	});

	olMap.getView().on('propertychange', handleRotate);

	setInteraction();

	handleZoom();
	updateUrl();
	initDescriptions();
	//if(!document.createElement('canvas').getContext)
	//{
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
	//}
	var c_number = $( "#c_number" ),
      allFields = $( [] ).add( c_number );

    function checkNumber( o, n, type )
    {
    	if (type == "c_startfinish" || type == "c_cross" || type == "c_crossingpoint")
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
	  height: 370,
	  width: 550,
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

			//make sure entered description in $("#c_description").val() is santised:
			control.description = $('<div>').text($("#c_description").val()).html();

			control.lat = newControlLL[1];
			control.lon = newControlLL[0];

			control.wgs84lat = ol.proj.transform([control.lon, control.lat], "EPSG:3857", "EPSG:4326")[1];
			control.wgs84lon = ol.proj.transform([control.lon, control.lat], "EPSG:3857", "EPSG:4326")[0];

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
  			else if (control.type == "c_crossingpoint")
  			{
  				if (controloptstate == "new")
  				{
  					controlsCP.push(control);
				}
				else if (controloptstate == "edit")
				{
					for (var i = 0; i < controlsCP.length; i++)
					{
						if (currentID == controlsCP[i].id)
						{
							controlsCP[i] = control;
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

			if (mapID != "new")
			{
				mapID = "new";
				updateUrl();
			}

			$( "#getraster" ).button("disable");
			$( "#getworldfile" ).button("disable");
			$( "#getkmz" ).button("disable");

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

	$( "#advanced" ).dialog({
	  autoOpen: false,
	  height: 370,
	  width: 550,
	  modal: true,
	  buttons: {
		OK: function() {
			rail = $('#rail').is(':checked');
			grid = $('#grid').is(':checked');
			drives = $('#drive').is(':checked');
			walls = $('#wall').is(':checked');
			trees = $('#tree').is(':checked');
			hedges = $('#hedges').is(':checked');
			fences = $('#fence').is(':checked');
			dpi = parseInt($('#dpi').val());
			if (isNaN(dpi)) { dpi = 150; }

			$( this ).dialog( "close" );
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
			if (mapID != "new")
				{
					mapID = "new";
					updateUrl();
				}

				$( "#getraster" ).button("disable");
				$( "#getworldfile" ).button("disable");
				$( "#getkmz" ).button("disable");

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
		OK: function()
		{
			if (mapID != "new")
			{
				mapID = "new";
				updateUrl();
			}

			$( "#getraster" ).button("disable");
			$( "#getworldfile" ).button("disable");
			$( "#getkmz" ).button("disable");

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
		  	mapID = "new";

			$( "#getraster" ).button("disable");
			$( "#getworldfile" ).button("disable");
			$( "#getkmz" ).button("disable");

			generateMap("pdf");
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
	  height: 410,
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
	$( "#welcome" ).dialog({
	  autoOpen: true,
	  width: 760,
	  modal: true,
	  buttons:  [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ]
	});


	$("#search").on('submit', function() { handleSearchPostcode(); return false });
	$("#load").on('submit', function() { handleLoadMap(); return false; });

	$( "#searchButton" ).button().css('font-size', '10px');
	$( "#loadButton" ).button().css('font-size', '10px');

	//Handle loading in a map with ID.
	if (reqMapID != "new")
	{
		$.post('/load.php', {"shortcode":reqMapID}, handleLoadCallback);
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

	$('[for=c_regular]').trigger( "click" ); //Overlying label
	$("#c_regular").trigger( "click" ); //Underlying button

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

		$('[for=c_score' + control.score + ']').trigger( "click" ); //Overlying label
		$("#c_score" + control.score).trigger( "click" ); //Underlying button
		$("#c_number").val(control.number);
		$("#c_description").val(control.description);

		newControlLL = [control.lon, control.lat];
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
		$("#anglelabel").html('<br />&nbsp;');
		$("#c_angle").val(45).trigger('change');
		$("#c_angle").trigger('configure', { "readOnly":true });

	}
	else if (type == "c_crossingpoint")
	{
		$("#anglelabel").html('Crossing<br />angle');
		$("#c_angle").trigger('configure', { "readOnly":false });
	}
	else
	{
		$("#anglelabel").html('Number<br />position');
		$("#c_angle").trigger('configure', { "readOnly":false });
	}


	if (type == "c_startfinish" || type == "c_cross" || type == "c_crossingpoint")
	{
		//$("#c_score").val(10); //Don't change this - useful to keep current value.
		$("#c_number").val("");
		$("#c_description").val("");

		$("#c_score input[type=radio]").button("disable");
		$("#c_number").attr('disabled','disabled');
		$("#c_description").attr('disabled','disabled');
	}
	else
	{
		$("#c_score input[type=radio]").button("enable");
		$("#c_number").removeAttr('disabled');
		$("#c_description").removeAttr('disabled');
	}
}

function handleStyleChange()
{
	mapStyleID = $("#mapstyle :radio:checked").attr("id") + "-" + $("#contours :radio:checked").attr("id");
	handleZoom();
	updateUrl();
}

function handleRotate()
{
	if (debug) {console.log('handleRotate');}
	if (!olMap || state == "initialzoom" || state == "placepaper")
	{
		return;
	}
	try {
		var angle = this.getRotation();
  	if (angle != rotAngle) {
			if (Math.abs(angle)>Math.PI/4){
				var orient;
				if ($("#portrait").prop('checked')) {orient="landscape"}
				else {orient="portrait"}
				$("#" + orient).trigger( "click" );
				$("[for=" + orient + "]").trigger( "click" );
				if(angle>0) {angle=angle-Math.PI/2}
				else {angle=angle+Math.PI/2}
				this.setRotation(angle);
			}
			rebuildMapSheet();
			rebuildMapControls();
		}
	}
	catch {}
}

function handleZoom()
{
	if (debug) { console.log('handleZoom'); }
	if (!olMap)
	{
		return;
	}

	$( "#createmap" ).button("disable");
	$( "#getraster" ).button("disable");
	$( "#getworldfile" ).button("disable");
	$( "#getkmz" ).button("disable");
	$( "#deletesheet" ).button("disable");
	$( "#deleteXs" ).button("disable");
	$( "#getPostboxes" ).button("disable");
	$( "#getOpenplaques" ).button("disable");

	if (controlsX.length > 0 || controlsCP.length > 0)
	{
		$( "#deleteXs" ).button("enable");
	}

/*	if (olMap.getView().getZoom() != parseInt(olMap.getView().getZoom()))
	{
		olMap.getView().setZoom(Math.round(olMap.getView().getZoom()));
	}
*/
	if (olMap.getView().getZoom() < 12)
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
		layerMapnik.setVisible(true);
		layerOrienteering.setVisible(false);
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
		mapStyleID = $("#mapstyle :radio:checked").attr("id") + "-" + $("#contours :radio:checked").attr("id");

		if (mapStyleIDOnSource != mapStyleID)
		{
			layerOrienteering.setSource(
				new ol.source.XYZ(
					{
						urls: [prefix1 + $("#contours :radio:checked").attr("id") + "/{z}/{x}/{y}.png", prefix2 + $("#contours :radio:checked").attr("id") + "/{z}/{x}/{y}.png", prefix3 + $("#contours :radio:checked").attr("id") + "/{z}/{x}/{y}.png"],
						attributions: ['Contours: various - see PDF output', ],
						"wrapX": true
					}
				)
			);
			mapStyleIDOnSource = mapStyleID;

		}

		layerMapnik.setVisible(true);	//Use standard slippy map for all zoom levels.  Switch on/off contours depending on zoom and contour type
		if(mapStyleID.split("-")[1] == "SRTM" || mapStyleID.split("-")[1] == "NONE" || mapStyleID.split("-")[1] == "COPE")
		{
			layerOrienteering.setVisible(false);
	  }
		else
		{
			layerOrienteering.setVisible(true);
		}
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
					newControlLL = [control.lon, control.lat];
					break;
				}
			}
			$( "#newcontroloptions" ).dialog( "open" );
			resetControlAddDialog(pid);
}

function handleAdvancedOptions(pid)
{
			$('#rail').prop('checked', rail);
			$('#grid').prop('checked', grid);
			$('#drive').prop('checked', drives);
			$('#wall').prop('checked', walls);
			$('#tree').prop('checked', trees);
			$('#hedges').prop('checked', hedges);
			$('#fence').prop('checked', fences);
			$('#dpi').val(dpi);
			$( "#advanced" ).dialog( "open" );
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
	for (var i = 0; i < controlsCP.length; i++)
	{
		if (currentID == controlsCP[i].id)
		{
			controlsCP.splice(i, 1);
			break;
		}
	}

	if (mapID != "new")
	{
		mapID = "new";
		updateUrl();
	}

	$( "#getraster" ).button("disable");
	$( "#getworldfile" ).button("disable");
	$( "#getkmz" ).button("disable");

	rebuildMapControls();
	rebuildDescriptions();
}

function handleDeleteSheet()
{
	layerMapBorder.getSource().clear();
	layerMapCentre.getSource().clear();
	layerMapSheet.getSource().clear();
	layerMapTitle.getSource().clear();
	layerMapContent.getSource().clear();

	controls = [];
	controlsSF = [];
	controlsX = [];
	controlsCP = [];

	topID = 0;
	topNumber = 0;
	magDec = undefined;

	rebuildMapControls();
	rebuildDescriptions();
	state = "initialzoom";
	handleZoom();

	if (mapID != "new")
	{
		mapID = "new";
	}
	updateUrl();

	$( "#getraster" ).button("disable");
	$( "#getworldfile" ).button("disable");
	$( "#getkmz" ).button("disable");

	$( "#deletesheet" ).button("disable");
	$( "#getPostboxes" ).button("disable");
	$( "#getOpenplaques" ).button("disable");
}

function handleDeleteXs()
{
	if (mapID != "new")
	{
		mapID = "new";
		updateUrl();
	}
	controlsX = [];
	controlsCP = [];
	rebuildMapControls();
	$( "#deleteXs" ).button("disable");

	$( "#getraster" ).button("disable");
	$( "#getworldfile" ).button("disable");
	$( "#getkmz" ).button("disable");
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
	updateTips("Tip: The race instructions will appear at the top of the clue sheet. Please do not place any personal information here (e.g. phone numbers) as it may be publically visible in future versions of OpenOrienteeringMap.");
}

function handleLoadMap()
{
	reqMapID = $("#savedMapID").val();
	$.post('/load.php', {"shortcode":reqMapID}, handleLoadCallback);
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
		if ($.inArray(control.number, controlNumbers) > -1 && control.type != "c_startfinish" && control.type != "c_cross" &&  control.type != "c_crossingpoint")
		{
			validationMsg += "Two or more controls have the same number.<br />";
			if (debug) { console.log(controlNumbers); console.log(control.number); }
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

function handleDrag()	//Vector element has been dragged - update arrays to match UI
{
	//console.log('drag ');
	var feats = select.getFeatures();
	feats.forEach((feat) => {
		if (debug) { console.log('handleDrag'); }
		if(feat.get('type') == 'control')	//Is the moved element a control?
		{
		for (var i = 0; i < controls.length; i++)
								{
									if (feat.get('id') == controls[i].id)	//Find matching control
									{
										controls[i].lon = feat.getGeometry().getCoordinates()[0];
										controls[i].lat = feat.getGeometry().getCoordinates()[1];
										controls[i].wgs84lat = ol.proj.transform([controls[i].lon, controls[i].lat], "EPSG:3857", "EPSG:4326")[1];
										controls[i].wgs84lon = ol.proj.transform([controls[i].lon, controls[i].lat], "EPSG:3857", "EPSG:4326")[0];
									}
								}
		}
		if(feat.get('type') == 'CP')	//Is the moved element a crossing point?
		{
		for (var i = 0; i < controlsCP.length; i++)
								{
									if (feat.get('id') == controlsCP[i].id)	//Find matching control
									{
										controlsCP[i].lon = feat.getGeometry().getCoordinates()[0];
										controlsCP[i].lat = feat.getGeometry().getCoordinates()[1];
										controlsCP[i].wgs84lat = ol.proj.transform([controlsCP[i].lon, controlsCP[i].lat], "EPSG:3857", "EPSG:4326")[1];
										controlsCP[i].wgs84lon = ol.proj.transform([controlsCP[i].lon, controlsCP[i].lat], "EPSG:3857", "EPSG:4326")[0];
									}
								}
		}
		if(feat.get('type') == 'X')	//Is the moved element an X?
		{
		for (var i = 0; i < controlsX.length; i++)
								{
									if (feat.get('id') == controlsX[i].id)	//Find matching control
									{
										controlsX[i].lon = feat.getGeometry().getCoordinates()[0];
										controlsX[i].lat = feat.getGeometry().getCoordinates()[1];
										controlsX[i].wgs84lat = ol.proj.transform([controlsX[i].lon, controlsX[i].lat], "EPSG:3857", "EPSG:4326")[1];
										controlsX[i].wgs84lon = ol.proj.transform([controlsX[i].lon, controlsX[i].lat], "EPSG:3857", "EPSG:4326")[0];
									}
								}
		}
		if(feat.get('type') == 'start')	//Is the moved element an X?
		{
		for (var i = 0; i < controlsSF.length; i++)
								{
									if (feat.get('id') == controlsSF[i].id)	//Find matching control
									{
										controlsSF[i].lon = feat.getGeometry().getCoordinates()[0];
										controlsSF[i].lat = feat.getGeometry().getCoordinates()[1];
										controlsSF[i].wgs84lat = ol.proj.transform([controlsSF[i].lon, controlsSF[i].lat], "EPSG:3857", "EPSG:4326")[1];
										controlsSF[i].wgs84lon = ol.proj.transform([controlsSF[i].lon, controlsSF[i].lat], "EPSG:3857", "EPSG:4326")[0];
									}
								}
		}
		if(feat.get('type') == 'centre')
		{
			sheetCentreLL = (layerMapCentre.getSource().getFeatures()[0]).getGeometry().getFirstCoordinate();
		}
	});
	//sheetCentreLL = ol.proj.transform([parseFloat(data.centre_lon), parseFloat(data.centre_lat)], "EPSG:4326", "EPSG:3857");
	select.getFeatures().clear()
	rebuildMapSheet()
}

function handleSaveCallback(json)
{
	$( "#saving" ).dialog( "close" );
	var result = JSON.parse(json);
	if (result.success)
	{
		$( "#generating" ).dialog( "open" );
		$("#saved_mapid").html("Your map ID (" + result.message + ") is printed at the bottom right. Use this ID if you wish to reload the map in the future.");
		mapID = result.message;
		updateUrl();
		if (debug) { console.log(result.data); }
		generateMap("pdf");
	}
	else
	{
		$( "#saveerror" ).dialog( "open" );
		$( "#saveerror_text" ).html(result.message);
	}
	$( "#getraster" ).button("enable");
	$( "#getworldfile" ).button("enable");
	$( "#getkmz" ).button("enable");
}

function handleLoadCallback(json)
{
	$("#loaderror_text").html("");

	var result = JSON.parse(json);
	if (result.success)
	{
		if (debug) { console.log(result.data); }
		loadMap(result.data);
	}
	else
	{
	//	$( "#loaderror" ).dialog( "open" );
	//	$( "#loaderror_text" ).html(result.message);

	//If failed, try looking up from oomap.co.uk load.php instead before giving up.
		reqMapID = $("#savedMapID").val();
		$.post('https://oomap.co.uk/load.php', {"shortcode":reqMapID}, handleLoadOldCallback);
	}
}

//Old save lookup callback - delete when function becomes redundant
function handleLoadOldCallback(json)
{
	$("#loaderror_text").html("");

	var result = JSON.parse(json);
	if (result.success)
	{
		if (debug) { console.log(result.data); }
		//If successful, need to convert old-style data to updated format (different styles, added rotation value)
		result.data.rotation='0';
		if (result.data.style == 'streeto') {result.data.style = 'streeto-OS-10'; }
		if ((result.data.style + "padding").substring(0,8) == 'streeto_') {result.data.style = 'streeto-NONE-0'; }
		if (result.data.style == 'oterrain') {result.data.style = 'oterrain-OS-10'; }
		if ((result.data.style + "padding").substring(0,9) == 'oterrain_') {result.data.style = 'oterrain-NONE-0'; }
		if (result.data.style == 'blueprint') {result.data.style = 'blueprint-NONE-0'; }
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
		if (mapID != "new")
		{
			mapID = "new";
			updateUrl();
		}

		$( "#getraster" ).button("disable");
		$( "#getworldfile" ).button("disable");
		$( "#getkmz" ).button("disable");

		rebuildMapSheet();
		rebuildMapControls();	//to correctly scale features
		return;
	}
}

function handleClick(evt)
{
	var centreClick = false;
	var pixel = evt.pixel;
	olMap.forEachFeatureAtPixel(pixel, function(feature, layer)
	{
		//Has a map feature been clicked?
		if (feature && $.inArray(layer.get('title'), ['mapcentre', 'controls', 'controlsSF', 'controlsX', 'controlsCP']) >= 0)
		{
			centreClick = true;
		}
	},
	{
		hitTolerance: hitTol,
	});
	//If so, stop processing click and allow openLayers event to take over.
	if (centreClick)
	{
		if (debug) { console.log('returning'); }
		return;
	}

	//console.log(state);
	if (state == "addcontrols")
	{
    	var coordinate = evt.coordinate;
		newControlLL = coordinate;
		if (!(new ol.geom.Point(newControlLL).intersectsExtent(mapBound)))
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
		if (mapID != "new")
		{
			mapID = "new";
			updateUrl();
		}

		$( "#getraster" ).button("disable");
		$( "#getworldfile" ).button("disable");
		$( "#getkmz" ).button("disable");

		sheetCentreLL = evt.coordinate;
		lookupMag(ol.proj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326")[1],ol.proj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326")[0]);
		rebuildMapSheet();
		state = "addcontrols";
		$("#messageCentre").hide();
		$("#messageAdd").effect("pulsate", {}, 500);
	}
}

/* Actions */

function saveMap()
{
	if (mapID != "new")
	{
		$( "#generating" ).dialog( "open" );
		generateMap("pdf");
	}
	var controlsForDB = controls.concat(controlsSF).concat(controlsX).concat(controlsCP);

	var json = {"data":{
		"action": "savemap",
		"title": mapTitle,
		"race_instructions": raceDescription,
		"eventdate": $('#eventdate_alternate').val(),
		"club": $('#club').val(),
		"style": mapStyleID,
		"scale": $("#mapscale :radio:checked").attr("id"),
		"papersize": $("#papersize :radio:checked").attr("id"),
		"paperorientation": $("#paperorientation :radio:checked").attr("id"),
		"centre_lat": sheetCentreLL[1],
		"centre_lon": sheetCentreLL[0],
		"centre_wgs84lat": ol.proj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326")[1],
		"centre_wgs84lon": ol.proj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326")[0],
		"controls": controlsForDB,
		"rotation": rotAngle
	}};

	$.post('/save.php', json, handleSaveCallback);
	$( "#saving" ).dialog( "open" );
}

function generateMap(type)
{
	//Construct the URL to the PDF.
	var escapeTitleText = encodeURIComponent(mapTitle);

	var startText = ""
	var xText = "";
	var cpText = "";
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
	if (controlsCP.length > 0)
	{
		for (var i = 0; i < controlsCP.length; i++)
		{
			var control = controlsCP[i]
			cpText += control.angle + "," + control.lat.toFixed(0) + "," + control.lon.toFixed(0) + ",";
		}
		cpText = cpText.substring(0, cpText.length - 1);
	}
	var site_href = window.location.href
	var arr = site_href.split("/");
	url = arr[0] + "//" + arr[2] + "/render/" + type
		+ "/?style=" + mapStyleID
	 	+ "|paper=" + paper_pieces[0].toFixed(3) + "," + paper_pieces[1].toFixed(3)	//trim numbers in string to 3dp
		+ "|scale=" + scale
		+ "|centre=" +  sheetCentreLL[1].toFixed(0) + "," + sheetCentreLL[0].toFixed(0)
		+ "|title=" + escapeTitleText
		+ "|club=" + $('#club').val()
		+ "|id=";
	if (mapID != "new")
	{
		url += mapID;
	}

	if (type == 'kmz')
	{
		url	+= "|start="
			+ "|crosses=" + xText
			+ "|cps=" + cpText
			+ "|controls=";
	}
	else
	{
		url	+= "|start=" + startText
			+ "|crosses=" + xText
			+ "|cps=" + cpText
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
	}
	url	+= "|rotation=" + rotAngle.toFixed(4);
	if (grid) {url += "|grid=yes"; } else {url += "|grid=no"; }
	if (rail) {url += "|rail=yes"; } else {url += "|rail=no"; }
	if (walls) {url += "|walls=yes"; } else {url += "|walls=no"; }
	if (trees) {url += "|trees=yes"; } else {url += "|trees=no"; }
	if (hedges) {url += "|hedges=yes"; } else {url += "|hedges=no"; }
	if (drives) {url += "|drives=yes"; } else {url += "|drives=no"; }
	if (fences) {url += "|fences=yes"; } else {url += "|fences=no"; }
	url += "|dpi=" + dpi;

	if (debug) { console.log(url); }
	self.location=url;
}
/*
function getCrosspointStyleKML(angle)
{
	return '<Style id="crossingpoint'
		+ angle
		+ '"><IconStyle><color>ffff00ff</color><heading>'
		+ angle
		+ '</heading><scale>1.0</scale><Icon><href>https://oomap.co.uk/images/kml_crossingpoint.png</href></Icon></IconStyle><BalloonStyle></BalloonStyle><ListStyle></ListStyle></Style>';
}

function getCrosspointKML(control)
{
	return '<Placemark><styleUrl>#crossingpoint'
		+ control.angle
		+ '</styleUrl><Point><gx:drawOrder>1</gx:drawOrder><coordinates>'
		+ control.wgs84lon
		+ ","
		+ control.wgs84lat
		+ ',0</coordinates></Point></Placemark>';
}

function getDoNotCrossKML(control)
{
	return '<Placemark><styleUrl>#donotcross</styleUrl><Point><gx:drawOrder>1</gx:drawOrder><coordinates>'
		+ control.wgs84lon
		+ ","
		+ control.wgs84lat
		+ ',0</coordinates></Point></Placemark>';
}
*/

function getStartKML(control, i)
{
	return '<Placemark><name>S'
		+ (i+1)
		+ '</name><styleUrl>#startfinish</styleUrl><Point><gx:drawOrder>1</gx:drawOrder><coordinates>'
		+ control.wgs84lon
		+ ","
		+ control.wgs84lat
		+ ',0</coordinates></Point></Placemark>';
}

function getFinishKML(control, i)
{
	return '<Placemark><name>F'
		+ (i+1)
		+ '</name><styleUrl>#startfinish</styleUrl><Point><gx:drawOrder>1</gx:drawOrder><coordinates>'
		+ control.wgs84lon
		+ ","
		+ control.wgs84lat
		+ ',0</coordinates></Point></Placemark>';
}

function getControlKML(control)
{
	//var geom = ol.proj.transform(feature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326")
	return '<Placemark><name>'
		+ control.number
		+ '</name><styleUrl>#control</styleUrl><Point><gx:drawOrder>1</gx:drawOrder><coordinates>'
		+ control.wgs84lon
		+ ","
		+ control.wgs84lat
		+ ',0</coordinates></Point></Placemark>';
}


function generateKML()
{
	var kml = '';

	var kmlintro = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">\n';
	kmlintro += '<Document>\n<name>oom_' + mapID + '_controls</name>\n<open>1</open>\n';
	kmlintro += '<Style id="startfinish"><IconStyle><color>ffff00ff</color><scale>1.8</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/wht-stars.png</href></Icon><hotSpot x="0.5" y="0" xunits="fraction" yunits="fraction"/></IconStyle><LabelStyle><color>ffff00ff</color></LabelStyle><BalloonStyle></BalloonStyle><ListStyle></ListStyle></Style>\n';
	kmlintro += '<Style id="control"><IconStyle><color>ffff00ff</color><scale>1.0</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href></Icon><hotSpot x="0.5" y="0" xunits="fraction" yunits="fraction"/></IconStyle><LabelStyle><color>ffff00ff</color><scale>1.0</scale></LabelStyle><BalloonStyle></BalloonStyle><ListStyle></ListStyle></Style>\n';
	//kmlintro += '<Style id="donotcross"><IconStyle><color>ffff00ff</color><scale>1.0</scale><Icon><href>https://oomap.co.uk/images/kml_donotcross.png</href></Icon></IconStyle><BalloonStyle></BalloonStyle><ListStyle></ListStyle></Style>\n';
	var kmlheader = '<Folder>\n<name>Controls</name>\n<open>1</open>\n';
	var kmlfooter = '</Folder>\n</Document>\n</kml>';

	kml += kmlintro;

/*
	var angles = [];
	for (var i = 0 ; i < controlsCP.length; i++)
	{
		angles.push(controlsCP[i].angle);
	}

	var anglesUniq = Array.from(new Set(angles));

	console.log(angles);
	console.log(anglesUniq);

	for (var i = 0; i < anglesUniq.length; i++)
	{
		kml += getCrosspointStyleKML(anglesUniq[i]);
	}
*/

	kml += kmlheader;

	for (var i = 0; i < controlsSF.length; i++)
	{
		kml += getStartKML(controlsSF[i], i);
		kml += '\n';
	}

	for (var i = 0; i < controls.length; i++)
	{
		kml += getControlKML(controls[i]);
		kml += '\n';
	}
/*
	for (var i = 0; i < controlsCP.length; i++)
	{
		kml += getCrosspointKML(controlsCP[i]);
	}

	for (var i = 0; i < controlsX.length; i++)
	{
		kml += getDoNotCrossKML(controlsX[i]);
	}
*/
	for (var i = 0; i < controlsSF.length; i++)
	{
		kml += getFinishKML(controlsSF[i], i);
		kml += '\n';
	}

	kml += kmlfooter;

	// Data URI
	var kmlData = 'data:application/vnd.google-earth.kml+xml,' + encodeURIComponent(kml);

	var filename = 'oom_' + mapID + '.kml'

	// For IE
	if (window.navigator.msSaveOrOpenBlob) {
		var blob = new Blob([decodeURIComponent(encodeURI(kml))], {
			type: "application/vnd.google-earth.kml+xml;"
		});
		navigator.msSaveBlob(blob, filename);
	}
	else
	{
		$('#getkml')
			.attr({
				'download': filename,
				'href': kmlData
		});
	}

}

function loadMap(data)
{
	if (debug) { console.log('loadMap'); }
	state = "zoom";

	mapTitle = data.title;
	raceDescription = data.race_instructions;
	var $style = $("#" + data.style.split("-")[0]);
	var $styleL = $("[for=" + data.style.split("-")[0] + "]");
	var $scale = $("#" + data.scale);
	var $scaleL = $("[for=" + data.scale + "]");
	var $papersize = $("#" + data.papersize);
	var $papersizeL = $("[for=" + data.papersize + "]");
	var $paperorientation = $("#" + data.paperorientation);
	var $paperorientationL = $("[for=" + data.paperorientation + "]");
	var $contours = $("#" + data.style.split("-")[1] + "-" + data.style.split("-")[2]);
	var $contoursL = $("[for=" + data.style.split("-")[1] + "-" + data.style.split("-")[2] + "]");

	$('#eventdate_alternate').val(data.eventdate);
	$('#eventdate').val(data.eventdate);
	//$('#eventdate').datepicker("refresh");
	//TODO Implement loading of saved club.

	$style.trigger( "click" );
	//$styleL.trigger( "click" );
	$scale.trigger( "click" );
	//$scaleL.trigger( "click" );
	$papersize.trigger( "click" );
	//$papersizeL.trigger( "click" );
	$paperorientation.trigger( "click" );
	//$paperorientationL.trigger( "click" );
	$contours.trigger( "click" );
	//$contoursL.trigger( "click" );

	sheetCentreLL = ol.proj.transform([parseFloat(data.centre_lon), parseFloat(data.centre_lat)], "EPSG:4326", "EPSG:3857");
	olMap.getView().setCenter(sheetCentreLL);
	if (data.scale == "s7500" || data.scale == "s5000" || data.scale == "s4000")
	{
		olMap.getView().setZoom(15);
	}
	else
	{
		olMap.getView().setZoom(14);
	}
	if (debug) { console.log(sheetCentreLL); }
	controlsSF = [];
	controlsX = [];
	controlsCP = [];
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
		var controlLL = ol.proj.transform([parseFloat(control.wgs84lon), parseFloat(control.wgs84lat)], "EPSG:4326", "EPSG:3857");
		control.lat = controlLL[1];
		control.lon = controlLL[0];

		if (control.type == "c_startfinish")
		{
			controlsSF.push(control);
		}
		else if (control.type == "c_cross")
		{
			controlsX.push(control);
		}
		else if (control.type == "c_crossingpoint")
		{
			controlsCP.push(control);
		}
		else
		{
			controls.push(control);
		}
	}
	mapID = reqMapID;
	rebuildMapControls();
	handleZoom();
	updateUrl();
	olMap.getView().setRotation(parseFloat(data.rotation));
	handleRotate();

	$( "#getraster" ).button("enable");
	$( "#getworldfile" ).button("enable");
	$( "#getkmz" ).button("enable");
}

function rebuildMapSheet()
{
	if (debug) { console.log("rebuildMapSheet"); }

	if (!sheetCentreLL)
	{
		sheetCentreLL = olMap.getView().getCenter();
	}

	layerMapBorder.getSource().clear();
	layerMapCentre.getSource().clear();
	layerMapSheet.getSource().clear();
	layerMapTitle.getSource().clear();
	layerMapContent.getSource().clear();

	var papersize = "";

	papersize = $("#papersize :radio:checked").attr("id");

	if ($("#portrait").prop('checked')) {  paper_pieces[0] = 0.0001 * papersize.substring(6); paper_pieces[1] = 0.0001 * papersize.substring(1, 5); }
	else { paper_pieces[0] = 0.0001 * papersize.substring(1, 5); paper_pieces[1] = 0.0001 * papersize.substring(6); }
	paper = paper_pieces[0] + "," + paper_pieces[1];

	scale = -1;

	scale = $("#mapscale :radio:checked").val();
	scale = parseInt(scale);

	var centroidllWGS84 = ol.proj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326");
	var fudgeFactor = Math.cos(centroidllWGS84[1] * Math.PI/180);
	trueScale = scale / fudgeFactor;
	//console.log("True scale is " + trueScale);

	var paper_dlon = paper_pieces[0] * trueScale;
	var paper_dlat = paper_pieces[1] * trueScale;

	var map_nm_dlat = 0.014 * trueScale;
	var map_em_dlon = 0.008 * trueScale;
	var map_sm_dlat = 0.013 * trueScale;
	var map_wm_dlon = 0.008 * trueScale;

	var map_dlon = (paper_dlon - map_wm_dlon) - map_em_dlon;
	var map_dlat = (paper_dlat - map_nm_dlat) - map_sm_dlat;

	mapBound = [sheetCentreLL[0]-map_dlon/2,  sheetCentreLL[1]-map_dlat/2, sheetCentreLL[0]+map_dlon/2,  sheetCentreLL[1]+map_dlat/2];
	var paperBound = [
	(sheetCentreLL[0] - map_dlon/2) - map_wm_dlon,
	( sheetCentreLL[1] - map_dlat/2) - map_sm_dlat,
	(sheetCentreLL[0] + map_dlon/2) + map_em_dlon,
	( sheetCentreLL[1] + map_dlat/2) + map_nm_dlat];
	var paperWMBound = [	paperBound[0],	mapBound[1], 	mapBound[0],		mapBound[3]];
	var paperEMBound = [	mapBound[2],		mapBound[1], 	paperBound[2],	mapBound[3]];
	var paperNMBound = [	paperBound[0], 	mapBound[3],		paperBound[2], 	paperBound[3]];
	var paperSMBound = [	paperBound[0], 	paperBound[1], 	paperBound[2], 	mapBound[1]];

	var sheet = new ol.Feature({ geometry: ol.geom.Polygon.fromExtent(paperBound) });

	var titleSizeArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5, 9, 18, 36, 72, 144, 288];
	fontSizeFromArr = (titleSizeArr[parseInt(olMap.getView().getZoom())]*(trueScale/16000)).toFixed(0);

	if (mapStyleID.split("-")[0] == "blueprint")
	{
		mapTitleDisplay = mapTitle;
	}
	else
	{
		mapTitleDisplay = mapTitle.toUpperCase();
	}

	var title = new ol.Feature({
		geometry: new ol.geom.Point([ sheetCentreLL[0]-map_dlon/2, sheetCentreLL[1]+map_dlat/2+map_nm_dlat/2]),
		type: 'centre'
	 });
	title.set('fontSizeFromArr',  fontSizeFromArr);
	title.set('mapTitleDisplay',  mapTitleDisplay);
	title.set('xoff',  0);
	title.set('yoff',  0);

	var content = new ol.Feature({ geometry:  ol.geom.Polygon.fromExtent(mapBound) });
	var westMargin = new ol.Feature({ geometry:  ol.geom.Polygon.fromExtent(paperWMBound) });
	var eastMargin = new ol.Feature({ geometry:  ol.geom.Polygon.fromExtent(paperEMBound) });
	var northMargin = new ol.Feature({ geometry:  ol.geom.Polygon.fromExtent(paperNMBound) });
	var southMargin = new ol.Feature({ geometry:  ol.geom.Polygon.fromExtent(paperSMBound) });
	var centreMarker = new ol.Feature({
		geometry: new ol.geom.Point(sheetCentreLL),
		type: 'centre'
	 });

	var titleFeature = new ol.Feature({ geometry: new ol.geom.Point([mapBound[0], mapBound[3] + (0.002 * trueScale)])});

	layerMapBorder.getSource().addFeatures([westMargin, eastMargin, northMargin, southMargin, titleFeature]);
	layerMapSheet.getSource().addFeatures([sheet]);
	layerMapTitle.getSource().addFeatures([title]);
	layerMapContent.getSource().addFeatures([content]);
	layerMapCentre.getSource().addFeatures([centreMarker]);

	var angle = olMap.getView().getRotation();
  //if (angle != rotAngle) {
		layerMapBorder.getSource().getFeatures().forEach(function(f) {
			f.getGeometry().rotate(angle,sheetCentreLL);
  	});
		layerMapSheet.getSource().getFeatures()[0].getGeometry().rotate(angle,sheetCentreLL);
		layerMapTitle.getSource().getFeatures()[0].getGeometry().rotate(angle,sheetCentreLL);
		rotAngle = angle;
	//}

	wgs84Poly = content.getGeometry();
	wgs84Poly.rotate(angle, sheetCentreLL);
	wgs84Poly.transform("EPSG:3857", "EPSG:4326");


	//dragControl.activate();
	rebuildDescriptions();

	$( "#createmap" ).button("enable");
	$( "#getraster" ).button("disable");
	$( "#getworldfile" ).button("disable");
	$( "#getkmz" ).button("disable");
	$( "#deletesheet" ).button("enable");
	$( "#getPostboxes" ).button("enable");
	$( "#getOpenplaques" ).button("enable");
}

function rebuildMapControls()
{
	layerSF.getSource().clear();
	layerControls.getSource().clear();
	layerX.getSource().clear();
	layerCP.getSource().clear();

	for (var i = 0; i < controlsSF.length; i++)
	{
		var control = controlsSF[i];
		var controlSF = new ol.Feature({
			geometry: new ol.geom.Point([control.lon, control.lat]),
			id: control.id,
			type: 'start'
		});
		layerSF.getSource().addFeatures([controlSF]);
	}

	for (var i = 0; i < controlsX.length; i++)
	{
		var control = controlsX[i];
		var controlX = new ol.Feature({
			geometry: new ol.geom.Point([control.lon, control.lat]),
			id: control.id,
			type: 'X'
		});
		layerX.getSource().addFeatures([controlX]);
	}

	for (var i = 0; i < controlsCP.length; i++)
	{
		var control = controlsCP[i];
		var controlCP = new ol.Feature({
			geometry: new ol.geom.Point([control.lon, control.lat]),
			id: control.id,
			type: 'CP'
		});
		controlCP.set('angle', control.angle+rotAngle*180/Math.PI);
		layerCP.getSource().addFeatures([controlCP]);
	}

	for (var i = 0; i < controls.length; i++)
	{
		var control = controls[i];

		var controlPoint = new ol.Feature({
			geometry: new ol.geom.Point([control.lon, control.lat]),
			number: "" + control.number,
			angle: control.angle,
			id: control.id,
			type: 'control',
			score: control.score,
			description: control.description
		});
		//controlPoint.set('number', "" + control.number);
		controlPoint.set('xoff', 35 * Math.sin((control.angle*Math.PI)/180));
		controlPoint.set('yoff', -35 * Math.cos((control.angle*Math.PI)/180));

		layerControls.getSource().addFeatures([controlPoint]);
	}

	if (controlsX.length > 0 || controlsCP.length > 0)
	{
		$( "#deleteXs" ).button("enable");
	}

	if (controls.length > 0)
	{
		$( "#createclue" ).button("enable");
		$( "#getkml" ).button("enable");
	}
	else
	{
		$( "#createclue" ).button("disable");
		$( "#getkml" ).button("disable");
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

  contourSeparation = $("#contours :radio:checked").attr("id").split("-")[1].replace("p",".");

	for (var i = 0; i < controls.length; i++)
	{
		maxscore += controls[i].score;
	}

	$("#scalecaption").text('1:' + scale);
	$("#controlcaption").text('' + controlnum + " control" + (controlnum == 1 ? "" : "s"));
	$("#pointscaption").text('' + maxscore + " points");
	$("#contourcaption").text(contourSeparation + 'm contours');

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
					.append($('<span>').addClass('edit').attr('id', 'e' + control.id).text('Edit').on('click', function() { handleControlEditOptions(this.id); })
					  )
					.append($('<span>').addClass('delete').attr('id', 'd' + control.id).text('Delete').on('click', function() { handleControlDelete(this.id); })
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
		var zoom = olMap.getView().getZoom();
		if (zoom < 13)
		{
			zoom = 13;
		}
//		olMap.getView().setCenter(ol.proj.transform([result.easting, result.northing], "EPSG:27700", "EPSG:3857"));
	//above fails in Openlayers6 - so replace with proj4 equivalent.
		olMap.getView().setCenter(proj4("EPSG:27700", "EPSG:3857", [parseInt(result.easting), parseInt(result.northing)]));
		olMap.getView().setZoom(zoom);
	}
	else
	{
		$( "#postcode_error" ).dialog( "open" );
		$( "#postcode_error_text" ).html(result.message);
	}
}

//Deprecated in favour of pulling post boxes from OSM data
function handleGetPostboxesOld()
{
	var bounds = ol.proj.transformExtent([mapBound[0], mapBound[1], mapBound[2], mapBound[3]], "EPSG:3857", "EPSG:4326");
	//var url = 'http://dracos.co.uk/made/nearest-postbox/nearest.php?bounds=' + mapBound[0] + "%2C" + mapBound[1] + "%2C" + mapBound[2] + "%2C" + mapBound[3];
	var url = 'getpostboxes.php?bounds=' + bounds[0] + "%2C" + bounds[1] + "%2C" + bounds[2] + "%2C" + bounds[3];
    $.get(url, null, handleGetPostboxesCallback);
	$( "#postboxes_searching" ).dialog( "open" );

}

function handleGetPostboxes()
{
  var arr = wgs84Poly.flatCoordinates
	var bounds = ol.proj.transformExtent([mapBound[0], mapBound[1], mapBound[2], mapBound[3]], "EPSG:3857", "EPSG:4326");
	//var url = 'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];node[amenity=post_box](' + bounds[1] + "," + bounds[0] + "," + bounds[3] + "," + bounds[2]+");out;";
	var url = 'https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];node[amenity=post_box](poly:\"' + arr[1] + " " + arr[0] + " " + arr[3] + " " + arr[2] + " " + arr[5] + " " + arr[4] + " " + arr[7] + " " + arr[6]+"\");out;";
    $.get(url, null, handleGetOSMboxesCallback);
	$( "#postboxes_searching" ).dialog( "open" );

}

function handleGetOSMboxesCallback(result)
{
	var changed = false;
	$( "#postboxes_searching" ).dialog( "close" );
	if (result.elements.length > 0)
	{
		for(var i = 0; i < result.elements.length; i++)
		{
	  	var control = new Object();
	  	control.id = topID++;
	  	control.number = ++topNumber;
	  	control.angle = 45;
			control.score = 10;
			if (control.number >= 20) { control.score = 20; }
			if (control.number >= 30) { control.score = 30; }
			if (control.number >= 40) { control.score = 40; }
			if (control.number >= 50) {	control.score = 50;	}
			control.type = "c_regular";
			control.description = "Postbox " + result.elements[i].tags.ref;
			//control.description = "Postbox";

			control.lat = ol.proj.transform([result.elements[i].lon, result.elements[i].lat], "EPSG:4326", "EPSG:3857")[1];
			control.lon = ol.proj.transform([result.elements[i].lon, result.elements[i].lat], "EPSG:4326", "EPSG:3857")[0];

			control.wgs84lat = result.elements[i].lat;
			control.wgs84lon = result.elements[i].lon;
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
				changed = true;
			}
		}
		$( "#getPostboxes" ).button("disable");
		rebuildMapControls();
	  	rebuildDescriptions();

		if (changed)
		{
			if (mapID != "new")
			{
				mapID = "new";
				updateUrl();
			}

			$( "#getraster" ).button("disable");
			$( "#getworldfile" ).button("disable");
			$( "#getkmz" ).button("disable");
		}
	}
	else
	{
		$( "#postboxes_error" ).dialog( "open" );
		$( "#postboxes_error_text" ).html(result.message);
	}

}

function handleGetPostboxesCallback(result)
{
	var changed = false;
	$( "#postboxes_searching" ).dialog( "close" );
	if (result.length > 0)
	{
		for(var i = 0; i < result.length; i++)
		{
	  	var control = new Object();
	  	control.id = topID++;
	  	control.number = ++topNumber;
	  	control.angle = 45;
			control.score = 10;
			if (control.number >= 20) { control.score = 20; }
			if (control.number >= 30) { control.score = 30; }
			if (control.number >= 40) { control.score = 40; }
			if (control.number >= 50) {	control.score = 50;	}
			control.type = "c_regular";
			control.description = "Postbox " + result[i].ref;
			//control.description = "Postbox";

			control.lat = ol.proj.transform([result[i].lon, result[i].lat], "EPSG:4326", "EPSG:3857")[1];
			control.lon = ol.proj.transform([result[i].lon, result[i].lat], "EPSG:4326", "EPSG:3857")[0];

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
				changed = true;
			}
		}
		$( "#getPostboxes" ).button("disable");
		rebuildMapControls();
	  	rebuildDescriptions();

		if (changed)
		{
			if (mapID != "new")
			{
				mapID = "new";
				updateUrl();
			}

			$( "#getraster" ).button("disable");
			$( "#getworldfile" ).button("disable");
			$( "#getkmz" ).button("disable");
		}
	}
	else
	{
		$( "#postboxes_error" ).dialog( "open" );
		$( "#postboxes_error_text" ).html(result.message);
	}

}

function handleGetOpenplaques()
{
	var bounds = ol.proj.transformExtent([mapBound[0], mapBound[1], mapBound[2], mapBound[3]], "EPSG:3857", "EPSG:4326");
	var url = '/getopenplaques.php?bounds=[' + bounds[3] + "%2C" + bounds[0] + "]%2C[" + bounds[1] + "%2C" + bounds[2] + "]";
    $.get(url, null, handleGetOpenplaquesCallback);
	$( "#openplaques_searching" ).dialog( "open" );

}

function handleGetOpenplaquesCallback(result)
{
	var changed = false;
	$( "#openplaques_searching" ).dialog( "close" );
	if (result !== undefined && result.features !== undefined && result.features.length > 0)
	{
		for(var i = 0; i < result.features.length; i++)
		{
	  	var control = new Object();
	  	control.id = topID++;
	  	control.number = ++topNumber;
	  	control.angle = 45;
			control.score = 10;
			if (control.number >= 20) { control.score = 20; }
			if (control.number >= 30) { control.score = 30; }
			if (control.number >= 40) { control.score = 40; }
			if (control.number >= 50) {	control.score = 50;	}
			control.type = "c_regular";
			control.description = "Plaque: " + result.features[i].properties.inscription;

			control.lat = ol.proj.transform(result.features[i].geometry.coordinates, "EPSG:4326", "EPSG:3857")[1];
			control.lon = ol.proj.transform(result.features[i].geometry.coordinates, "EPSG:4326", "EPSG:3857")[0];

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
				changed = true;
			}
		}
		$( "#getOpenplaques" ).button("disable");
		rebuildMapControls();
	  	rebuildDescriptions();
		if (changed)
		{
			if (mapID != "new")
			{
				mapID = "new";
				updateUrl();
			}
			$( "#getraster" ).button("disable");
			$( "#getworldfile" ).button("disable");
			$( "#getkmz" ).button("disable");
		}
	}
	else
	{
		$( "#openplaques_error" ).dialog( "open" );
		$( "#openplaques_error_text" ).html("There are no plaques in this area recorded on the Open Plaques database, or a system error is preventing retrieval of plaques for this area. Open Plaques has a high number of plaques in the UK, USA and Germany. Check the Open Plaques website at https://openplaques.org/places/");
	}

}

function updateUrl()
{
	var lon = olMap.getView().getCenter()[0];
	var lat = olMap.getView().getCenter()[1];
	var change = false;
	var metres180deg = 20037508.34;
	while (lon < -metres180deg) { lon = lon + 2*metres180deg; change = true; }
	while (lon > metres180deg) { lon = lon - 2*metres180deg; change = true; }

	if (change)
	{
		olMap.getView().setCenter([lon, lat]);
	}

	if (debug) { console.log('updateUrl'); }
	var centre = ol.proj.transform(olMap.getView().getCenter(), "EPSG:3857", "EPSG:4326");
	window.location.hash = "/" + mapID + "/" + mapStyleID + "/" + olMap.getView().getZoom() + "/" + centre[0].toFixed(4) + "/" + centre[1].toFixed(4) + "/";

}

function rotateToMagDec(){
  if (magDec){
		olMap.getView().setRotation(-magDec * Math.PI/180);
		handleRotate();
	}
}

function setdecl(v, callback){
 console.log("declination found: "+v);
 magDec=v;
 callback();
}

function lookupMag(lat, lon) {
   var url=
"/wmm?lat="+lat+"&lon="+lon;
   $.get(url, function(response, status){
        setdecl(response, rotateToMagDec);
   });
}



$(document).ready(function()
{
	init();
});
