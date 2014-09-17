
var	uuidHelper	= 	require('../../helpers/uuid-gen/uuid-gen.js');
var	geoIPHelper	= 	require('../../helpers/geoip-maxmind/geoip-maxmind.js');

exports.getCommonHeaders = function(req,callback){
	var commonHeaders = {};
	
	var uuid			= uuidHelper.UUIDv4();
	var clientIPAddress	= req.header('x-forwarded-for') || req.connection.remoteAddress;
	var location		= geoIPHelper.getCity(clientIPAddress);
	var reqOrigin		= req.headers.origin;
	
	commonHeaders.uuid	= uuid;
	commonHeaders.clientIPAddress	= clientIPAddress;
	commonHeaders.location			= location;
	commonHeaders.reqOrigin			= reqOrigin;
	
	callback(null,commonHeaders);
}