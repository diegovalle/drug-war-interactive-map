/* Main program file
 * 
 * Author: Diego Valle-Jones
 */






// jQuery Deparam - v0.1.0 - 6/14/2011
// http://benalman.com/
// Copyright (c) 2011 Ben Alman; Licensed MIT, GPL

(function($) {
  // Creating an internal undef value is safer than using undefined, in case it
  // was ever overwritten.
  var undef;
  // A handy reference.
  var decode = decodeURIComponent;

  // Document $.deparam.
  var deparam = $.deparam = function(text, reviver) {
    // The object to be returned.
    var result = {};
    // Iterate over all key=value pairs.
    $.each(text.replace(/\+/g, ' ').split('&'), function(index, pair) {
      // The key=value pair.
      var kv = pair.split('=');
      // The key, URI-decoded.
      var key = decode(kv[0]);
      // Abort if there's no key.
      if ( !key ) { return; }
      // The value, URI-decoded. If value is missing, use empty string.
      var value = decode(kv[1] || '');
      // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
      // into its component parts.
      var keys = key.split('][');
      var last = keys.length - 1;
      // Used when key is complex.
      var i = 0;
      var current = result;

      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if ( keys[0].indexOf('[') >= 0 && /\]$/.test(keys[last]) ) {
        // Remove the trailing ] from the last keys part.
        keys[last] = keys[last].replace(/\]$/, '');
        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat(keys);
        // Since a key part was added, increment last.
        last++;
      } else {
        // Basic 'foo' style key.
        last = 0;
      }

      if ( $.isFunction(reviver) ) {
        // If a reviver function was passed, use that function.
        value = reviver(key, value);
      } else if ( reviver ) {
        // If true was passed, use the built-in $.deparam.reviver function.
        value = deparam.reviver(key, value);
      }

      if ( last ) {
        // Complex key, like 'a[]' or 'a[b][c]'. At this point, the keys array
        // might look like ['a', ''] (array) or ['a', 'b', 'c'] (object).
        for ( ; i <= last; i++ ) {
          // If the current key part was specified, use that value as the array
          // index or object key. If omitted, assume an array and use the
          // array's length (effectively an array push).
          key = keys[i] !== '' ? keys[i] : current.length;
          if ( i < last ) {
            // If not the last key part, update the reference to the current
            // object/array, creating it if it doesn't already exist AND there's
            // a next key. If the next key is non-numeric and not empty string,
            // create an object, otherwise create an array.
            current = current[key] = current[key] || (isNaN(keys[i + 1]) ? {} : []);
          } else {
            // If the last key part, set the value.
            current[key] = value;
          }
        }
      } else {
        // Simple key.
        if ( $.isArray(result[key]) ) {
          // If the key already exists, and is an array, push the new value onto
          // the array.
          result[key].push(value);
        } else if ( key in result ) {
          // If the key already exists, and is NOT an array, turn it into an
          // array, pushing the new value onto it.
          result[key] = [result[key], value];
        } else {
          // Otherwise, just set the value.
          result[key] = value;
        }
      }
    });

    return result;
  };

  // Default reviver function, used when true is passed as the second argument
  // to $.deparam. Don't like it? Pass your own!
  deparam.reviver = function(key, value) {
    var specials = {
      'true': true,
      'false': false,
      'null': null,
      'undefined': undef
    };

    return (+value + '') === value ? +value // Number
      : value in specials ? specials[value] // true, false, null, undefined
      : value; // String
  };

}(jQuery));


/*
 * Warning when using IE since url links have a size limit of 2083 characters
 * and when selecting polygons links can get pretty long
 */
function warningLongLinksIE(){
    if($("#maplink").val().length > 2083)
	$('#ielonglinks').html(label_warning_text);
    else
	$('#ielonglinks').html("");
}

/*
 * the http part of the url
 */
function getLocation() {
    return location.protocol+ '//' +location.host+location.pathname;
}

/*
 * The url that will take you to a map with all the options (city/polygon, mariguana, etc) as specified
 */
function getShareURL(){
   var ret;
    if(polyString == "")
	ret = getLocation() + "#" + $.param({city: currentCity, start: startDate, end: endDate,
					  mariguana: mjVisible, poppy: poppyVisible,
					  meth: methVisible, cocaine: cocaineVisible,
					  zoom: currentZoom, homtype : typeOfHomicide,
					  clat: centerLat, clong: centerLong,
					    statadj : statAdjust, names : show_place_names});
    else
	ret = getLocation() + "#" + $.param({city: currentCity, start: startDate, end: endDate,
					  mariguana: mjVisible, poppy: poppyVisible,
					  meth: methVisible, cocaine: cocaineVisible,
					  zoom: currentZoom,  homtype : typeOfHomicide,
					  clat: centerLat, clong: centerLong,
					     statadj : statAdjust, names : show_place_names,
					  polygon: polyString});
   return ret;
}

/*
 * Set the url for sharing the map on the modal dialog
 */
function changeHash(){
    hashChanged = true;
    $("#maplink").attr("value","");
    if(polyString == "")
	$("#maplink").attr("value", getShareURL());
    else
	$("#maplink").attr("value", getShareURL());
    warningLongLinksIE();
}



/*
 * Variable Names
 */

var hashChanged = true;
var statAdjust = false;
var show_place_names = false;

/*
 * All the google map options
 */
var style = [{
		 stylers: [{ saturation: -65 }, { gamma: 1.52 }, { "invert_lightness": true }] }, {
		     featureType: "administrative", stylers: [{ saturation: -95 }, { gamma: 2.26 }] }, {
			 featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] },
	     {
		 featureType: 'road.highway',
		 elementType: 'all',
		 stylers: [
		     { visibility: 'off' }
		 ]
	     } ,
	     {
		 featureType: "landscape",
		 elementType: "all",
		 stylers: [
		     
		     { hue: "#000"},//"#F3F4EE" },
		     { saturation: -100 }, //100
		     { lightness: 22 } //22
		     //{ gamma: 1.11 }
		 ]
	     },
	     {
		 featureType: "poi",
		 stylers: [
		     { visibility: "off" }
		 ]
	     },{
		 featureType: "water",
		 stylers: [
		     { visibility: "simplified" },
		     { hue: "#000000" },
		     { saturation: -100 },
		     { lightness: -30 }
		 ]
	     },
	     {
		 featureType: "administrative.country",
		 stylers: [
		     { visibility: "on" }
		 ]
	     },{
		 "featureType": "poi.attraction",
		 "stylers": [
		     { "invert_lightness": true },
		     { "visibility": "off" }
		 ]
	     },{
		 "featureType": "poi.park",
		 "stylers": [
		     { "visibility": "off" }
		 ]
	     },{
		 "featureType": "landscape.natural.terrain",
		 "stylers": [
		     { "visibility": "off" }
		 ]
	     },
	     {
		 featureType: 'road.arterial',
		 elementType: 'all',
		 stylers: [
		     { visibility: 'off' }
		 ]
	     } ,
	     
	     {
		 featureType: 'road.local',
		 elementType: 'all',
		 stylers: [
		     { visibility: 'off' }
		 ]
	     } ,
	     
	     {
		 featureType: 'poi',
		 elementType: 'all',
		 stylers: [
		     { visibility: 'off' }
		 ]
	     } ,
	     {
		 featureType: 'transit',
		 elementType: 'all',
		 stylers: [
		     { visibility: 'off' }
		 ]
	     }, {
		 "featureType": "administrative.country",
		 "elementType": "labels.text.fill",
		 "stylers": [
		     { "visibility": "off" }
		 ]
	     },
	     {
		 featureType: 'administrative.province',
		 elementType: 'all',
		 stylers: [
		     { visibility: 'off' }
		 ]
	     } ,
	     {featureType: 'administrative.locality',
	      elementType: 'all',
	      stylers: [
		  { visibility: 'off' }
	      ]
	     }
	    ];
/*
 * Modify these variables when updating the homicide data
 */
var adjustHom = false;
var existsSlider = false;
var startDate = "2012-01-15";
var endDate = "2012-12-15";
var numMonths = 12;
/*
 * Variables that hold the sql query from cartodb
 */
var homrate = [], datehom = [], homtot = [], drhrate = [], drhtot =[], pop = [];
var commas = pv.Format.number();
var homicides_text = total_homicides;
/*
 * Modify these variables when updating the homicide data
 */
var lastDWRHYear = 2011;
var lastDWRHMonth = 9; //September is the last month for which DWRH are available
var lastHomicideYear = 2012;

