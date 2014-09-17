
var express		= 	require('express');			// Module for enabling server/routing capabilitis
var bodyParser	= 	require('body-parser'); 	//Module for parsing incoming data through POST & PUT



var	userController		= 	require(__dirname+'/controllers/users-controller.js');	// Handles users information
var	screamsController	= 	require(__dirname+'/controllers/screams-controller.js');	// Handles users information


var app = express();
 
var	screamsServicesOn	= 9357;
var options=null;

initialize();
function initialize(){
	
	app.use(bodyParser.json());	//Helps to receive JSON as incoming data. Make sure that the data is proper.
	
	/*
		To Enable CORS 	
		Make sure of authentication and authorization of every request
	*/
	app.all('*', function(req, res, next) {
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	  res.header('Access-Control-Allow-Headers', 'Content-Type');
	  next();
	});
	//app.enable('trust proxy');
	app.listen(screamsServicesOn);
	console.log('Scream Services Running On '+screamsServicesOn);
	
	options	= {
					url:'http://localhost:7474/db/data/cypher',
					headers:{
						'Accept':'application/json;charset=UTF-8',
						'Content-Type':'application/json'
					}
			  };
			  
	initializeRouteServiceControllers();
	exports = module.exports = app;
}	

function 	initializeRouteServiceControllers(){
	
	initializeUserController();
	initializeScreamsController();
}

/*
	User Controller To Handle User Interactions
*/
function initializeUserController(){
	userController.initializeOptions(options);
	
	/*
		User Control for Creating a User
		POST JSON Structure:
			{
			  "UserName"	:	"Praneesh",
			  "DOB"			:	"22-June-1988",
			  "Sex"			:	"M",
			  "Email"		:	"pranuvitmsse05@gmail.com",
			  "Password"	:	"md5-hash",
			  "MemberSince"	:	"10-Aug-2014",
			  "Nationality"	:	"Indian",
			  "SignedUpLoc"	:	"<LatLong Coordinates or IPAddress>"
			}
	*/
	app.post('/user',userController.createUser);	
	logServices('/user','POST');
	
	/*
		User Control for Getting a User By UUID
		GET QSP Structure:
			user/c3d4daba-57e5-484a-8ca2-2999884512aa
	*/
	app.get('/user/:uuid',userController.getUserByUUID);	
	logServices('/user/:uuid','GET');
	
	/*
		User Control for Getting a User By EMail
		GET QSP Structure:
			user/c3d4daba-57e5-484a-8ca2-2999884512aa
	
	app.get('/user/:uuid',userController.getUserByUUID);	
	logServices('/user/:uuid','GET');*/
}

/*
	Screams Controller To Handle Screams 
*/
function initializeScreamsController(){
	screamsController.initializeOptions(options);
	
	/*
		Screams Control for Creating a Scream
		POST JSON Structure:
			{
			  "ScreamerUUID":	"",
			  "ScreamType"	:	"General",
			  "ScreamedOn"	:	"17-Sep-2014",
			  "ScreamContent":	"Some Text",
			  "ScreamLink"	:	"http://testURL/URLCanLaterBeTinyURLToReduceDataExchangeSize",		
			  "ScreamedAt"	:	"UUI of an existing character"
			}
	*/
	app.post('/scream',screamsController.newScream);	
	logServices('/scream','POST');
}

function logServices(serviceName,serviceMethod){
	console.log('Service  @ ' + serviceMethod +'  '+ serviceName);
}



