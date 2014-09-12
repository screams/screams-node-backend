/*
	info			- 	Information Message
	error			-	Error Details
	statusCode		-	HTTP Status Code
	
	callback		- 	CallBack function
*/
exports.createAndGetReturnMessage = function(info,error,statusCode,callback){
	var returnPacket = {};
	returnPacket.info	= info;
	returnPacket.error	= error;
	returnPacket.statusCode	= statusCode;
	callback(null,returnPacket);	// Set it to null, with a great confidence that nothing can go wrong.
}