/*
 * Modify these variables when updating the homicide data
 */
//Chart sidebar variables
var lastDate = "December 15, 2012";
var interHom = -1, interDRH = -1;var interDRH2 = -1;
var activeLine = false, activeChart;
var startDWRH = new Date("December 15,2006");
var endDWRH = new Date("September 15,2011");
var start = new Date(2004, 0, 1);
var end = new Date(lastDate);
var endHomicides = new Date("December 15, 2012");
var monthsLength = monthDiff(start, end);

var dates = [];
var monthlyData = [], coordData = [];

var tip;

var shortUrl;
var shortUrlShare;

var showPartial11 = false;
var shownModalButton = false;
var parameters;
var layer;
var vis, state;
var showingNames = false;
var overlay;
var crimes = [];
var currentCity = all_of_mx_text;
var currentZoom = 5;

var newShape, selectedShape;

var mjlayer, poppylayer, lablayer, mjpathslayer, poppypathslayer, methpathslayer;
var mj_paths = 824024;
var poppy_paths = 2310300;
var meth_paths = 2308189;
var homicide_month = 2330644;
var dots;
var visChart;
var yearSlider;

var changed = false;
var drh_layer= 2243315;//2240298;//
var mjVisible = true, poppyVisible = false, methVisible = false, cocaineVisible = false;
var typeOfHomicide = "INEGI";
var scaleFactor = .5;
var centerLat = 23.61796278994952, centerLong = -95.02734375;

var violenceData;
var baseURLCartodb = "http://diegovalle.cartodb.com/api/v1/sql/?q=";
//var homicidesg20=new Array(2500);

var map;
var coords = [];
var polyString = "";
var myPolygon = null;
var lastModePoly = false;
var mj_cartodb_gmapsv3, poppy_cartodb_gmapsv3;



/*
 * Size of the chart
 */

var w = 360,
    h = 180;

/*
 * Monthly homicide, imputed homicide, and drug war homicide data for all of Mexico
 */
var alltothom = [ 773, 798, 819, 689, 837, 805, 745, 773, 746, 784, 781, 816, 771, 786, 843, 856, 819, 892, 820, 800, 845, 827, 825, 910, 894, 761, 854, 834, 917, 852, 855, 924, 920, 838, 906, 887, 606, 510, 788, 771, 938, 761, 746, 766, 710, 774, 710, 783, 893, 841, 1010, 945, 1150, 1224, 1178, 1288, 1186, 1479, 1524, 1531, 1384, 1482, 1432, 1345, 1482, 1673, 1645, 1801, 1865, 1772, 1719, 2240, 1960, 1676, 2021, 2046, 2165, 2322, 2301, 2568, 2191, 2489, 1934, 2327, 2231, 2032, 2250, 2451, 2599, 2343, 2428, 2341, 2104, 2284, 2025, 2151, 2190, 1895, 2195, 2244, 2393, 2241, 2151, 2228, 2396, 1893, 1815, 2153 ];


var alltothom_imp = [ 858, 888, 938, 793, 946, 899, 860, 886, 843, 899, 854, 919, 892, 892, 929, 960, 923, 992, 938, 902, 934, 913, 921, 1027, 986, 849, 957, 920, 1023, 945, 936, 1013, 1016, 950, 1006, 994, 744, 648, 893, 850, 1034, 866, 837, 886, 863, 951, 908, 1007, 1013, 933, 1137, 1039, 1254, 1349, 1278, 1399, 1308, 1579, 1666, 1639, 1485, 1611, 1541, 1472, 1585, 1778, 1778, 1924, 1991, 1897, 1837, 2361, 2072, 1814, 2217, 2229, 2440, 2526, 2474, 2737, 2319, 2645, 2078, 2487, 2476, 2274, 2486, 2772, 2872, 2616, 2659, 2606, 2357, 2576, 2251, 2395, 2358, 2035, 2361, 2382, 2544, 2393, 2332, 2400, 2563, 2089, 1981, 2356 ];

var alltotdrh =[ null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,     62,    146,    106,    266,    249,    313,    200,    159,    300,    262,    294,    259,    272,    306,    331,    352,    294,    506,    512,    614,    706,    573,    860,    981,    802,    588,    741,    626,    641,    638,    923,    848,    882,    928,    904,    831,   1064,   1080,    988,   1266,   1250,   1363,   1494,   1494,   1488,   1160,   1467,   1079,   1144,   1351,   1176,   1424,   1630,   1539,   1433,   1519,   1461,   1370, null, null, null, null, null, null,null, null, null,null, null, null,null, null, null ];


var allpop = [ 102608217, 102686957, 102765698, 102844414, 102923148, 103001867, 103080694, 103159742, 103238900, 103318121, 103397310, 103476448, 103555556, 103634387, 103713034, 103791370, 103869292, 103946866, 104020008, 104086329, 104148121, 104207607, 104267081, 104328830, 104395137, 104468267, 104550458, 104643975, 104751218, 104874282, 105016275, 105176763, 105353144, 105542827, 105743099, 105951314, 106164860, 106381067, 106597315, 106810896, 107019205, 107219602, 107415155, 107610651, 107806125, 108001573, 108197023, 108392442, 108587828, 108783231, 108978626, 109174082, 109369475, 109564921, 109760377, 109955784, 110151258, 110346659, 110542108, 110737541, 110932953, 111128422, 111323826, 111519279, 111714746, 111910231, 112108669, 112311957, 112518529, 112726660, 112934809, 113141337, 113344627, 113543028, 113734952, 113918737, 114092828, 114255551, 114406237, 114546278, 114677130, 114800288, 114917180, 115029219, 115137982, 115244847, 115351320, 115458847, 115568833, 115682857, 115798978, 115914465, 116029367, 116143808, 116257893, 116371688, 116485277, 116598807, 116712291, 116825938, 116939741, 117053786, 117168020, 117282259, 117396543, 117510785, 117625014, 117739255 ];




//rates per 100,000
var alldrhrate = alltotdrh.map(function(value, i) {return value/ allpop[i] * 100000 * 12;});
var allhomrate = alltothom.map(function(value, i) {return value/ allpop[i] * 100000 * 12;});
var allhomrate_imp = alltothom_imp.map(function(value, i) {return value/ allpop[i] * 100000 * 12;});


//Initialize a date array with all the months for the homicide data
for(var i = 2004; i <= lastHomicideYear; i++) {
    for(var j = 0; j < 12; j++){
	    dates.push(new Date(i, j, 15));
    }
}
//All the drug war data in a single structure
for(var i = 0; i < dates.length; i++){
    monthlyData.push({date: dates[i], drh: alltotdrh[i], drhrate: alldrhrate[i],
		    hom: alltothom[i], homrate: allhomrate[i], pop: allpop[i]});
}

/*
 * Toggle state borders and names on the Google Map
 */
function toggleProvince() {
  if(showingNames) {
      style.push( {
		      featureType: 'administrative.province',
		      elementType: 'all',
		      stylers: [
			  { visibility: 'off' }
		      ]
		  });style.push({
				    featureType: 'administrative.locality',
				    elementType: 'all',
				    stylers: [
					{ visibility: 'off' }
				    ]
				});}
   else {
       style.pop();style.pop();
   }
    var styledMapType = new google.maps.StyledMapType(style, {
							  map: map,
							  name: 'Styled Map'
  });
    map.mapTypes.set('map-style', styledMapType);
    map.setMapTypeId('map-style');
    showingNames = !showingNames;
    show_place_names = showingNames; 
    changeHash();
}

/*
 * Toggle the display of the incomplete drug war homicide data in the count tab
 */
function togglePartial(){
    showPartial11 = !showPartial11;
    if(showPartial11){	
	$('#n2011').css("visibility", "visible");
	$('#rn2011').css("visibility", "visible");
    }
    else{
	$('#n2011').css("visibility", "hidden");
	$('#rn2011').css("visibility", "hidden");
    }
}

/*
 * Toggle the statistical adjustement for total homicide data
 */
