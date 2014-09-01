var maxmindGeoIP		= 	require('maxmind');

/*
	Initialization with GeoIP Data
	Enabling Caching for improved performance!!
	
	The path has to be given relative to the scream-server.js location
*/
maxmindGeoIP.init('helpers/geoip-maxmind/GeoLiteCity.dat',{indexCache: true, checkForUpdates: true});	

exports.getCity = function(ipAddress){
	var location = maxmindGeoIP.getLocation(ipAddress);
	if(!location){
		return "-NA-";
	}
	return location.city;
}