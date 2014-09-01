
var express		= 	require('express');			// Module for enabling server/routing capabilitis
var bodyParser	= 	require('body-parser'); 	//Module for parsing incoming data through POST & PUT

var	userController	= 	require(__dirname+'/controllers/users-controller.js');	// Handles users information

var app = express();
var	screamsServicesOn	= 9080;
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
}

/*
	
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
	app.post('/createUser',userController.createUser);	
	logServices('/createUser','POST');
}


function logServices(serviceName,serviceMethod){
	//API Scraping Service
	console.log('Isom API Scraping Service @ ' + serviceMethod +'  '+ serviceName);
}