function toggleAdjust(){
    adjustHom = ! adjustHom;
    statAdjust = adjustHom;
    homicides_text = adjustHom === true ? adjusted_homicides : total_homicides;
    $("#adjust").css("background-color", function() {return  adjustHom === true ? "#7a250f":"white";}); //":"#004b62"
    $("#adjust span").css("color", function() {return  adjustHom === true ? "white":"rgb(64, 64, 64)";}); //":"#004b62"
    $("#homtableheader").html(homicides_text.replace(" ", "<br>"));
    $(".homheader").css("background-color", function() {return  adjustHom === true ? "#7a250f":"#004b62";}); //":"#004b62"
    if(currentCity === all_of_mx_text) {
        monthlyData = [];
	if(statAdjust)	
	    for(var i = 0; i < dates.length; i++){
		monthlyData.push({date: dates[i], drh: alltotdrh[i], drhrate: alldrhrate[i],
				  hom: alltothom_imp[i], homrate: allhomrate_imp[i], pop: allpop[i]});
	    }
	else
	    for(var i = 0; i < dates.length; i++){
		monthlyData.push({date: dates[i], drh: alltotdrh[i], drhrate: alldrhrate[i],
				  hom: alltothom[i], homrate: allhomrate[i], pop: allpop[i]});
	    }

    }
    

	  
    queryData();
    changeHash();
    queryHomicideMonth();
}

/*
 * Read the variable after the "#" in the url
 */
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


/*
 * Query data to show on top of the Google Map
 */
function queryData() {
    if(typeOfHomicide === "DWRH") {
        var maptitle = maptitle_dwrh;
	var homstr = "drh";
	var homstr_as = "drh";
	var ratestr = "rate";
    } else { 
	var maptitle = homicides_text + " ";
	if (!adjustHom) {
	    var homstr = "hom";
	    var homstr_as = "hom";
	    var ratestr = "homrate";
	}
	else {
	    var homstr = "hom_imputed";
	    var homstr_as = "hom";
	    var ratestr = "homrate";
	}
    }
var queryCartodb = "SELECT sum(" + homstr + ") AS " + homstr_as + ", MAX(ST_X(the_geom)) AS long, MAX(ST_Y(the_geom)) as lat, name, ROUND(AVG(pop)) as pop FROM homicides_web WHERE date BETWEEN DATE '" +startDate+"' AND DATE '"+ endDate +"' AND " + homstr + " > 0 GROUP BY name ORDER BY " + homstr_as + " DESC";

    $.getJSON(baseURLCartodb + encodeURIComponent(queryCartodb) + "&callback=?",function(result){
		  coordData = result;
		  //overlay.crimes.splice(0, overlay.crimes.length);
		  overlay.crimes.length = 0;
		  //var startTime = new Date();
		  for(var i =0; i<result.rows.length;i++) {
		      
		      
		      overlay.crimes[i] = ({lat : result.rows[i]["lat"], lon: result.rows[i]["long"], latlon: new google.maps.LatLng(result.rows[i]["lat"], result.rows[i]["long"]), code: result.rows[i][homstr_as], name:result.rows[i]["name"], rate:result.rows[i][homstr_as]/result.rows[i]["pop"] * 100000 * 12/numMonths, pop:result.rows[i]["pop"]
});
		      
		  }
		  
		  //var endTime = new Date();
		  
		  //alert(endTime-startTime);
		  overlay.draw();
		  $("#map-dates").
		      text(maptitle + monthName[new Date(startDate).getMonth()] + " "+ new Date(startDate).getFullYear() + " – " + monthName[new Date(endDate).getMonth()] + " "+ new Date(endDate).getFullYear());
	      });
}








//codes.forEach(function(x) colors[x.code] = colors[x.category]);
Canvas.prototype = pv.extend(google.maps.OverlayView);

function Canvas(crimes, map){
    this.crimes = crimes;
    this.map = map;
    this.setMap(map);
}





Canvas.prototype.onAdd = function() {
    
    
    this.getPanes().overlayLayer.style['zIndex'] = 104;
    this.canvas = document.createElement("div");
    this.canvas.setAttribute("class", "canvas");
    this.getPanes().overlayMouseTarget.appendChild(this.canvas);
    
   
};


/*
 * Draw the protovis chart on top of the Google Map
 */
Canvas.prototype.draw = function(){
    
    var projection = this.getProjection();
    
 function transform(d) {
     //d = new google.maps.LatLng(d.Lat, d.Long);
     d = projection.fromLatLngToDivPixel(d.latlon);
     return d3.select(this)
         .style("left", (d.x - padding) + "px")
         .style("top", (d.y - padding) + "px");
      }
    
    
    
    
    
    
    
    var m = this.map;
    var c = this.canvas;
    var r = 100;
    
    /*
     * Overlay "No Data" if the selected data is < Dec 2006 or > Sep 2010 since
     * there is no drug war homicide data for other dates
     */
    if((typeOfHomicide === "DWRH" & new Date(endDate) < new Date(2006,11,15)) | 
	(typeOfHomicide === "DWRH" & new Date(startDate) < new Date(2006,11,14)) |
       (typeOfHomicide === "DWRH" & new Date(startDate) > new Date(2011,09,14)) |
	(typeOfHomicide === "INEGI" & new Date(endDate).getFullYear() > lastHomicideYear) |
       (typeOfHomicide === "DWRH" & new Date(endDate).getFullYear() == 2011  & new Date(endDate).getMonth() > 8)) {

	//console.log(crimes)
	r = 200;
	overlay.crimes.splice(0, overlay.crimes.length);
	overlay.crimes.push({latlon : new google.maps.LatLng(23.5, -105.118408)});
	

	var city_pixels = this.crimes.map(function(d) {
					 return projection.fromLatLngToDivPixel(d.latlon);
				     });
	
	
        function x(p) {return p.x;}; function y(p) {return p.y;};
	var x = { min: pv.min(city_pixels, x) - r, max: pv.max(city_pixels, x) + r };
	var y = { min: pv.min(city_pixels, y) - r, max: pv.max(city_pixels, y) + r };
	c.style.width = (x.max - x.min) + "px";
	c.style.height = (y.max - y.min) + "px";
	c.style.left = x.min + "px";
	c.style.top = y.min + "px";
	
	
	vis = new pv.Panel().canvas(c)
	    .left(-x.min)
	    .top(-y.min)
	    .add(pv.Panel)
	    .data(crimes)
	    .add(pv.Label)
	//.radius(function() {return 50 * scaleFactor})
	    .left(function(d) {return projection.fromLatLngToDivPixel(d.latlon).x;})
	    .top(function(d) {return projection.fromLatLngToDivPixel(d.latlon).y;})
	    .textAlign("center")
	    .text("No Data").font("102px sans-serif")
	    .textAngle(-5.5);
	vis.root.render();
	//console.log(-x.min)
	//console.log(pixels)
	return;
    }			
    
    var city_pixels = this.crimes.map(function(d) {
				     return projection.fromLatLngToDivPixel(d.latlon);
				 });
    
    var druglab_pixels = lab_density.map(function(d) {
				     return projection.fromLatLngToDivPixel(d.latlon);
				 });
    

    function x(p) {return p.x;}; function y(p) {return p.y;};
    var x = { min: pv.min(city_pixels, x) - r, max: pv.max(city_pixels, x) + r };
    var y = { min: pv.min(city_pixels, y) - r, max: pv.max(city_pixels, y) + r };
    c.style.width = (x.max - x.min) + "px";
    c.style.height = (y.max - y.min) + "px";
    c.style.left = x.min + "px";
    c.style.top = y.min + "px";
    
    var rad = pv.Scale.root(0, 1600).range(0, 55);
    var colors = pv.Scale.linear(1,14,30,
				 45, 60, 75,
				 90,105, 129).range("#F5F5F5","#F5f5f5","#FCBBA1",
						    "#FC9272", "#FB6A4A", "#EF3B2C", 
						    "#CB181D", "#A50F15","#99000d");
    var oldStrokeStyle = null;
    
    
 
    /*
     * Big protovis visualization of the circles on top
     * of the Google Map
     */
    vis = new pv.Panel().canvas(c)
	.left(-x.min)
	.top(-y.min);
    
    
    var methOpacity = pv.Scale.linear(1, 35.02).range(0,.9);
    
    var tempMarCoord, tempPoppyCoord,tempLabCoord, tempPointCoord;
    
    
    
	vis.root.add(pv.Panel)
	.data(lab_density)
	.add(pv.Dot)
	.visible(methVisible)
	.left(function(d) {return druglab_pixels[this.parent.index].x;})
	.top(function(d) {return druglab_pixels[this.parent.index].y;})
	.radius(function() {
		    if(currentZoom < 7) 
			return 3;
		    else 
			if(currentZoom > 8)
			    return 5;
		    else
			return 7;})
	.fillStyle(function(d) {return "rgba(0, 0, 255, " + methOpacity(d.z) + ")";})
	.strokeStyle("rgba(0, 0, 255, 0)")
    
    
	.root.add(pv.Panel)
	.data(crimes)
        .add(pv.Dot)
/*
 * When zoomed out only show circles with more than 20 homicides
 */
	.visible(function(d) {return !(d.code < 20 & currentZoom < 7);})
	.strokeStyle(function(d) {if(d.code < 20 & currentZoom <7) return null;
				  if(d.name != currentCity)
				      return "#222";
                                  else
                                      return "black";})
	.fillStyle(function(d) {  if(d.code < 20 & currentZoom <7) 
                                     return null; 
				  return colors(d.rate > 130 ? 130 :d.rate).alpha(.9);
				  
			       })
	.size(990)
        .cursor("pointer")
	.left(function(d) {return city_pixels[this.parent.index].x;})
	.top(function(d) {return city_pixels[this.parent.index].y;})
	.radius(function(d) {return rad(d.code* 12/numMonths) * scaleFactor ;})
        .lineWidth(function(d) {if(d.name != currentCity)
			        	return 1;
                                else
                                        return 4;})
        .def("active", -1)
        .event("click", function(d) { 
	 
   
		   deleteSelectedShape();
		   
		   if(oldStrokeStyle) {
		       this.strokeStyle("black");
		       old.strokeStyle(function(d, f) {
					   
					   if(d.name == currentCity)
					       return "white";
		    else
			return this.index == this.active() ? "white" : "black";
					   
				       });}
		   old = this;
		   currentCity = d.name;

		   queryHomicideMonth(currentCity);
   
		   return this.root;})
    
        .event("mouseover", function() {this.active(this.index);
					return pv.Behavior.tipsy({gravity: "s", fade: true, html: true }); },  function(){}) 
        .event("mouseout", function() {return this.active(-1);})
	.anchor("center").add(pv.Label)
        .title(function(d) {return d.name;})
	.textStyle("black")
        .font(function(d) {  
		  /*
		   * Scale the circles depending on the zoom
		   */
		  if(d.code < 70)
		      return rad(70* 12/numMonths) * scaleFactor * .7 + "px arial";
		  else
		      return rad(d.code* 12/numMonths) * scaleFactor * .7 + "px arial";})
	.text(function(x, d) {
		  if(typeOfHomicide == "INEGI"){
		      if (d.code > 250 & d.rate >= 17.3) 
			  return d.code;
		  }
else {
    if (d.code > 250 & d.rate > 10) 
        return d.code;
}
                  if (currentZoom >= 7 && d.code > 20)
                      return d.code;
                  else 
                      return "";});
    
    
    
    
    vis.root.render();
    
};

 



