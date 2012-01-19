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

function changeHash(){
    if(polyString == "")
	$("#maplink").attr("value", document.location.href + "#" + $.param({city: currentCity, year: yearSlider,
					  mariguana: mjVisible, poppy: poppyVisible,
					  meth: methVisible, cocaine: cocaineVisible,
					  zoom: currentZoom, homtype : typeOfHomicide,
					  clat: centerLat, clong: centerLong}));
    else
	$("#maplink").attr("value", document.location.href + "#" + $.param({city: currentCity, year: yearSlider,
					  mariguana: mjVisible, poppy: poppyVisible,
					  meth: methVisible, cocaine: cocaineVisible,
					  zoom: currentZoom,  homtype : typeOfHomicide,
					  clat: centerLat, clong: centerLong,
					  polygon: polyString}));
clip.setText($("#maplink").value);
    
}
var style = [
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
	    { hue: "#00"},//"#F3F4EE" },
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
	    { visibility: "simplified" }
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
    } ,
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

var homrate = [], datehom = [], homtot = [], drhrate = [], drhtot =[], pop = [];
var commas = pv.Format.number();

var parameters;
var layer;
var vis, state;
var showingNames = false;
var overlay;
var crimes = [];
var currentCity = "All of México";
var currentZoom = 5;

var newShape, selectedShape;
var coords = new Array();

var mjlayer, poppylayer, lablayer, mjpathslayer, poppypathslayer, methpathslayer;
var mj_paths = 824024;
var poppy_paths = 2310300;
var meth_paths = 2308189;
var homicide_month = 2330644;
var dots;
var visChart;
var yearSlider = 2010;

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
var lastHomicideYear = 2010;
var mj_cartodb_gmapsv3, poppy_cartodb_gmapsv3;
var clip;

var allhomrate = [8.95197942275485, 9.23184006355124, 9.46473103713526, 7.94977018134357, 9.6630951101695, 9.25970202502102, 8.56889505511036, 8.89338951400641, 8.5842676571587, 8.93100856230274, 8.94401631339588, 9.30105647558102, 8.80956075241783, 8.98285938832678, 9.63585131069867, 9.75075275754199, 9.32936103029525, 10.1506718758386, 9.32008244195188, 9.05969334756777, 9.57199038043353, 9.37994082641078, 9.33559783264202, 10.2646246451506, 10.1063517356138, 8.58207203458146, 9.59909491025194, 9.36320488644368, 10.2983517863134, 9.55628796487184, 9.56828414779203, 10.3430826890478, 10.2869527541439, 9.33545905939933, 10.085611504537, 9.8400693674629, 6.72769561800063, 5.63932472764207, 8.73925162504158, 8.57408229517618, 10.3755049657733, 8.44455730157371, 8.25807645419554, 8.4595383638773, 7.81995254254779, 8.52970153668318, 7.78104700296879, 8.58853594908215, 9.76874873571384, 9.19719970572261, 11.05559290054, 10.3302058723488, 12.5233755512309, 13.2987446689771, 12.8359257097546, 14.0356319768753, 12.8850838338497, 15.9365544062214, 16.5298677248276, 16.5123727960418, 15.0052680179629, 16.0756237894177, 15.5053048930404, 14.5351556159937, 16.0141002040905, 18.0415816272955, 17.7201440896229, 19.3962256459605, 19.9582187467678, 18.9787817686577, 18.4533029663819, 23.9589799475932, 20.852415126022, 17.8595658891945, 21.4735820649442, 21.7403806241828, 23.0332023951144, 24.5690320276738, 24.6824434160587, 26.9596631630475, 23.002378740591, 25.904326969415, 19.8201457274886, 22.188582318216, null, null, null, null, null, null, null, null, null];

var alltothom = [ 772, 796, 817, 687, 836, 803, 745, 773, 746, 779, 781, 812, 770, 785, 843, 855, 819, 891, 819, 799, 844, 827, 824, 907, 894, 760, 852, 834, 917, 851, 853, 924, 918, 836, 904, 883, 603, 507, 787, 771, 935, 761, 745, 765, 708, 773, 706, 779, 887, 838, 1007, 942, 1144, 1218, 1174, 1284, 1180, 1464, 1517, 1520, 1380, 1480, 1429, 1341, 1479, 1668, 1640, 1797, 1851, 1762, 1715, 2229, 1942, 1665, 2004, 2031, 2154, 2300, 2313, 2529, 2160, 2435, 1865, 2090, null, null, null, null, null, null, null, null, null];

var alldrhrate = [null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0.69288, 1.6298,  1.182,  2.963, 2.7706, 3.4789, 2.2205, 1.7634, 3.3235, 2.8994,   3.25,   2.86, 3.0003, 3.3717, 3.6432, 3.8701,  3.229, 5.5513, 5.6111, 6.7217, 7.7205, 6.2593, 9.3844, 10.693, 8.7327, 6.3957, 8.0512, 6.7944, 6.9498, 6.9099, 9.9859, 9.1647,  9.522, 10.008, 9.7388, 8.9429, 11.438, 11.598, 10.599, 13.567, 13.381, 14.575, 15.959, 15.942, 15.862, 12.352, 15.605, 11.466, 12.144,14.3282934983883, 12.4595649065548, 15.0716991900523, 17.234429512364, 16.2556957209795, 15.1206731010366, 16.011833085477, 15.3848176210253, 14.4119197727349 ];

