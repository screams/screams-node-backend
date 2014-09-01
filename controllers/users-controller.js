/*
	
*/
var request		= 	require("request");

var	uuidHelper	= 	require('../helpers/uuid-gen/uuid-gen.js');
var	geoIPHelper	= 	require('../helpers/geoip-maxmind/geoip-maxmind.js');

var requestOptions	=	null;

/*
	Options are initialzied globally. 
	Controllers can change their implementaion locally as per the request requirements.
*/
exports.initializeOptions	= function(serverOptions){
	requestOptions	=	serverOptions;
}

/*
	Sample JSON
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
	console.log(clientIPAddress);
	var signUpLocation	=	geoIPHelper.getCity(clientIPAddress);
	var reqOrigin		= req.headers.origin;
	var jsonPayLoad	= {
				"query":"CREATE (n:User { UUID:{UUID} ,UserName:{UserName} ,DOB:{DOB} ,Sex:{Sex} ,Email:{Email} ,Password:{Password} ,Phone:{Phone}, CCode:{CCode} ,MemberSince:{MemberSince} ,Nationality:{Nationality} ,SignedUpLoc:{SignedUpLoc} ,ReqOrigin:{ReqOrigin} }) RETURN n",
				"params":{
					"UUID"			:	uuid,
					"UserName"		:	req.body.UserName,
					"DOB"			:	req.body.DOB,
					"Sex"			:	req.body.Sex,
					"Email"			:	req.body.Email,
					"Password"		:	req.body.Password,
					"Phone"			:	req.body.Phone,
					"CCode"			:	req.body.CCode,
					"MemberSince"	:	req.body.MemberSince,
					"Nationality"	:	req.body.Nationality,
					"SignedUpLoc"	:	signUpLocation,
					"ReqOrigin"		:	reqOrigin
				}
	};
	requestOptions["body"]	=	JSON.stringify(jsonPayLoad);
	request.post(requestOptions,function (error, response, body) {
			//var info = JSON.stringify(body);
			var info = uuid;	// should return the UUID Generated for this request.
			if(!error && response.statusCode == 200){
				statusMessage = "OK";
				createAndSendResponse(res,info,200,statusMessage);
			}else{
				
				statusMessage = "Something Unexpected Happened On Server";
				createAndSendResponse(res,info,401,statusMessage);
			}
		
	});
};

function createAndSendResponse(response,info,statusCode,statusMessage){
	response.format({
				json:function(){
					var responseData	= {};
					responseData['status'] = statusCode;
					responseData['message']	= statusMessage;
					responseData['body']	= info;
					response.json(responseData);
				}
			});
	response.send();
}