function switchLayers(layer, visible) {
    if(visible) {
	layer.setMap(null);
    }
    else {
	layer.setMap(map);
    }
}

function switchCartoLayers(layer, visible) {
    if(visible) {
	layer.hide();
    }
    else {
	layer.show();
    }
}




/*
 * Show or hide the mariguana eradication areas and routes
 */
function showMJ(){
    switchLayers(mjpathslayer, mjVisible);
    switchCartoLayers(mj_cartodb_gmapsv3, mjVisible);
    mjVisible = !mjVisible;
    changeHash();
    overlay.draw();
}

/*
 * Show or hide the poppy eradication areas and routes
 */
function showPoppy(){
    switchLayers(poppypathslayer, poppyVisible);
    switchCartoLayers(poppy_cartodb_gmapsv3, poppyVisible);
    poppyVisible = !poppyVisible;
    changeHash();
    overlay.draw();
}

/*
 * Show or hide the meth eradication areas and routes
 */
function showMeth(){
    switchLayers(methpathslayer, methVisible);
    methVisible = !methVisible;
    changeHash();
    overlay.draw();
}

/*
 * Update the "Count" tab
 */
var updateHomicidesTable = function(){   
    createTipsy(homtot, homrate, "#h2004", 0, 12);
    createTipsy(homtot, homrate, "#h2005", 12, 24);
    createTipsy(homtot, homrate, "#h2006", 24, 36);
    createTipsy(homtot, homrate, "#h2007", 36, 48);
    createTipsy(homtot, homrate, "#h2008", 48, 60);
    createTipsy(homtot, homrate, "#h2009", 60, 72);
    createTipsy(homtot, homrate, "#h2010", 72, 84);
    createTipsy(homtot, homrate, "#h2011", 84, 96);
    createTipsy(homtot, homrate, "#h2012", 96, 108); 
    
    $('#n2012').text("NA");
    $('#n2004').text("NA");
    $('#n2005').text("NA");
    $('#n2006').text("NA");

    $('#rn2004').text("NA");
    $('#rn2005').text("NA");
    $('#rn2006').text("NA");
    $('#rn2012').text("NA");

    createTipsy(drhtot, drhrate, "#n2007", 36, 48);
    createTipsy(drhtot, drhrate, "#n2008", 48, 60);
    createTipsy(drhtot, drhrate, "#n2009", 60, 72);
    createTipsy(drhtot, drhrate, "#n2010", 72, 84); 
    createTipsy(drhtot, drhrate, "#n2011", 84, 93);
		      
    var cityText = currentCity;
    switch(cityText) {
    case "José Azueta, Gro":
	cityText = "Zihuatanejo, Gro";
	break;
    case "San Luis Potosí-Soledad de Graciano Sánchez":
	cityText = "San Luis Potosí" + metroArea;
	break;
    case "Valle de México":
	cityText = mexico_city + metroArea;
	break;
    case "Polygon":
	cityText = custom_area;
	break;
    }
    if(cityText.indexOf(",") < 0 & (cityText != all_of_mx_text &
cityText != custom_area))
	  cityText = currentCity + metroArea;
        
    $('#city').text(cityText);
       
};

/*
 * Create a tool tip for the military operations, drug lord captures/killings
 * displayed in the line chart
 */
var createTipsy = function(array, arrayRate, elementId, start, end) {
    function sumArray(previousValue, currentValue) {
	return previousValue + currentValue;
    }
		      var hom12Month = commas(array.slice(start,end).reduce(sumArray));
		      var tipId = elementId.slice(1) + "tip";
		      var tipIdHash = "#" + tipId;
    var rateElement = elementId.slice(0,1) + 'r' + elementId.slice(1);
		      $(tipIdHash).tipsy("hide");
		      $(elementId).html('<a class="gray-link" id="'+tipId+'" href="#" original-title="<table><tr><td>'+ rate_colon + '</td><td>' + Math.round(pv.mean(arrayRate.slice(start,end))) + '</td></tr><br/><tr><td>'+ population_colon +'</td><td> '+ commas(pv.mean(pop.slice(start,end))) + '">'+hom12Month+'</td></tr></table></a>');
		      $(rateElement).html(Math.round(pv.mean(arrayRate.slice(start,end))));
		      $(tipIdHash).tipsy({html: true, gravity: 'e' });
		  };

/*
 * Query Cartodb for the monthly homicide data
 * to show in the line chart
 */