var alltotdrh = [null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,     62,    146,    106,    266,    249,    313,    200,    159,    300,    262,    294,    259,    272,    306,    331,    352,    294,    506,    512,    614,    706,    573,    860,    981,    802,    588,    741,    626,    641,    638,    923,    848,    882,    928,    904,    831,   1064,   1080,    988,   1266,   1250,   1363,   1494,   1494,   1488,   1160,   1467,   1079,   1144 , 1351, 1176, 1424, 1630, 1539, 1433, 1519, 1461, 1370];


var allpop =[103351444, 103467997, 103584560, 103701111, 103817668, 103934230, 104050755, 104167258, 104283794, 104400303, 104516804, 104633275, 104749831, 104866386, 104982940, 105099578, 105216209, 105332929, 105449711, 105566487, 105683349, 105800241, 105917159, 106034077, 106151065, 106268043, 106385030, 106501995, 106619003, 106736005, 106853014, 106970043, 107087106, 107204155, 107321207, 107438267, 107555401, 107672466, 107789550, 107906592, 108023658, 108140660, 108257656, 108374708, 108491707, 108608724, 108725728, 108842765, 108959707, 109076679, 109193601, 109310503, 109427366, 109544174, 109660965, 109777743, 109894512, 110011233, 110127923, 110244604, 110361241, 110477828, 110594407, 110710889, 110827332, 110943710, 111060045, 111176269, 111292497, 111408626, 111524750, 111640813, 111756839, 111872820, 111988768, 112104753, 112220609, 112336538, 112452400, 112568172, 112683998, 112799688, 112915416, 113031106, 113146761, 113262382, 113378059, 113493748, 113609410, 113725096, 113840807, 113956502, 114072242];






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
}


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




