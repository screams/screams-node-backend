/*
	
*/
var request		= 	require("request");
var async		= 	require('async'); 		//Module for async communication

var responseHandler			=	require('../helpers/response-handler/response-handler.js');
var commonHeaderHandler		=	require('../helpers/commonheader-handler/commonheader-handler.js');
var returnMessageHandler	=	require('../helpers/response-handler/retrun-message-handler.js');


var requestOptions	=	null;

/*
	Options are initialzied globally. 
	Controllers can change their implementaion locally as per the request requirements.
*/
exports.initializeOptions	= function(serverOptions){
	requestOptions	=	serverOptions;
}

exports.newScream = function(req,res){
	/*
		The Parameters Are Not Tested For Their Validity.
		This has to be done going forward.
		
		For now and future, client side validation has to be done.
	*/
	
	async.waterfall([
		// Gets all the common headers required to save the information in DB
		function(callback){
			commonHeaderHandler.getCommonHeaders(req,function(error,commonHeaders){
				returnMessageHandler.createAndGetReturnMessage(commonHeaders,null,200,function(err,returnPacket){
					callback(err,returnPacket.info);
				});
			});
		},
		// Creates a Screan Node
		function(commonHeaders,callback){
			createScreamNodeInDatabase(commonHeaders,function (camdbe_err,camdbe_response){
				callback(camdbe_err,camdbe_response);
			});
		}
	],
	function(err,result){
		if(!err){
			responseHandler.createAndSendResponse(res,result.info,result.statusCode);
		}else{
			responseHandler.createAndSendResponse(res,result.error,result.statusCode);
		}
	});
}

function createScreamNodeInDatabase(commonHeadersInfo, callback){
	returnMessageHandler.createAndGetReturnMessage(commonHeadersInfo.location,null,200,function(err,returnPacket){
		callback(err,returnPacket.info);
	});
}