function queryHomicideMonth() {		
    homrate = []; 
    drhrate = [];
    pop = [];
    drhtot = [];
    homtot = [];
    if(currentCity === all_of_mx_text) {
	 homrate = [];datehom=[];homtot = [];drhrate = [];drhtot = [];pop = [];
	// datehom = dates;
	// drhtot = alltotdrh;
	// drhrate=alldrhrate;
	// homtot = alltothom;
	// homrate = allhomrate;
	// pop = allpop;
	monthlyData.forEach(function(value, index) {
				homrate.push(value.homrate);
				homtot.push(value.hom);
				drhrate.push(value.drhrate);
				drhtot.push(value.drh);
				pop.push(value.pop);
			    });
	updateHomicidesTable();
	rerenderGraph();
        if(vis != null)
	    vis.root.render();
	return;
    }
    if(!adjustHom) {
	var homString = "hom";
	var homRateString = "homrate";
    }
    else {
	var homString = "hom_imputed";
	var homRateString = "hom_imputedrate";
    }
    if(currentCity == "Polygon"){
	if(newShape != null) {
	    
	    polyString = "";
	    var t = newShape.getPath().b.concat(newShape.getPath().b[0]);
	    for(var i=0;i<t.length;i++) {
		polyString = polyString + t[i].lng() + " " + t[i]. lat();
		if(i < (t.length-1))
		    polyString = polyString + ",";
	    }
	    currentCity = "Polygon";
	   
	    var queryCartodb = "SELECT sum(drh) AS drh, sum("+homString+") AS hom, ((SUM(drh)/SUM(pop))*100000 * 12) AS drhrate, SUM("+homString+")/SUM(pop) * 100000 * 12 AS homrate, date, sum(pop) AS pop FROM homicides_web WHERE ST_Intersects(the_geom,  GEOMETRYFROMTEXT('MULTIPOLYGON(((" + polyString +")))', 4326)) GROUP BY date ORDER BY date";
	}
	else if(polyString != "")
	var queryCartodb = "SELECT sum(drh) AS drh, sum(hom) AS hom, ((SUM(drh)/SUM(pop))*100000 * 12) AS drhrate, SUM(hom)/SUM(pop) * 100000 * 12 AS homrate, date, sum(pop) AS pop FROM homicides_web WHERE ST_Intersects(the_geom,  GEOMETRYFROMTEXT('MULTIPOLYGON(((" + polyString +")))', 4326)) GROUP BY date ORDER BY date";
    }
    
    else
	var queryCartodb = "SELECT drh, "+homString+" AS hom, drhrate, "+homRateString+" AS homrate, date, pop FROM homicides_web WHERE name = " + "'" + currentCity + "'" + " ORDER BY date";
    
    

    $.getJSON(baseURLCartodb + encodeURIComponent(queryCartodb) + "&callback=?",function(result){
		  monthlyData = result.rows;
		  homrate = [];datehom=[];homtot = [];drhrate = [];drhtot = [];pop = [];
		  for(var i =0; i< monthlyData.length;i++) {
		      monthlyData[i].date = new Date(monthlyData[i].date);
		      drhtot[i] = monthlyData[i]["drh"];
		      drhrate[i] = monthlyData[i]["drhrate"];
		      homtot[i] = monthlyData[i]["hom"];
		      homrate[i] = monthlyData[i]["homrate"];
		      pop[i] = monthlyData[i]["pop"];
		  }
		  changeHash();
		  
		  //var startTime = new Date();
		  updateHomicidesTable();
		  
		  rerenderGraph();
                  if(vis != null)
		      vis.root.render();
		  //var endTime = new Date();		  
		 // console.log(endTime-startTime);
		  
});
   
}


/*
 * The cool polygon selection tool
 */
var drawPolygon = function(id, poly){
    // Construct the polygon
		  // Note that we don't specify an array or arrays, but instead just
    // a simple array of LatLngs in the paths property
    var newPoly = new google.maps.Polygon({
					  paths: poly,
					  strokeColor: '#AA2143',
					  strokeOpacity: 1,
					  strokeWeight: 2,
					  fillColor: "#FF6600",
					  fillOpacity: 0.7
				      });
    newPoly.cartodb_id = id;
    newPoly.setMap(map);
    google.maps.event.addListener(newPoly, 'click', function() {
		  		      this.setEditable(true);
				      setSelection(this);
				  });
		  polys.push(newPoly);
};




/*
 * Convert the polygon to an array of coordinates
 */
function toPath(path) {   
    for (var i = 0; i < path.length; i++){
	var coord=path.getAt(i);
	coords.push( coord.lng() + " " + coord.lat() );
	//	payload.coordinates[0][0].push([coord.lng(),coord.lat()])
    }
}

/*
 * Deselect the polygon from the map
 */
var clearSelection = function() {
    if (selectedShape) {
	//storePoly(selectedShape.getPath(), selectedShape.cartodb_id);
          selectedShape.setEditable(false);
        selectedShape = null;
    }
};


function deleteSelectedShape() {
        if (selectedShape) {
            selectedShape.setMap(null);
        }
    polyString = "";
    if(myPolygon != null)
          myPolygon.setMap(null);
}


var setSelection = function(shape) {
    clearSelection();
    selectedShape = shape;
    shape.setEditable(false);
    
    //selectColor(shape.get('fillColor') || shape.get('strokeColor'));
};


/*
 * Read all the parameters in the url
 * and initialize the options
 * before creating the map and
 * line chart
 */