function queryData() {
    if(typeOfHomicide === "DWRH") {
	var queryCartodb = "SELECT drh, rate, lat, long, name FROM homicides_year_web WHERE year = " + yearSlider + "AND drh > 0 ORDER BY drh DESC";
	var homstr = "drh";
	var ratestr = "rate";
    } else { 
	var queryCartodb = "SELECT hom, homrate, rate, lat, long, name FROM homicides_year_web WHERE year = " + yearSlider + "AND hom > 0 ORDER BY hom DESC";
	var homstr = "hom";
	var ratestr = "homrate";
    }
    $.getJSON(baseURLCartodb + encodeURIComponent(queryCartodb) + "&callback=?",function(result){
		  violenceData = result;
		  overlay.crimes.splice(0, overlay.crimes.length);
		  var startTime = new Date();
		  for(var i =0; i<result.rows.length;i++) {
		      
		      
		      overlay.crimes.push({lat : result.rows[i]["lat"], lon: result.rows[i]["long"], latlon: new google.maps.LatLng(result.rows[i]["lat"], result.rows[i]["long"]), code: result.rows[i][homstr], name:result.rows[i]["name"], rate:result.rows[i][ratestr],
					   hom: result.rows[i]["hom"], homrate: result.rows[i]["homrate"]});
		      
		  }
		  
		  var endTime = new Date();
		  
		  // time difference in ms
		  //alert(endTime - startTime)
		  
		  
		  
		  
		  overlay.draw();
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
    
   
}


/* Convert the country borders to latlng.*/
      // mariguana_muns.forEach(function(c) {
// 				 c.borders.forEach(function(b) {
// 						       b.forEach(function(p, i) {
// 								     //b[i] = {lat: p[1], lng: p[0]};
// 								     b[i] = new google.maps.LatLng(p[1], p[0]);
// 								 });
// 	  });
// 			     });

// poppy_muns.forEach(function(c) {
// 		       c.borders.forEach(function(b) {
// 					     b.forEach(function(p, i) {
// 							   //b[i] = {lat: p[1], lng: p[0]};
// 							   b[i] = new google.maps.LatLng(p[1], p[0]);
// 						       });
// 					 });
// 		   });






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
    
    if((typeOfHomicide === "DWRH" & yearSlider <= 2006) | typeOfHomicide === "INEGI" & yearSlider > lastHomicideYear) {

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
    
    
 
    
    //.event("click", function() {alert();})
    vis = new pv.Panel().canvas(c)
	.left(-x.min)
	.top(-y.min);
    
    
    var methOpacity = pv.Scale.linear(1, 35.02).range(0,.8);
    
    var tempMarCoord, tempPoppyCoord,tempLabCoord, tempPointCoord;

    // vis.add(pv.Panel)
    // 	.data(mariguana_muns)
    
    //     .add(pv.Panel)
    // //.left(-x.min)
    // //	.top(-y.min)
    // 	.data(function(c) {return c.borders;})
    // 	.add(pv.Line)
    // 	.data(function(l) {return l;})
    // 	.left(function(c)  {tempMarCoord = projection.fromLatLngToDivPixel(c);
    // 			    return tempMarCoord.x;})
    // 	.top(function(c) {return tempMarCoord.y;})
    // 	.fillStyle("rgba(76, 187, 23, 0.5)")
    // 	.lineWidth(1)
    //     .visible(mjVisible)
    // 	.strokeStyle("black")
    // 	.title(function(d, b, c) {return c.name;})
    // 	.antialias(false)

    
    
    
    
    // 	.root.add(pv.Panel)
    // 	.data(poppy_muns)
    //     .add(pv.Panel)
    // //.left(-x.min)
    // //	.top(-y.min)
    // 	.data(function(c) {return c.borders;})
    // 	.add(pv.Line)
    // 	.data(function(l) {return l;})
    // 	.visible(false)
    // 	.left(function(c)  {tempPoppyCoord = projection.fromLatLngToDivPixel(c); return tempPoppyCoord.x;})
    // 	.top(function(c) {return tempPoppyCoord.y;})
    // 	.fillStyle("rgba(156, 138, 165, 0.5)")
    // 	.lineWidth(1)
    
    // 	.strokeStyle("black")
    // 	.title(function(d, b, c) {return c.name;})
    // 	.antialias(false)

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
	.fillStyle(function(d) {return "rgba(0, 0, 0, " + methOpacity(d.z) + ")";})
	.strokeStyle("rgba(0, 0, 0, 0)")
    
    
	.root.add(pv.Panel)
	.data(crimes)
        .add(pv.Dot)
	.visible(function(d) {return !(d.code < 20 & currentZoom < 7);})
	.strokeStyle(function(d) {if(d.code < 20 & currentZoom <7) return null;
				  if(d.name != currentCity)
				      return "#444";
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
	.radius(function(d) {return rad(d.code) * scaleFactor;})
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
					return pv.Behavior.tipsy({gravity: "s", fade: true, html: true }); },  function(){alert('click call back');}) 
        .event("mouseout", function() {return this.active(-1);})
	.anchor("center").add(pv.Label)
        .title(function(d) {return d.name;})
	.textStyle("black")
        .font(function(d) {  
		  
		  if(d.code < 70)
		      return rad(70) * scaleFactor * .75 + "px sans-serif";
		  else
		      return rad(d.code) * scaleFactor * .75 + "px sans-serif";})
	.text(function(x, d) {
		  if(typeOfHomicide == "INEGI"){
		      if (d.code > 250 & d.rate > 15) 
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





function showMJ(){
    switchLayers(mjpathslayer, mjVisible);
    switchCartoLayers(mj_cartodb_gmapsv3, mjVisible);
    mjVisible = !mjVisible;
    changeHash();
    overlay.draw();
}

function showPoppy(){
    switchLayers(poppypathslayer, poppyVisible);
    switchCartoLayers(poppy_cartodb_gmapsv3, poppyVisible);
    poppyVisible = !poppyVisible;
    changeHash();
    overlay.draw();
}

function showMeth(){
    switchLayers(methpathslayer, methVisible);
    methVisible = !methVisible;
    changeHash();
    overlay.draw();
}




var updateHomicidesTable = function(){   
    createTipsy(homtot, homrate, "#h2004", 0, 12);
    createTipsy(homtot, homrate, "#h2005", 12, 24);
    createTipsy(homtot, homrate, "#h2006", 24, 36);
    createTipsy(homtot, homrate, "#h2007", 36, 48);
    createTipsy(homtot, homrate, "#h2008", 48, 60);
    createTipsy(homtot, homrate, "#h2009", 60, 72);
    createTipsy(homtot, homrate, "#h2010", 72, 84);
    //document.getElementById('h2011').innerHTML = "NA";
    
    
    
    document.getElementById('n2004').innerHTML = "NA";
    document.getElementById('n2005').innerHTML = "NA";
    document.getElementById('n2006').innerHTML = "NA";
    createTipsy(drhtot, drhrate, "#n2007", 36, 48);
    createTipsy(drhtot, drhrate, "#n2008", 48, 60);
    createTipsy(drhtot, drhrate, "#n2009", 60, 72);
    createTipsy(drhtot, drhrate, "#n2010", 72, 84); 
    //createTipsy(drhtot, drhrate, "#n2011", 84, 93);  
		      
    var cityText = currentCity;
    switch(cityText) {
	case "José Azueta, Guerrero":
	  cityText = "Zihuatanejo, Guerrero";
	  break;
	case "San Luis Potosí-Soledad de Graciano Sánchez":
	  cityText = "San Luis Potosí" + metroArea;
	  break;
	case "Polygon":
	  cityText = custom_area;
	  break;
	case currentCity.indexOf(",") < 0 & (currentCity != "All of México" &
				       currentCity != "Polygon"):
	  cityText = currentCity + metroArea;
    }
   
    document.getElementById('city').innerHTML = cityText;   
};

var createTipsy = function(array, arrayRate, elementId, start, end) {
		      var hom12Month = eval(array.slice(start,end).join('+'));
		      var tipId = elementId.slice(1) + "tip";
		      var tipIdHash = "#" + tipId;
		      $(tipIdHash).tipsy("hide");
		      $(elementId).html('<a id="'+tipId+'" href="#" original-title="<table><tr><td>'+ rate_colon + '</td><td>' + Math.round(pv.mean(arrayRate.slice(start,end))) + '</td></tr><br/><tr><td>'+ population_colon +'</td><td> '+ commas(pv.mean(pop.slice(start,end))) + '">'+hom12Month+'</td></tr></table></a>');
		      
		      $(tipIdHash).tipsy({html: true, gravity: 'e' });
		  };

function queryHomicideMonth() {
    if(currentCity === "All of México") {
	homrate = [];datehom=[];homtot = [];drhrate = [];drhtot = [];pop = [];
	datehom = ["2004-01-15T00:00:00.000Z", "2004-02-15T00:00:00.000Z", "2004-03-15T00:00:00.000Z", "2004-04-15T00:00:00.000Z", "2004-05-15T00:00:00.000Z", "2004-06-15T00:00:00.000Z", "2004-07-15T00:00:00.000Z", "2004-08-15T00:00:00.000Z", "2004-09-15T00:00:00.000Z", "2004-10-15T00:00:00.000Z", "2004-11-15T00:00:00.000Z", "2004-12-15T00:00:00.000Z", "2005-01-15T00:00:00.000Z", "2005-02-15T00:00:00.000Z", "2005-03-15T00:00:00.000Z", "2005-04-15T00:00:00.000Z", "2005-05-15T00:00:00.000Z", "2005-06-15T00:00:00.000Z", "2005-07-15T00:00:00.000Z", "2005-08-15T00:00:00.000Z", "2005-09-15T00:00:00.000Z", "2005-10-15T00:00:00.000Z", "2005-11-15T00:00:00.000Z", "2005-12-15T00:00:00.000Z", "2006-01-15T00:00:00.000Z", "2006-02-15T00:00:00.000Z", "2006-03-15T00:00:00.000Z", "2006-04-15T00:00:00.000Z", "2006-05-15T00:00:00.000Z", "2006-06-15T00:00:00.000Z", "2006-07-15T00:00:00.000Z", "2006-08-15T00:00:00.000Z", "2006-09-15T00:00:00.000Z", "2006-10-15T00:00:00.000Z", "2006-11-15T00:00:00.000Z", "2006-12-15T00:00:00.000Z", "2007-01-15T00:00:00.000Z", "2007-02-15T00:00:00.000Z", "2007-03-15T00:00:00.000Z", "2007-04-15T00:00:00.000Z", "2007-05-15T00:00:00.000Z", "2007-06-15T00:00:00.000Z", "2007-07-15T00:00:00.000Z", "2007-08-15T00:00:00.000Z", "2007-09-15T00:00:00.000Z", "2007-10-15T00:00:00.000Z", "2007-11-15T00:00:00.000Z", "2007-12-15T00:00:00.000Z", "2008-01-15T00:00:00.000Z", "2008-02-15T00:00:00.000Z", "2008-03-15T00:00:00.000Z", "2008-04-15T00:00:00.000Z", "2008-05-15T00:00:00.000Z", "2008-06-15T00:00:00.000Z", "2008-07-15T00:00:00.000Z", "2008-08-15T00:00:00.000Z", "2008-09-15T00:00:00.000Z", "2008-10-15T00:00:00.000Z", "2008-11-15T00:00:00.000Z", "2008-12-15T00:00:00.000Z", "2009-01-15T00:00:00.000Z", "2009-02-15T00:00:00.000Z", "2009-03-15T00:00:00.000Z", "2009-04-15T00:00:00.000Z", "2009-05-15T00:00:00.000Z", "2009-06-15T00:00:00.000Z", "2009-07-15T00:00:00.000Z", "2009-08-15T00:00:00.000Z", "2009-09-15T00:00:00.000Z", "2009-10-15T00:00:00.000Z", "2009-11-15T00:00:00.000Z", "2009-12-15T00:00:00.000Z", "2010-01-15T00:00:00.000Z", "2010-02-15T00:00:00.000Z", "2010-03-15T00:00:00.000Z", "2010-04-15T00:00:00.000Z", "2010-05-15T00:00:00.000Z", "2010-06-15T00:00:00.000Z", "2010-07-15T00:00:00.000Z", "2010-08-15T00:00:00.000Z", "2010-09-15T00:00:00.000Z", "2010-10-15T00:00:00.000Z", "2010-11-15T00:00:00.000Z", "2010-12-15T00:00:00.000Z", "2011-01-15T00:00:00.000Z", "2011-02-15T00:00:00.000Z", "2011-03-15T00:00:00.000Z", "2011-04-15T00:00:00.000Z", "2011-05-15T00:00:00.000Z", "2011-06-15T00:00:00.000Z", "2011-07-15T00:00:00.000Z", "2011-08-15T00:00:00.000Z", "2011-09-15T00:00:00.000Z"];
	drhtot = alltotdrh;
	drhrate=alldrhrate;
	homtot = alltothom;
	homrate = allhomrate;
	pop = allpop;
	updateHomicidesTable();
	rerenderGraph();
        if(vis != null)
	    vis.root.render();
	return;
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
	    var queryCartodb = "SELECT sum(drh) AS drh, sum(hom) AS hom, ((SUM(drh)/SUM(pop))*100000 * 12) AS drhrate, SUM(hom)/SUM(pop) * 100000 * 12 AS homrate, date, sum(pop) AS pop FROM homicides_web WHERE ST_Intersects(the_geom,  GEOMETRYFROMTEXT('MULTIPOLYGON(((" + polyString +")))', 4326)) GROUP BY date ORDER BY date";
}
	else if(polyString != "")
	var queryCartodb = "SELECT sum(drh) AS drh, sum(hom) AS hom, ((SUM(drh)/SUM(pop))*100000 * 12) AS drhrate, SUM(hom)/SUM(pop) * 100000 * 12 AS homrate, date, sum(pop) AS pop FROM homicides_web WHERE ST_Intersects(the_geom,  GEOMETRYFROMTEXT('MULTIPOLYGON(((" + polyString +")))', 4326)) GROUP BY date ORDER BY date";
    }

    else
	var queryCartodb = "SELECT drh, hom, drhrate, homrate, date, pop FROM homicides_web WHERE name = " + "'" + currentCity + "'" + " ORDER BY date";
    
    $.getJSON(baseURLCartodb + encodeURIComponent(queryCartodb) + "&callback=?",function(result){
		  violenceData = result;
		  homrate = [];datehom=[];homtot = [];drhrate = [];drhtot = [];pop = [];
		  for(var i =0; i<result.rows.length;i++) {
		      datehom.push(result.rows[i]["date"]);
		      drhtot.push(result.rows[i]["drh"]);
		      drhrate.push(result.rows[i]["drhrate"]);
		      homtot.push(result.rows[i]["hom"]);
		      homrate.push(result.rows[i]["homrate"]);
		      pop.push(result.rows[i]["pop"]);
		  }
		  changeHash();
		  
		  
		  
		  updateHomicidesTable();
		  rerenderGraph();
                  if(vis != null)
		      vis.root.render();
		  
});
}




//var coords = [
 //   new google.maps.LatLng(25.774252, -80.190262)
 //   ,new google.maps.LatLng(18.466465, -66.118292)
 //   ,new google.maps.LatLng(32.321384, -64.75737)
 //   ,new google.maps.LatLng(25.774252, -80.190262)
//];



function getDataYear(response) {
    var numRows = response.getDataTable().getNumberOfRows();
    homrate = []; datehom = [];homtot = [];drhrate = [];drhtot = [];
    
  
    for(var i = 0; i < numRows; i++) {
	var hh = Number(response.getDataTable().getValue(i,0));
	if(i >= 72) 
	    hh = null; 
	homrate.push(hh);
	datehom.push(new Date(response.getDataTable().getValue(i,1)));
	homtot.push(Number(response.getDataTable().getValue(i,2)));
	drhtot.push(Number(response.getDataTable().getValue(i,3)));
	var dh = Number(response.getDataTable().getValue(i,4));
	if(isNaN(dh)) 
	    dh = null; 
	drhrate.push(dh);
    }
    
    changeHash();
    document.getElementById('h2004').innerHTML = eval(homtot.slice(0,12).join('+'));
    
    document.getElementById('h2005').innerHTML = eval(homtot.slice(12,24).join('+'));
    document.getElementById('h2006').innerHTML = eval(homtot.slice(24,36).join('+'));
    document.getElementById('h2007').innerHTML = eval(homtot.slice(36,48).join('+'));
    document.getElementById('h2008').innerHTML = eval(homtot.slice(48,60).join('+'));
    document.getElementById('h2009').innerHTML = eval(homtot.slice(60,72).join('+'));
    document.getElementById('h2010').innerHTML = "NA";
    
    document.getElementById('n2004').innerHTML = "NA";
    document.getElementById('n2005').innerHTML = "NA";
    document.getElementById('n2006').innerHTML = "NA";
    document.getElementById('n2007').innerHTML = eval(drhtot.slice(36,48).join('+'));
    document.getElementById('n2008').innerHTML = eval(drhtot.slice(48,60).join('+'));
    document.getElementById('n2009').innerHTML = eval(drhtot.slice(60,72).join('+'));
    document.getElementById('n2010').innerHTML = eval(drhtot.slice(72,84).join('+'));
    
    document.getElementById('city').innerHTML = currentCity;
    rerenderGraph();
}

//SELECT sum(drh) AS drhtotal, sum(hom) AS homtotal, date FROM homicides_web  
//WHERE ST_Intersects(the_geom,  GEOMETRYFROMTEXT('MULTIPOLYGON(((-105.5302734375 20.64677721903632, -97.4443359375 15.298608451631088, -93.181640625  20.81117922114718, -104.607421875 21.303306009492623, -105.5302734375 20.64677721903632)))', 4326)) GROUP BY date ORDER BY date


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





function toPath(path) {   
    for (var i = 0; i < path.length; i++){
	var coord=path.getAt(i);
	coords.push( coord.lng() + " " + coord.lat() );
	//	payload.coordinates[0][0].push([coord.lng(),coord.lat()])
    }
}

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


  //add the overlay canvas
  

function initialize() {
    initializeParameters();
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
    
    
    
    google.maps.event.addListener(map, "center_changed", function() {
				      var ctr = map.getCenter();
				      centerLat = ctr.lat();
				      centerLong = ctr.lng();
				      changeHash();
				  });
    
    google.maps.event.addListener(map, "zoom_changed", function() {
				      currentZoom = map.getZoom();
				      if (currentZoom >= 6)
					  scaleFactor = 1;
				      else
					  scaleFactor = .5;
				      if( currentZoom <= 4)
					  scaleFactor = .3;
				      changeHash();
				      
				      
				  });

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
				  queryData();
				  changeHash();
			      
			      });
    overlay = new Canvas(crimes, map);
    queryData();
    queryHomicideMonth();

    //Clipboard copying
    clip = new ZeroClipboard.Client();
    clip.setHandCursor( true );
    //clip.glue( 'd_clip_button', 'd_clip_container' );
    clip.glue( 'copy_button');
    clip.setText(document.location.href);
    $("#maplink").attr("value", document.location.href);
}

function initializeParameters() {

    //To speed up the code pre-convert the lat and longitudes of the 2d drug lab density estimate to google latlon objects
    lab_density = lab_density.map(function(d) {return {latlon: new google.maps.LatLng(d.y, d.x),
				     z : d.z};});

    parameters = $.deparam(document.location.hash);
    if(parameters["year"] != null){
	yearSlider = parameters["year"];
	changed = true;
    }
    transitionTable(2004, yearSlider);

    function changeTableColors(str, yearLast, yearCurrent) {
	var idTableLast = str + yearLast;
	var idTableCurrent = str + yearCurrent;
	$(idTableLast).css("background-color", "#F9F9F9");
	$(idTableCurrent).css("background-color", "#F6E493");
    }
    function transitionTable(yearLast, yearCurrent) {
	changeTableColors("#y",yearLast, yearCurrent);
	changeTableColors("#n",yearLast, yearCurrent);
	changeTableColors("#h",yearLast, yearCurrent);
    }
   
    $(function() {
	  $( "#slider" ).slider({
				    min: 2004,
				    max: 2010,
				    value: yearSlider,
				    stop: function(e, ui) {
					transitionTable(yearSlider, ui.value);
					yearSlider = ui.value;
					
					//crimes = [];
					queryData();
					changeHash();
					
					
					//vis.render();
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
    
}
//

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    //months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months;
}

var lastDate = "September 15, 2011";
var interHom = -1, interDRH = -1;var interDRH2 = -1;
var monthName = new Array ("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
var activeLine = false, activeChart;
var start = new Date(2004, 0, 1);
var end = new Date(lastDate);
var monthsLength = monthDiff(start, end)+1;
var data = pv.range(0, monthsLength, 1).map(function(i) {return ({					// Note #2
						     x: new Date(datehom[i]),
						     y: homrate[i],
						     z: drhrate[i],
						     homtot: homtot[i],
						     drhtot: drhtot[i]
						 }); });

var w = 360,
    h = 180;
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
    //.right(100)
	.top(17)
    
	.fillStyle("#dedede")
    ;
    
    
    
    
    /* X-axis ticks. */
    visChart.add(pv.Rule)
	.data(x.ticks())
    //.visible(function(d) d >= 0)
	.left(x)
	.strokeStyle(function(d) {return d ? "#fff" : "000";})
	.add(pv.Rule)
	.bottom(-5)
	.height(5)
	.strokeStyle("#000")
	.anchor("bottom").add(pv.Label)
	.bottom(6)
	.text(x.tickFormat);



/* Y-axis ticks. */
    visChart.add(pv.Rule)
	.data(function() {return y.ticks(3);})
	.bottom(y)
	.strokeStyle(function(d) {return d ? "#fff" : "000";})
	.anchor("left")
	.add(pv.Rule)
	.left(-4)
	.height(1)
	.strokeStyle("#000")
	.anchor("left")
	.add(pv.Label)
	.left(-1)
	.text(y.tickFormat);
    
    visChart.add(pv.Rule)
	.left(0);
    
    visChart.add(pv.Rule)
	.bottom(0);
    
    /* Y-axis label */
    visChart.add(pv.Label)
	.data([annual_rate])
	.left(-27)
	.bottom(h/2)
	.font("10pt Arial")
	.textAlign("center")
	.textAngle(-Math.PI/2);

    visChart.add(pv.Rule)
	.data(function() {return gethomicideData();})
	.left(function(d) {return x(d.x);})
	.bottom(-4)
	.lineWidth(5)
	.strokeStyle(function() {return (activeChart == this.index) ? "#efefef" : "transparent";});
    
    var line = visChart.add(pv.Line)
    
        .data(function() {return gethomicideData();})
    
        .bottom(function(d)  {return y(d.y);})
        .left(function(d)  {return x(d.x);})
        .lineWidth(2.5)
	.antialias(true)
        .strokeStyle("#004b62")
        .text(y.tickFormat)
        .text(function(d)  {return y(d);})
    //.strokeStyle(function() this.i() == this.index ? "red" : "#09F")
    //.event("mouseover", function(d) {this.i(this.index);})
    //.event("mouseout", function() this.i(-1))
	.visible(function(d) { if (d.y == null) { return false; } else 
			       { return true; } })
    //.title(function(d) this.i());
    //.event("mouseover", pv.Behavior.tipsy({gravity: "w", fade: true}))
    ;
    
    
    
    
    
    
    function getDRHData() {
    return data = pv.range(35, monthsLength, 1)
	    .map(function(i) {return ({
				  x: new Date(datehom[i]),
				  y: homrate[i],
				  z: drhrate[i],
				  homtot: homtot[i],
				  drhtot: drhtot[i]
			      });});
	
    }

    
    var line2 = visChart.add(pv.Line)
        .data(function() {return getDRHData();})
        .bottom(function(d)  {return y(d.z);})
	.event("point",  function(d) {this.active(this.index);return visChart;})
        .left(function(d)  {return x(d.x);})
        .visible(function(d) { if (d.x > new Date(2004,1,1) && d.x < new Date(2006,11,1)) { return false; } else 
			       { return true; } })
        .lineWidth(2.5)
	.antialias(true)
        .strokeStyle("#4eb4da");
    
    
    
    var homDot = line.add(pv.Dot)
	.visible(function(d) {return interDRH2 >= 0;})
	.data(function() {return [gethomicideData()[interDRH2]];})
	.fillStyle(function() {return line.strokeStyle();})
	.strokeStyle("#000")
	.size(20)
	.lineWidth(1);
    
    homDot.add(pv.Dot)
	.left(10)
	.top(10)
	.anchor("right").add(pv.Label).textStyle("#222")
	.text(function(d) {
		  if(d.y != null) 
		      return monthName[d.x.getMonth()] + " "+ d.x.getFullYear() + rate_chart + d.y.toFixed(0) +" (" + d.homtot + total_homicides_chart;});


    var drhDot = line2.add(pv.Dot)
	.visible(function(d) {return interDRH >= 0;})
	.data(function()  {return [gethomicideData()[interDRH]];})
	.fillStyle(function()  {return line2.strokeStyle();})
	.strokeStyle("#000")
	.size(20)
	.lineWidth(1);
    

    drhDot.add(pv.Dot)
	.left(10)
	.top(25)
	.anchor("right").add(pv.Label).textStyle("#222")
	.text(function(d) {if(d.z != null) return monthName[d.x.getMonth()] + " "+ d.x.getFullYear() + " rate: " + d.z.toFixed(0) +" (" + d.drhtot +" DW-R Homicides)";});

    
    
    
    visChart.add(pv.Bar)
	.fillStyle("rgba(0,0,0,.001)")
	.event("mouseout", function() {
		   interDRH = -1;
		   interDRH2 = -1;
		   return visChart;
	       })
	.event("mousemove", function(d) {
		   var mx2 = x.invert(visChart.mouse().x);
		   mx2 = new Date(mx2.getFullYear(), mx2.getMonth(), 15)
		   
		   interDRH = pv.search(gethomicideData().map(function(d) {return d.x;}), mx2);
		   //alert([gethomicideData()][0]);
		   interDRH = interDRH < 0 ? (-interDRH - 2) : interDRH;
		   interDRH2 = interDRH;
		   if((mx2.getFullYear() < 2006) | (mx2.getFullYear() <= 2006 & mx2.getMonth() < 11))
		       interDRH = -1;
		   if(mx2.getFullYear() > lastHomicideYear)
		       interDRH2 = -1;
        
		   return visChart;
	       });
    
    //var endHomDot = visChart.add(pv.Dot)
 //       .data(function() {return gethomicideData()})
    //.bottom(function(d) y(d.y))
//.fillStyle("#004b62")
    //.strokeStyle("#004b62")
//.left(function(d) x(d.x))
//.size(12)
//.visible(function(d) {return  this.index==0 | this.index == (12*6-1)})
//;

//var endDRHDot = visChart.add(pv.Dot)
  //      .data(function() {return gethomicideData()})
//.bottom(function(d) y(d.z))
//.fillStyle("#4eb4da")
//.strokeStyle("#4eb4da")
//.left(function(d) x(d.x))
//.size(12)
//.visible(function(d) {return  this.index==12*3-1 | this.index == (12*7-1)})
//;


    visChart.add(pv.Label)
	.textAlign("left")
	.text(function(d) {return total_homicides;})
	.left(15)
	.top(-4)
	.font("9pt sans-serif")
	.add(pv.Dot)
	.strokeStyle(null)
	.height(3)
	.fillStyle("#004b62")
	.size(15)
	.left(10)
	.top(-11)
    
	.add(pv.Label)
	.def("active", -1)
	.textAlign("left")
	.text(function(d) {return drug_war_homicides;})
	.left(125)
	.top(-4)
	.font("9pt sans-serif")
	.add(pv.Dot)
	.strokeStyle(null)
	.fillStyle("#4eb4da")
	.size(15)
	.left(120)
	.top(-11);
    
    
   

    getEvents = function() {
	var rangei = [];
	if(currentCity.indexOf("All of México") >= 0) {
	    rangei = [drug_war_date];
	    tip = [drug_war_text];
	}
	if(currentCity.indexOf("Veracruz") >= 0) {
	    rangei = [op_veracruz];
	    tip = [op_veracruz_text];
	}
	if(currentCity.indexOf("Juárez") >= 0) {
	    rangei = [op_chihuahua, op_reinforcements];
	    tip = [chihuahua_text, reinforcements_text];
	}
	if(currentCity.indexOf("Chihuahua") >= 0) {
	    rangei = [op_chihuahua];
	    tip = [chihuahua_text];
	}
	if(currentCity.indexOf("Nogales, ") >= 0) {
	    rangei = [mochomo_date];
	    tip = [mochomo_text];
	}
	if(currentCity.indexOf(", Michoacán") >= 0) {
	    rangei = [op_michoacan, op_michoacan2];
	    tip = [op_michoacan_text, op_michoacan2_text];
	}
	if(currentCity.indexOf("Culiacán") >= 0 ||
	   currentCity.indexOf("Navolato") >= 0) {
	    rangei = [op_marlin, op_culiacan];
	    tip = [op_marlin_text, op_culiacan_text];
	}
	if(currentCity.indexOf("Ahome, Sinaloa") >= 0 ||
	   currentCity.indexOf("El Fuerte, Sinaloa") >= 0 ||
	   currentCity.indexOf("Guasave, Sinaloa") >= 0 ||
	   currentCity.indexOf("Sinaloa, Sinaloa") >= 0 ||
	   currentCity.indexOf("Salvador Alvarado, Sinaloa") >= 0 ||
	   currentCity.indexOf("Mocorito, Sinaloa") >= 0 ||
	   currentCity.indexOf("El Fuerte, Sinaloa") >= 0 ||
	   currentCity.indexOf("Angostura, Sinaloa") >= 0) {
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
	    rangei = [op_guerrero, capture_barbie];
	    tip = [op_guerrero_text, capture_barbie_text];
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
	if(currentCity.indexOf(", Guerrero") >= 0) {
	    rangei = [mochomo_capture];
	    
	    tip = [mochomo_capture_text];
	}
        rangei = rangei.map(getIndex);
	return data = rangei
	    .map(function(i) {return ({
				  x: new Date(datehom[i]),
				  y: pv.max([homrate[i], drhrate[i]]),
				  max: pv.max(homrate.slice(i-12<0?0:i-12, i+3).concat(drhrate.slice(i-12<0?0:i-12, i+3)))
			      });});
    };
    
    var whiteDotLine = visChart.add(pv.Dot)
	.data(function() {return getEvents();})
	.bottom(function(d)  {return y(d.y);})
	.left(function(d)  {return x(d.x);})
	.size(10)
	.lineWidth(1)
	.antialias(true)
	.fillStyle("white")
	.strokeStyle("black");
    
    var dotOffset = 70;
    
    var dotLine = visChart.add(pv.Dot)
	.data(function() {return getEvents();})
    //.bottom(function(d) y(d.y))
	.bottom(function(d) {return (y(d.max) + dotOffset)  > h ? 180 : y(d.max) + dotOffset;})
	.left(function(d)  {return x(d.x);})
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
    .left(function(d) {return x(d.x);})
    .top(function(d) {return (y(d.max) + dotOffset)  > h ? 4 : h+4-(y(d.max) + dotOffset);})
    .bottom(function(d) {return y(d.y)+4;})
    .strokeStyle("#666")
 .textAlign("right")
    .text(function(d) {return tip[this.index] ;});




}


function gethomicideData() {
    return data = pv.range(0, monthsLength, 1)
	.map(function(i) {return ({
			      x: new Date(datehom[i]),
			      y: homrate[i],
			      z: drhrate[i],
			      homtot: homtot[i],
			      drhtot: drhtot[i]
			  });});

}


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

