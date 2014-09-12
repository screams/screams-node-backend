exports.createAndSendResponse = function(response,info,statusCode){
	var statusMessage	=	"";
	var responseBody	= {};
	responseBody	= info;
	switch(statusCode){
		case 200:
			statusMessage	=	"OK";
			break;
		case 201:
			statusMessage	= 	"Created";
		case 401:
			statusMessage	=	"Something Went Wrong";
			break;
		default:
			statusMessage	=	"Received A Different Code";
	}
	response.format({
				json:function(){
					var responseData	= {};
					responseData['status'] = statusCode;
					responseData['message']	= statusMessage;
					responseData['body']	= responseBody;
					response.json(responseData);
				}
			});
	response.send();
}