function initialize() {
    initializeParameters();
    //options for the Google Map
    var myOptions = {
	zoom: Number(currentZoom),
	minZoom: 4,
	center: new google.maps.LatLng(centerLat, centerLong),
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	streetViewControl: false,
	panControl: false
    };
    
    map = new google.maps.Map(document.getElementById("map"),
				  myOptions);
    //options for the cartodb layer
    mj_cartodb_gmapsv3 = new google.maps.CartoDBLayer({
      map_canvas: 'map',
      map: map,
      user_name:'diegovalle',
      table_name: 'mariguana',
      query: "SELECT * FROM mariguana",
      map_style: false,
      infowindow: false,
      auto_bound: false
    });
    poppy_cartodb_gmapsv3 = new google.maps.CartoDBLayer({
      map_canvas: 'map',
      map: map,
      user_name:'diegovalle',
      table_name: 'poppy',
      query: "SELECT * FROM poppy",
      map_style: false,
      infowindow: false,
      auto_bound: false
    });
    mj_cartodb_gmapsv3.show(); //#4CBB17
    poppy_cartodb_gmapsv3.hide(); //#9c8aa5
    var styledMapType = new google.maps.StyledMapType(style, {
							  map: map,
							  name: 'Styled Map'
						      });
    map.mapTypes.set('map-style', styledMapType);
    map.setMapTypeId('map-style');
    
    
    //change the url to share when the user moves the map
    google.maps.event.addListener(map, "center_changed", function() {
				      var ctr = map.getCenter();
				      centerLat = ctr.lat();
				      centerLong = ctr.lng();
				      changeHash();
				  });
    //change the url to share when the user zooms the map
    //also display the legend saying only showing places with more than 20 homicides
    google.maps.event.addListener(map, "zoom_changed", function() {
				      currentZoom = map.getZoom();
				      if (currentZoom >= 6)
					  scaleFactor = 1;
				      else
					  scaleFactor = .5;
				      if( currentZoom <= 4)
					  scaleFactor = .3;
				      if(currentZoom < 7)
					  $("#zoom-explaining").css("visibility", "visible");
				      else
					  $("#zoom-explaining").css("visibility", "hidden");
				      changeHash();
				      
				      
				  });

    //cartodb mariguana and poppy layers
    mjpathslayer = new google.maps.FusionTablesLayer(mj_paths, {
							 suppressInfoWindows: true,
							 clickable: false
						     });
    mjpathslayer.setQuery("SELECT 'geometry' FROM " + mj_paths);
    if(document.getElementById('mjCheck').checked == true)
	mjpathslayer.setMap(map);

   poppypathslayer = new google.maps.FusionTablesLayer(poppy_paths, {
							   suppressInfoWindows: true,
							   clickable: false
						       });
    poppypathslayer.setQuery("SELECT 'geometry' FROM " + poppy_paths);
    if(document.getElementById('poppyCheck').checked == true)
	poppypathslayer.setMap(map);

    methpathslayer = new google.maps.FusionTablesLayer(meth_paths, {
							   suppressInfoWindows: true,
							   clickable: false
						       });
    methpathslayer.setQuery("SELECT 'geometry' FROM " + meth_paths);
    if(document.getElementById('methCheck').checked == true)
	methpathslayer.setMap(map);
    //read the parameters after the # in the url
    if(parameters["mariguana"] != null){
	mjVisible = parameters["mariguana"] == "true";
	if(mjVisible){
	    $("#mjCheck").prop("checked", true);
	    //mj_cartodb_gmapsv3.hide();
	}
	else {
	    $("#mjCheck").prop("checked",false);
	    mjpathslayer.setMap(null);
	    mj_cartodb_gmapsv3.hide();
	}
    }
    if(parameters["poppy"] != null){
	poppyVisible = parameters["poppy"] == "true";
	if(poppyVisible) {
	    $("#poppyCheck").prop("checked", true);
	    poppypathslayer.setMap(map);
	    poppy_cartodb_gmapsv3.show();
	}
    }
    if(parameters["meth"] != null){
	methVisible = parameters["meth"] == "true";
	if(methVisible) {
	    $("#methCheck").prop("checked", true);
	    methpathslayer.setMap(map);
	}
    }
    if(parameters["cocaine"] != null){
	cocaineVisible = parameters["cocaine"] == "true";
	if(cocaineVisible) {
	    $("#cocaineCheck").prop("checked", true);
	    //cocainepathslayer.setMap(map);
	}
    }
    if(parameters["names"] != null){
	show_place_names = parameters["names"] == "true";
	if(show_place_names) {
	    style.pop();style.pop();
	    $("#nameCheck").prop("checked", true);
	    showingNames = true;
	}
    }
   if(parameters["statadj"] != null){
       adjustHom = parameters["statadj"] == "true";
       statAdjust = adjustHom;
	if(adjustHom) {
	    $("#statCheck").prop("checked", true);
	    homicides_text = adjustHom === true ? adjusted_homicides : total_homicides;
	    $("#adjust").css("background-color", function() {return  adjustHom === true ? "#7a250f":"white";}); //":"#004b62"
	    $("#adjust span").css("color", function() {return  adjustHom === true ? "white":"rgb(64, 64, 64)";}); //":"#004b62"
	    $("#homtableheader").html(homicides_text.replace(" ", "<br>"));
	    $(".homheader").css("background-color", function() {return  adjustHom === true ? "#7a250f":"#004b62";}); //":"#004b62"
	}
       if(currentCity === all_of_mx_text) {
        monthlyData = [];
	if(statAdjust)	
	    for(var i = 0; i < dates.length; i++){
		monthlyData.push({date: dates[i], drh: alltotdrh[i], drhrate: alldrhrate[i],
				  hom: alltothom_imp[i], homrate: allhomrate_imp[i], pop: allpop[i]});
	    }
	else
	    for(var i = 0; i < dates.length; i++){
		monthlyData.push({date: dates[i], drh: alltotdrh[i], drhrate: alldrhrate[i],
				  hom: alltothom[i], homrate: allhomrate[i], pop: allpop[i]});
	    }

    }
    }
    //for creating the polygon
    var drawingManager = new google.maps.drawing.DrawingManager({
		       drawingControl: true,
								    drawingControlOptions: {
									position: google.maps.ControlPosition.TOP_LEFT,
									drawingModes: [google.maps.drawing.OverlayType.POLYGON]
								},
								    polygonOptions: {
									fillColor: '#0099FF',
									fillOpacity: 0.7,
									strokeColor: '#AA2143',
									strokeWeight: 2,
									clickable: true,
									zIndex: 1,
									editable: true
								    }
								});
    
    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', function(){
				      
				      if(lastModePoly == false)
					  deleteSelectedShape();
				      else
					  lastModePoly = !lastModePoly;});
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
				      // Add an event listener that selects the newly-drawn shape when the user
				      // mouses down on it.
				      newShape = e.overlay;
				      newShape.type = e.type;
				      google.maps.event.addListener(newShape, 'click', function() {
									setSelection(this);
								    });
				      setSelection(newShape);
				      currentCity = "Polygon";
				      queryHomicideMonth();
				      //storePoly(newShape.getPath());
				      newShape.setEditable(false);
				      // Switch back to non-drawing mode after drawing a shape.
				      lastModePoly = true;
				      changeHash();
				      drawingManager.setDrawingMode(null);
				  });

    
    
    if(myPolygon != null)
	myPolygon.setMap(map);
    $('#mediumSelect').change(function() {
				  typeOfHomicide = (typeOfHomicide === "INEGI" ? "DWRH" : "INEGI");
				  if(typeOfHomicide == "DWRH")
				      $("#drug-explaining").css("visibility", "visible");
				  else
				      $("#drug-explaining").css("visibility", "hidden");
				  queryData();
				  changeHash();
			      
			      });
    overlay = new Canvas(crimes, map);
    queryData();
    queryHomicideMonth();

    //setup a warning if link length exceeds 2083 characters
    warningLongLinksIE();
    //Clipboard copying
    $("#maplink").attr("value", getLocation() );

    //get the bitly short link when showing the modal
    $('#modal-share').bind('show', function () {
                  if(hashChanged) {
			shortUrlShare = getShareURL();
			$.ajax({
				   url : baseShorten + encodeURIComponent(getShareURL()) + '&jsoncallback=?',//php script to shorten with bit.ly
				   dataType : "json",
				   type : "GET",
				   success : function(data) {
				       if(data.status_txt === "OK"){
					   $("a.twitter-share-button").attr("href", data.data.url);
                                           $("div.g-plusone").attr("data-href", data.data.url);
                                           shortUrlShare = data.data.url;
				       }
					   
				       else {
					   $("a.twitter-share-button").attr("href", getShareURL);
					   $("div.g-plusone").attr("data-href", getShareURL);
					   shortUrlShare = getShareURL();
					   
				       }
					   
				   },
				   error : function(xhr, error, message) {
				       //no success, fallback to the long url
				       shortUrlShare = getShareURL();
				   }
			       });
                        
			hashChanged = false;
		    } 
                  $('#like').html('<fb:like href="' + getShareURL() + '"  data-layout="button_count" show_faces="false" width="65" action="like" font="segoe ui" colorscheme="light" />');
		        if (typeof FB !== 'undefined') {
		                  FB.XFBML.parse(document.getElementById('like'));
			}
           

    });
    //You must supply an afterCopy function to supress the annoying dialog that pops up after copyn
    $('#modal-share').bind('shown', function () {
			    if(!shownModalButton) {
				shownModalButton = true;
				$('button#copy_button').zclip({
				  path:'http://diegovalle.github.com/drug-war-interactive-map/js/ZeroClipboard.swf',
				  copy:function(){return $('input#maplink').val();},
				  afterCopy: function() {return true;}
			     });
			  
			    }
		     
			   });
    $("#slider2004").click(function() {$("#dateSlider").dateRangeSlider("values", new Date(2004, 0, 15), new Date(2004, 11, 15));});
    $("#slider2005").click(function() {$("#dateSlider").dateRangeSlider("values", new Date(2005, 0, 15), new Date(2005, 11, 15));});
    $("#slider2006").click(function() {$("#dateSlider").dateRangeSlider("values", new Date(2006, 0, 15), new Date(2006, 11, 15));});
    $("#slider2007").click(function() {$("#dateSlider").dateRangeSlider("values", new Date(2007, 0, 15), new Date(2007, 11, 15));});
    $("#slider2008").click(function() {$("#dateSlider").dateRangeSlider("values", new Date(2008, 0, 15), new Date(2008, 11, 15));});
    $("#slider2009").click(function() {$("#dateSlider").dateRangeSlider("values", new Date(2009, 0, 15), new Date(2009, 11, 15));});
    $("#slider2010").click(function() {$("#dateSlider").dateRangeSlider("values", new Date(2010, 0, 15), new Date(2010, 11, 15));});
    $("#slider2011").click(function() {$("#dateSlider").dateRangeSlider("values", new Date(2011, 0, 15), new Date(2011, 11, 15));});
    $("#slider2012").click(function() {$("#dateSlider").dateRangeSlider("values", new Date(2012, 0, 15), new Date(2012, 11, 15));});
}



