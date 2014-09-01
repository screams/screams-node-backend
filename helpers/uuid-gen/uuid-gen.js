var uuidGen		= 	require('node-uuid');

exports.UUIDv4 = function(){
	var uuid	= uuidGen.v4(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
	return uuid;
}