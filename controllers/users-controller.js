/*
	
*/
var request		= 	require("request");
var async		= 	require('async'); 		//Module for async communication

var	uuidHelper	= 	require('../helpers/uuid-gen/uuid-gen.js');
var	geoIPHelper	= 	require('../helpers/geoip-maxmind/geoip-maxmind.js');
var responseHandler	=	require('../helpers/response-handler/response-handler.js');
var returnMessageHandler	=	require('../helpers/response-handler/retrun-message-handler.js');


var requestOptions	=	null;

/*
	Options are initialzied globally. 
	Controllers can change their implementaion locally as per the request requirements.
*/
exports.initializeOptions	= function(serverOptions){
	requestOptions	=	serverOptions;
}

/*
	Sample Input JSON
		{
			"UserName"		:	"Praneesh",
			"DOB"			:	"22-June-1988",
			"Sex"			:	"M",
			"Email"			:	"pranuvitmsse05@gmail.com",
			"Password"		:	"md5-hash",
			"Phone"			:	"8197239863",
			"CCode"			:	"+91",
			"MemberSince"	:	"10-Aug-2014",
			"Nationality"	:	"Indian"
		}
*/
exports.createUser = function(req,res){
	/*
		The Parameters Are Not Tested For Their Validity.
		This has to be done going forward.
		
		For now and future, client side validation has to be done.
				
	*/
	var uuid	= uuidHelper.UUIDv4();
	var clientIPAddress	= req.header('x-forwarded-for') || req.connection.remoteAddress;
	var signUpLocation	=	geoIPHelper.getCity(clientIPAddress);
	var reqOrigin		= req.headers.origin;
	
	var email	= req.body.Email;
	var jsonPayLoad	= {
				"query":"CREATE (n:User { UUID:{UUID} ,UserName:{UserName} ,DOB:{DOB} ,Sex:{Sex} ,Email:{Email} ,Password:{Password} ,Phone:{Phone}, CCode:{CCode} ,MemberSince:{MemberSince} ,Nationality:{Nationality} ,SignedUpLoc:{SignedUpLoc} ,ReqOrigin:{ReqOrigin} }) RETURN n",
				"params":{
					"UUID"			:	uuid,
					"UserName"		:	req.body.UserName,
					"DOB"			:	req.body.DOB,
					"Sex"			:	req.body.Sex,
					"Email"			:	email,
					"Password"		:	req.body.Password,
					"Phone"			:	req.body.Phone,
					"CCode"			:	req.body.CCode,
					"MemberSince"	:	req.body.MemberSince,
					"Nationality"	:	req.body.Nationality,
					"SignedUpLoc"	:	signUpLocation,
					"ReqOrigin"		:	reqOrigin
				}
	};
	
	// response , responseFromValidation, result all should be having same structure !!
	async.waterfall([
		function(callback){
			checkAndGetUserByEMail(email,function (error,response){
				//Change the PayLoad as the jsonPayLoad will be sent out
				requestOptions["body"]	=	JSON.stringify(jsonPayLoad);
				callback(error,response,requestOptions);
			});
		},
		function(responseFromValidation,requestOptions,callback){
			checkAndMakeDatabaseEntry(responseFromValidation, requestOptions, uuid, function (camdbe_err,camdbe_response){
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
};

/*
	This function allows to add a User into the database.
	This could be a shared function		::Shared
*/
function checkAndMakeDatabaseEntry(validationResponsePacket,requestOptions,UUID,callback){
	// If anything is present in the validation response packet, just return back the details.
	if(validationResponsePacket.info != null){
		info	=	validationResponsePacket.info.UUID;
		returnMessageHandler.createAndGetReturnMessage(info,null,200,function(err,returnPacket){
				callback(err,returnPacket);
			});
		return;
	}
	//var requestOptions = validationResponsePacket.passedOptions;
	//As User DoesNot Exist, Add It In Database
	request.post(requestOptions,function(error,response,body){
		returnMessageHandler.createAndGetReturnMessage(UUID,error,response.statusCode,function(err,returnPacket){
				callback(err,returnPacket);
			});
		return;
	});
}

exports.getUserByUUID = function(req,res){
	var uuid	=	req.params.uuid;
	checkAndGetUserByUUID(uuid, function (error,response){
		if(!error){
			responseHandler.createAndSendResponse(res,response.info,response.statusCode);
		}
	});
}

function checkAndGetUserByUUID (UUID,callback){
	var returnPacket = {};
	var uuid = UUID;
	var jsonPayLoad	= {
				"query":"MATCH(user:User{UUID:{UUID}}) RETURN user",
				"params":{
					"UUID"			:	uuid
				}
	};
	requestOptions["body"]	=	JSON.stringify(jsonPayLoad);
	request.post(requestOptions,function (error, response, body) {
			var receivedJSONData	=	{};
			var info	= {};
			receivedJSONData	=	JSON.parse(body);
			if(receivedJSONData.data.length){
				info	= JSON.parse(body).data[0][0].data;	
			}		
			returnMessageHandler.createAndGetReturnMessage(info,error,response.statusCode,function(err,returnPacket){
				callback(err,returnPacket);
			});
		return;
	});	
}

function checkAndGetUserByEMail(EMail,callback){
	var returnPacket = {};
	var email = EMail;
	var jsonPayLoad	= {
				"query":"MATCH(user:User{Email:{EMail}}) RETURN user",
				"params":{
					"EMail"			:	email
				}
	};
	requestOptions["body"]	=	JSON.stringify(jsonPayLoad);
	request.post(requestOptions,function (error, response, body) {
			var receivedJSONData	=	{};
			var info	= null;
			receivedJSONData	=	JSON.parse(body);
			if(receivedJSONData.data.length){
				info	= JSON.parse(body).data[0][0].data;	
			}	
			returnMessageHandler.createAndGetReturnMessage(info,error,response.statusCode,function(err,returnPacket){
				callback(err,returnPacket);
			});
		return;
	});	
}