function initializeParameters() {

    //To speed up the code pre-convert the lat and longitudes of the 2d drug lab density estimate to google latlon objects
    lab_density = lab_density.map(function(d) {return {latlon: new google.maps.LatLng(d.y, d.x),
				     z : d.z};});

    parameters = $.deparam(document.location.hash);
    if(parameters["start"] != null){
        startDate = parameters["start"];
	changed = true;
    }
    if(parameters["end"] != null){
        endDate = parameters["end"];
	changed = true;
    }
    yearSlider = startDate.substring(0,4);
    numMonths = monthDiff(new Date(startDate), new Date(endDate));
    transitionTable(2004, yearSlider);

    function changeTableColors(str, yearLast, yearCurrent) {
	//var idTableLast = str + yearLast;
	//var idTableCurrent = str + yearCurrent;
	//$(idTableLast).css("background-color", "#F9F9F9");
	//$(idTableCurrent).css("background-color", "#F6E493");
    }
    function transitionTable(yearLast, yearCurrent) {
	//changeTableColors("#y",yearLast, yearCurrent);
	//changeTableColors("#n",yearLast, yearCurrent);
	//changeTableColors("#h",yearLast, yearCurrent);
    }
   
    $(function() {
	  $( "#slider" ).slider({
				    min: 2004,
				    max: 2012,
				    value: yearSlider,
				    stop: function(e, ui) {
					transitionTable(yearSlider, ui.value);
					yearSlider = ui.value;
					startDate =  ui.value + "-01-15";
					endDate =  ui.value + "-12-15";
					numMonths = monthDiff(new Date(startDate), new Date(endDate));
					queryData();
					changeHash();
					
				    },
				    slide: function(e, ui){
					document.getElementById('slider').firstChild.innerHTML = ui.value;
					
       
				    }
				});
      });



    if(parameters["#city"] != null){
	currentCity = parameters["#city"];
	changed = true;
    }
    
    
    
    if(parameters["zoom"] != null){
	currentZoom = parameters["zoom"];
	if(currentZoom < 7)
	    $("#zoom-explaining").css("visibility", "visible");
	else
	    $("#zoom-explaining").css("visibility", "hidden");
	if (currentZoom >= 6)
	    scaleFactor = 1;
	else
	    scaleFactor = .5;
	if( currentZoom <= 4)
	    scaleFactor = .3;
    }
    
    if(parameters["clat"] != null){
	centerLat = parameters["clat"];
    };
    if(parameters["clong"] != null){
	centerLong = parameters["clong"];
    };
    if(parameters["homtype"] != null){
	typeOfHomicide = parameters["homtype"];
	$('#mediumSelect').val(typeOfHomicide);
    };
    
    if(parameters["polygon"] != null){
	polyString = parameters["polygon"];
	var t = polyString.split(",");
	for(var i =0;i < t.length;i++) {
	    coords.push(new google.maps.LatLng(Number(t[i].split(" ")[1]), 
					       Number(t[i].split(" ")[0]) ));
	}
	
	myPolygon = new google.maps.Polygon({
						paths: coords,	
						strokeColor: '#AA2143',
						strokeOpacity: 1,
						strokeWeight: 2,
						fillColor: "#0099FF",
						fillOpacity: 0.7
						
					    });
    }
    if (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1 &&  $.browser.version < 536.26) {alert("This version of Safari doesn't display the map properly (I recommend you use Chrome instead, sorry)");}
}

//difference in months between two dates
//useful for the size of the circles on the map
//homicides/year
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months+2;
}

/*
 * The line chart to the right of the map
 * 
 * 
 */
var x = pv.Scale.linear(start, end.setMonth(end.getMonth()+1)).range(0, w),
y = pv.Scale.linear(0, pv.max(homrate.concat(drhrate))).range(0, h);

function createGraph(){
    //var x = pv.Scale.linear(data, function(d) d.x).range(0, w),
    //  y = pv.Scale.linear(0, pv.max(hom)).range(0, h);
    
    visChart = new pv.Panel()
	.width(w)
	.height(h)
	.bottom(20)
	.left(40)
	.top(17)
	.fillStyle("#e5e5e5");
    
    
    
    
    /* X-axis ticks. */
    visChart.add(pv.Rule)
	.data(x.ticks().slice(0, x.ticks().length- 1))
	.left(x)
	.strokeStyle(function(d) {return d ? "#fff" : "000";})
	.add(pv.Rule)
	.bottom(-4)
	.height(4)
	.strokeStyle("#888888")
	.anchor("bottom").add(pv.Label)
	.bottom(6)
	.text(x.tickFormat);



    /* Y-axis ticks. */
    visChart.add(pv.Rule)
	.data(function() {return y.ticks(3);})
	.bottom(y)
    .visible(function(d) {return d;})
	.strokeStyle("#fff")
	.anchor("left")
	.add(pv.Rule)
	.left(-3.8)
	.height(1)
        
	.strokeStyle("#888888")
	.anchor("left")
	.add(pv.Label)
	.left(-1)
	.text(y.tickFormat);
    
    
    /* Y-axis label */
    visChart.add(pv.Label)
	.data([annual_rate])
	.left(function() {
		  //The number of digits in a number, -27 is the farthest we allow the 
		  //y axis label to be
		  var left = ((Math.log(y.domain()[1] / 10) / Math.log(10)+1) * -8) -8;
		  return left < -27 ? -27 : left;
	      })
	.bottom(h/2)
	.font("10pt Arial")
	.textAlign("center")
	.textAngle(-Math.PI/2);

    //total homicide or adjusted homicide line
    var line = visChart.add(pv.Line)
        .data(function() {return monthlyData.slice(0, 
						   getIndex(endHomicides)+1);})
        .bottom(function(d)  {return y(d.homrate);})
        .left(function(d)  {return x(d.date);})
        .lineWidth(2.5)
	.antialias(true)
        .strokeStyle(function() {return  adjustHom === true ? "#7a250f":"#004b62";}) //
        .text(y.tickFormat)
        .text(function(d)  {return y(d);})
	;
    
    
    //drug war homicide line
    var line2 = visChart.add(pv.Line)
    //Slice the data at 35 (Dec 2006) cause otherwise we get a blank line because
    //of the null values in the drug war homicide data
        .data(function() {return monthlyData.slice(getIndex(startDWRH), 
						   getIndex(endDWRH) + 1);})
        .bottom(function(d)  {return y(d.drhrate);})
	.event("point",  function(d) {this.active(this.index);return visChart;})
        .left(function(d)  {return x(d.date);})
        .lineWidth(2.5)
	.antialias(true)
        .strokeStyle("#4eb4da");
    
    
    
    var homDot = line.add(pv.Dot)
	.visible(function(d) {return interDRH2 >= 0;})
	.data(function() {return [monthlyData[interDRH2]];})
	.fillStyle(function() {return line.strokeStyle();})
	.strokeStyle("#000")
	.size(20)
	.lineWidth(1);
    //A caption for when you hover above the homicide lines
    homDot.add(pv.Dot)
	.left(10)
	.top(10)
	.anchor("right")
	.add(pv.Label).textStyle("#222")
	.text(function(d) {
		  if(d.hom != null) 
		      return monthName[d.date.getMonth()] + " "+ d.date.getFullYear() + rate_chart + d.homrate.toFixed(0) +" (" + d.hom + total_homicides_chart;});


    var drhDot = line2.add(pv.Dot)
	.visible(function(d) {return interDRH >= 0;})
	.data(function()  {return [monthlyData[interDRH]];})
	.fillStyle(function()  {return line2.strokeStyle();})
	.strokeStyle("#000")
	.size(20)
	.lineWidth(1);
    
//A caption for when you hover above the homicide lines
    drhDot.add(pv.Dot)
	.left(10)
	.top(25)
	.anchor("right").add(pv.Label).textStyle("#222")
	.text(function(d) {if(d.drh != null) return monthName[d.date.getMonth()] + " "+ d.date.getFullYear() + rate_chart + d.drhrate.toFixed(0) +" (" + d.drh + dw_r_homicides_text;});

    
    
    
    visChart.add(pv.Bar)
	.fillStyle("rgba(0,0,0,.001)")
	.event("mouseout", function() {
		   interDRH = -1;
		   interDRH2 = -1;
		   return visChart;
	       })
	.event("mousemove", function(d) {
		   var mx2 = x.invert(visChart.mouse().x);
		   mx2 = new Date(mx2.getFullYear(), mx2.getMonth(), 15);
		   
		   interDRH = pv.search(monthlyData.map(function(d) {return d.date;}), mx2);
		   //alert([gethomicideData()][0]);
		   interDRH = interDRH < 0 ? (-interDRH - 2) : interDRH;
		   interDRH2 = interDRH;
		   if((mx2.getFullYear() < 2006) | (mx2.getFullYear() <= 2006 & mx2.getMonth() < 11) | (mx2 > endDWRH))
		       interDRH = -1;
		   if(mx2.getFullYear() > lastHomicideYear)
		       interDRH2 = -1;
        
		   return visChart;
	       });
    
    

    visChart.add(pv.Label)
	.textAlign("left")
	.text(function(d) {return homicides_text;})
	.left(15)
	.top(-4)
	.font("9pt sans-serif")
	.add(pv.Dot)
	.strokeStyle(null)
	.height(3)
	.fillStyle(function() {return  adjustHom === true ? "#7a250f":"#004b62";})
	.size(15)
	.left(10)
	.top(-11)
    
	.add(pv.Label)
	.def("active", -1)
	.textAlign("left")
	.text(function(d) {return drug_war_homicides;})
	.left(150)
	.top(-4)
	.font("9pt sans-serif")
	.add(pv.Dot)
	.strokeStyle(null)
	.fillStyle("#4eb4da")
	.size(15)
	.left(147)
	.top(-11);
    
    
   
    //list of important events to create tooltips for
    getEvents = function() {
	var rangei = [];
	if(currentCity.indexOf(all_of_mx_text) >= 0) {
	    rangei = [drug_war_date];
	    tip = [drug_war_text];
	}
	if(currentCity.indexOf("Veracruz") >= 0) {
	    rangei = [op_veracruz];
	    tip = [op_veracruz_text];
	}
	if(currentCity.indexOf("Juárez") >= 0) {
	    rangei = [op_chihuahua, op_reinforcements, new_governor];
	    tip = [chihuahua_text, reinforcements_text, new_governor_text];
	}
	if(currentCity.indexOf("Chihuahua") >= 0) {
	    rangei = [op_chihuahua, new_governor];
	    tip = [chihuahua_text, new_governor_text];
	}
	if(currentCity.indexOf("Nogales, ") >= 0) {
	    rangei = [mochomo_date];
	    tip = [mochomo_text];
	}
	if(currentCity.indexOf(", Mich") >= 0) {
	    rangei = [op_michoacan, op_michoacan2];
	    tip = [op_michoacan_text, op_michoacan2_text];
	}
	if(currentCity.indexOf("Culiacán") >= 0 ||
	   currentCity.indexOf("Navolato") >= 0) {
	    rangei = [op_marlin, op_culiacan];
	    tip = [op_marlin_text, op_culiacan_text];
	}
	if(currentCity.indexOf("Ahome, Sin") >= 0 ||
	   currentCity.indexOf("El Fuerte, Sin") >= 0 ||
	   currentCity.indexOf("Guasave, Sin") >= 0 ||
	   currentCity.indexOf("Sinaloa, Sin") >= 0 ||
	   currentCity.indexOf("Salvador Alvarado, Sin") >= 0 ||
	   currentCity.indexOf("Mocorito, Sin") >= 0 ||
	   currentCity.indexOf("El Fuerte, Sin") >= 0 ||
	   currentCity.indexOf("Angostura, Sin") >= 0) {
	    rangei = [abl_date];
	    tip = [abl_text];
	}
	if(currentCity.indexOf("Mazatlán") >= 0 ||
	   currentCity.indexOf("Salvador Alvarado") >= 0) {
	    rangei = [op_culiacan2];
	    tip = [op_culiacan2_text];
	}
	if(currentCity.indexOf("Durango") >=0) {
	    rangei = [op_tri_dor];
	    tip = [tri_dor_text];
	}
	if(currentCity == "Nuevo Laredo") {
	    rangei = [awb, op_mx_secure, zetas_vs_cdg];
	    tip = [awb_text, op_mx_secure_text, zetas_vs_cdg_text];
	}
	if(currentCity == "Monterrey") {
	    rangei = [awb, op_nl_tam,
                      zetas_vs_cdg];
	    tip = [awb_text, op_nl_tam_text, 
		   zetas_vs_cdg_text];
	}
	if(currentCity == "La Laguna") {
	    rangei = [op_la_laguna, zetas_vs_cdg];
	    tip = [op_la_laguna_text, zetas_vs_cdg_text];
	}
	if(currentCity == "Tijuana") {
	    rangei = [op_tijuana, jail_riots, teo_date];
	    tip = [op_tijuana_text, jail_riots_text, teo_text];
	}
	if(currentCity == "Acapulco") {
	    rangei = [op_guerrero, capture_barbie, op_guerrero11];
	    tip = [op_guerrero_text, capture_barbie_text, op_guerrero11_text];
	}
	if(currentCity.indexOf("Tamaulipas") >= 0 || currentCity.indexOf("Nuevo León") >= 0
	   || currentCity.indexOf("Tampico") >= 0 || currentCity.indexOf("Reynosa") >= 0
	   || currentCity.indexOf("Matamoros") >= 0
	   || currentCity.indexOf("Ciudad Valles") >= 0) {
	    rangei = [zetas_vs_cdg];
	    tip = [zetas_vs_cdg_text];
	}
	if(currentCity.indexOf("Jalisco") >= 0 || currentCity.indexOf("Nayarit") >= 0
	   || currentCity.indexOf("Colima") >= 0
	   || currentCity.indexOf("Tepic") >= 0
	   || currentCity.indexOf("Guadalajara") >= 0
	   || currentCity.indexOf("Colima-Villa de Alvarez") >= 0
	   || currentCity.indexOf("Tecomán") >= 0
	   || currentCity.indexOf("Puerto Vallarta") >= 0) {
	    rangei = [mochomo_capture, nacho_kidnapping];
	    tip = [mochomo_capture_text, nacho_kidnapping_text];
	}
	if(currentCity.indexOf("Cuernavaca") >= 0) {
	    rangei = [mochomo_capture, abl_killed];
	    tip = [mochomo_capture_text, abl_killed_text];
	}
	if(currentCity.indexOf(", Gro") >= 0) {
	    rangei = [mochomo_capture];
	    
	    tip = [mochomo_capture_text];
	}
	// if(currentCity.indexOf("Valle de México") >= 0) {
	//     rangei = [mistake_df];
	    
	//     tip = [mistake_df_text];
	// }
        rangei = rangei.map(getIndex);
	return rangei
	    .map(function(i) {
		     return ({
			date: new Date(monthlyData[i].date),
			max: pv.max([monthlyData[i].homrate, 
				     monthlyData[i].drhrate]),
			max12: pv.max(
			    homrate.slice(
				  i - 12 < 0 ? 0 : i - 12, i + 3)
				.concat(drhrate.slice(i - 12 < 0 ? 0 : i - 12, i + 3)))
			    });
		 });
    };
    
 

    var whiteDotLine = visChart.add(pv.Dot)
	.data(function() {return getEvents();})
	.bottom(function(d)  {return y(d.max);})
	.left(function(d)  {return x(d.date);})
	.size(10)
	.lineWidth(1)
	.antialias(true)
	.fillStyle("white")
	.strokeStyle("black");
    
    var dotOffset = 70;
    
    var dotLine = visChart.add(pv.Dot)
	.data(function() {return getEvents();})
    //.bottom(function(d) y(d.y))
	.bottom(function(d) {return (y(d.max12) + dotOffset)  > h ? 180 : y(d.max12) + dotOffset;})
	.left(function(d)  {return x(d.date);})
	.fillStyle("black")
	.strokeStyle(null)
    //.event("mousemove", function(d) {activeLine=true;return visChart})
	.event("mouseover", function() {
		   pv.Behavior.tipsy("disable").apply(this, arguments); 
		   pv.Behavior.tipsy({gravity: "e", fade: true, html: true}).apply(this, arguments); 
		   activeLine=true; 
		   return visChart;
	       }) 
	.event("mouseout", function() {activeLine = false;return visChart;}) 
	.textAlign("right")
	.text(function(d) {return tip[this.index]; }); 
    
    visChart.add(pv.Rule)
    .data(function() {return getEvents();})
    .left(function(d) {return x(d.date);})
    .top(function(d) {return (y(d.max12) + dotOffset)  > h ? 4 : h+4-(y(d.max12) + dotOffset);})
    .bottom(function(d) {return y(d.max)+4;})
    .strokeStyle("#666")
 .textAlign("right")
    .text(function(d) {return tip[this.index] ;});




}



/*
 * 
 * Redraw the line chart
 */
function rerenderGraph() {
    $('div[style^="position: absolute; width: 9px;"]').remove();
    $(".tipsy-e").remove();
    if (visChart == null)
        createGraph();
    y.domain(0, pv.max(homrate.concat(drhrate))).nice();	  
    visChart.render();
   
}



function getIndex(idx) {
    idx = new Date(idx);
    return ((idx.getYear() - 104) * 12) + idx.getMonth();
}

/* Converts homtot, drhtot to a nicely formatted csv file*/
function convertToCSV(){
    
    if(!statAdjust)
	var line = csvHeaders + '\r\n';
    else
	var line = csvHeadersImp + '\r\n';

    for (var i = 0; i < homtot.length; i++) {
        var hom = monthlyData[i].hom == null ? "NA" : monthlyData[i].hom;
	var drh =  monthlyData[i].drh == null ? "NA" : monthlyData[i].drh;
        line += (monthlyData[i].date).getFullYear() + "-" + monthName[monthlyData[i].date.getMonth()] + "," + hom + "," + drh + "," + monthlyData[i].pop + '\r\n';
    }
    if(currentCity != "Polygon")
	line += location_text + currentCity;
    else
        line += all_municipalities_text + polyString.replace(/,/g, "/").replace(/ /g, ":");
    return Base64.encode(line);
}

//http://stackoverflow.com/questions/246801/how-can-you-encode-to-base64-using-javascript
var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

};







