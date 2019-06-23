"use strict";
var tmpFileList = [];

var registerDisplayResponse;
var requiredFilesResponse;
var requiredFilesText;
var requiredFilesInternal;
var scheduleResponse;
var scheduleText;
var scheduleInternal;
var cacheInternal;
var layoutid;
var layout;
var layoutList = [];


var g_serverKey = "123456";
var g_hardwareKey = "56b82e9b667410d98d3e0f8db7612P22";
var g_displayName = "tizendisplay";
var g_clientType = "tizen"; 
var g_clientVersion = "1.12.1";
var g_clientCode = 133;
var g_macAdress = "30-D1-6B-4D-1D-43";  /* ----------------------- */
var access_tocken = "VSdVwWeSsmCuEAYDdlyTtsOxdIXgjMko8LaCXByC";
//var serverurl = "http://192.168.1.6/magicsign-v2/web/";
var serverurl = "http://192.168.1.191:8080/magicsign-v2/web/";

/** ------------------- FUNCTIONS TO SPECIFY DEVICE PARAMETRES FOR REGISTERATION ------------------- **/
function randomId(length) { var text = ""; var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; for (var i = 0; i < length; i++) {  text += possible.charAt(Math.floor(Math.random() * possible.length));} return text;}

var setHardwareKey = function(){
	var hardwareKey = null;
	
	var HWString = "";
	HWString += webapis.productinfo.getRealModel();
	HWString += webapis.network.getMac();
	hardwareKey = md5(HWString); 
	return hardwareKey;
	
};
var setDisplayName = function(){
	var displayName = null;
	try {
		displayName ="tizen-" +  webapis.productinfo.getRealModel();
	} catch (e) {
		console.log("displayName() exception [" + e.code + "] name: " + e.name + " message: " + e.message);
		return "tizen-SDKHUWUR" + randomId(5);
	}
	if (null !== displayName) {
		return displayName;
	}
}; 

var setClientVersion = function(){
	var clientVersion = null;
	try {
		clientVersion = webapis.productinfo.getVersion();
		} catch (e) {
		  console.log("clientType() exception [" + e.code + "] name: " + e.name + " message: " + e.message);
		  return "1.12.1";
		}

		if (null !== clientVersion) {
		  return clientVersion;
		}
};  

var getMacAdress = function(){
	var mac = null;
	try {
	  mac = webapis.network.getMac();
	} catch (e) {
	  console.log("getMAC exception [" + e.code + "] name: " + e.name + " message: " + e.message);
	}

	if (null !== mac) {
	  return mac;
	}
	else {return g_macAdress;}
	
};  


/** ----------------- END FUNCTIONS TO SPECIFY DEVICE PARAMETRES FOR REGISTER ----------------- **/

/** ---------------------------- FUNCTIONS THAT CALL XMDS METHODS ---------------------------- **/
var appAuth = function(){
	try{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", serverurl + "api/authorize/access_token",true);
		xmlhttp.onreadystatechange=function() {
		 if (xmlhttp.readyState === 4) {
			 try{
			 var response =xmlhttp.responseText;
			 response =JSON.parse(response);
			 access_tocken = response.access_token;
			 return access_tocken;
			 } catch(e){
				 return access_tocken; 
			 }
		 	}
		};
		xmlhttp.setRequestHeader("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
		var Auth = '------WebKitFormBoundary7MA4YWxkTrZu0gW\n' +
				'Content-Disposition: form-data; name="client_id"\n\n'+
				
				'WHF60pYSCh698dO2M0oRF9Jp2gaInCrgB8p3mqIs\n'+ //'6AOvRUvnuUWGpqdIgu8yczdmoPG3AyoSci4y7UrR\n'+
				
				'------WebKitFormBoundary7MA4YWxkTrZu0gW\n'+
				'Content-Disposition: form-data; name="client_secret"\n\n'+
				
				'FhCVOAKegyKeM5OZFMydmtOaMTPUlpipfMwvRSkz8GGq4c21bKjAHNG7NSnjSVJnwfLrtDw2aVD6BmXREgKDKfmSFKyvIGpUlDFnqeMhis4cCUdlv9NedN3VYXSqhI1ufJWhChFRyKXt6LYHyrOiLlvp4CzSeHdwyxkWFCLlcuOCbLpnJEO9DJSN1fn5KVgxZYy7vOdpmq9vCvjVjiNp1ZMRbrNzmrUB3lxh7hKpyAF3XW0KU3pUYsxeiIpesu\n'+  //'cYhDTTvcdeb0sgtTi8TNDpXI295kz3ecarLfTiSbmp5KXGVTOzaqDLjID7RgA8SGGIC7HGDDsKkU5HweyWnaIeIYJGKYmewnbgVaqpJuW1ZdwLCnyXtYGvuG6ocsApHDQdfPfGME1GJVUYoVf4ACyaRmeUrVnJoVphNgDsIeUVQJGg8i4iOWRZkh2WnCWAwXzuBam5UnmjGtIrGVyAccJUOKr2O0WqYbXhyiZxfrraj1bpJOIyDk8y6DdSGkI9\n'+
				
				'------WebKitFormBoundary7MA4YWxkTrZu0gW\n'+
				'Content-Disposition: form-data; name="grant_type"\n\n'+
				
				'client_credentials\n'+
				'------WebKitFormBoundary7MA4YWxkTrZu0gW--' ;
		 xmlhttp.send(Auth);
	} catch(e){}
	
	
};  

var registerDisplay = function(tocken_api) {
	
	try{
		var data = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:tns=\"urn:xmds\" xmlns:types=\"urn:xmds/encodedTypes\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\r\n  <soap:Body soap:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\r\n    <tns:RegisterDisplay>\r\n      <serverKey xsi:type=\"xsd:string\">"+g_serverKey+"</serverKey>\r\n      <hardwareKey xsi:type=\"xsd:string\">"+g_hardwareKey+"</hardwareKey>\r\n      <displayName xsi:type=\"xsd:string\">"+g_displayName+"</displayName>\r\n      <clientType xsi:type=\"xsd:string\">"+g_clientType+"</clientType>\r\n      <clientVersion xsi:type=\"xsd:string\">"+g_clientVersion+"</clientVersion>\r\n      <clientCode xsi:type=\"xsd:int\">"+g_clientCode+"</clientCode>\r\n      <macAddress xsi:type=\"xsd:string\">"+g_macAdress+"</macAddress>\r\n    </tns:RegisterDisplay>\r\n  </soap:Body>\r\n</soap:Envelope>";

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.addEventListener("readystatechange", function () {
		  if (this.readyState === 4) {
			registerDisplayResponse = this.responseXML;
			try{
				var r = registerDisplayResponse.getElementsByTagName("ActivationMessage")[0];
				r = $.parseXML(r.textContent);
				registerDisplayResponse = r.firstChild.getAttribute("code");
			} catch(e){
				registerDisplayResponse =  "error";
				console.log(registerDisplayResponse);
				return registerDisplayResponse;
			}	
			console.log(registerDisplayResponse);
			return registerDisplayResponse;
		  }
		});

		xhr.open("POST", serverurl + "xmds.php?v=5&method=registerDisplay");
		xhr.setRequestHeader("content-type", "text/xml");
		xhr.setRequestHeader("authorization", "Bearer "+tocken_api);
		xhr.setRequestHeader("cache-control", "no-cache");
		 

		xhr.send(data);
	} catch(e){}
	
	
 };
 
 
var RequiredFiles = function(tocken_api){
	
	try{
		var data = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:tns=\"urn:xmds\" xmlns:types=\"urn:xmds/encodedTypes\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\r\n  <soap:Body soap:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\r\n    <tns:RequiredFiles>\r\n      <serverKey xsi:type=\"xsd:string\">"+g_serverKey+"</serverKey>\r\n      <hardwareKey xsi:type=\"xsd:string\">"+g_hardwareKey+"</hardwareKey>\r\n    </tns:RequiredFiles>\r\n  </soap:Body>\r\n</soap:Envelope>";

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		
		xhr.addEventListener("readystatechange", function () {
		  if (this.readyState === 4) {
			try{
				requiredFilesResponse = this.responseXML; 
				requiredFilesText = this.response;
				
				var r = requiredFilesResponse.getElementsByTagName("RequiredFilesXml")[0];
				requiredFilesResponse = $.parseXML(r.textContent);
				
			    console.log(requiredFilesResponse);
			    
			    // WRITE THE REQUIRED FILES IN INTERNAL 
			    updateRF(requiredFilesText);
			    
			    // SEND DATA TO REQUIRED FILES CHECKER
			    worker.postMessage({t:access_tocken,r:requiredFilesText,k:g_hardwareKey});
				
			    // REQUIRED FILES READY, START DOWNLOAD MANAGER NOW
			    DownloadManagerThread();
			    return requiredFilesResponse;
			} catch(e){
				requiredFilesResponse = requiredFilesInternal;
				console.log(requiredFilesResponse);
				DownloadManagerThread();
				return requiredFilesResponse;
			}
			
		  }
		});

		xhr.open("POST", serverurl + "xmds.php?v=5&method=RequiredFiles");
		xhr.setRequestHeader("content-type", "text/xml");
		xhr.setRequestHeader("authorization", "Bearer "+tocken_api);
		xhr.setRequestHeader("cache-control", "no-cache");
		

		xhr.send(data); 
	} catch(e){}
	
	
};
var Schedule = function(tocken_api){
	
	try{
		var data = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:tns=\"urn:xmds\" xmlns:types=\"urn:xmds/encodedTypes\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\r\n  <soap:Body soap:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\r\n    <tns:Schedule>\r\n      <serverKey xsi:type=\"xsd:string\">123456</serverKey>\r\n      <hardwareKey xsi:type=\"xsd:string\">" + g_hardwareKey + "</hardwareKey>\r\n    </tns:Schedule>\r\n  </soap:Body>\r\n</soap:Envelope>";

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		
		xhr.addEventListener("readystatechange", function () {
		  if (this.readyState === 4) {
			  try{
				  scheduleResponse = this.responseXML; 
					scheduleText = this.response;
					
					var r = scheduleResponse.getElementsByTagName("ScheduleXml")[0];
					scheduleResponse = $.parseXML(r.textContent);
				    console.log(scheduleResponse);
					
					// WRITE SCHEDULE FILE
					updateSchedule(scheduleText);
					
					// SEND DATA TO SCHEDULE CHECKER
				    scheduleWorker.postMessage({t:access_tocken,r:scheduleText,k:g_hardwareKey});
					return scheduleResponse;
			  } catch(e){
				  scheduleResponse = scheduleInternal;
				  console.log(scheduleResponse);
				  return scheduleResponse;
				}
			 }
		});

		xhr.open("POST", serverurl + "xmds.php?v=5&method=Schedule");
		xhr.setRequestHeader("content-type", "text/xml");
		xhr.setRequestHeader("authorization", "Bearer "+tocken_api);
		xhr.setRequestHeader("cache-control", "no-cache");

		xhr.send(data);
	} catch(e){}
	
	
};


var Scheduled = function(tocken_api){
	
	try{
		var data = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:tns=\"urn:xmds\" xmlns:types=\"urn:xmds/encodedTypes\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\r\n  <soap:Body soap:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\r\n    <tns:Schedule>\r\n      <serverKey xsi:type=\"xsd:string\">123456</serverKey>\r\n      <hardwareKey xsi:type=\"xsd:string\">" + g_hardwareKey + "</hardwareKey>\r\n    </tns:Schedule>\r\n  </soap:Body>\r\n</soap:Envelope>";

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		
		xhr.addEventListener("readystatechange", function () {
		  if (this.readyState === 4) {
			  try{
				  scheduleResponse = this.responseXML; 
					scheduleText = this.response;
					
					var r = scheduleResponse.getElementsByTagName("ScheduleXml")[0];
					scheduleResponse = $.parseXML(r.textContent);
				    console.log(scheduleResponse);
					
					// SEND DATA TO SCHEDULE CHECKER
				    scheduleWorker.postMessage({t:access_tocken,r:scheduleText,k:g_hardwareKey});
				    ScheduleManager(); // modifier 15 - 06
				    
					return scheduleResponse;
			  } catch(e){
				  scheduleResponse = scheduleInternal;
				  console.log(scheduleResponse);
				  return scheduleResponse;
				}
			 }
		});

		xhr.open("POST", serverurl + "xmds.php?v=5&method=Schedule");
		xhr.setRequestHeader("content-type", "text/xml");
		xhr.setRequestHeader("authorization", "Bearer "+tocken_api);
		xhr.setRequestHeader("cache-control", "no-cache");

		xhr.send(data);
	} catch(e){}
	
	
};


/** -------------------------- END FUNCTIONS THAT CALL XMDS METHODS -------------------------- **/

/** ------------------------------ DOWNLOAD MANAGER ------------------------------ **/
 var MagicSignFile = class  {
	 constructor(fileName,targetHash,fileId,fileType,mtime) {
	        this.fileName = fileName;
	        this.targetHash = targetHash;
	        this.fileId = fileId;
	        this.fileType = fileType;
	        this.mtime = mtime;
	        this.path = "downloads/" + fileName;
	        this.md5 = "NOT CALCULATED";
	        this.checkTime = 1;
	        this.downloadState = 0;
	    }
	 update(){
		 // TODO : generate MD5
		 //this.md5 = hashlib.md5()
		 /**
		  * try:
              "*** GENERATING MD5 for file %s" % this.fileName
            for line in open(this.path,"rb"):
                m.update(line)    
            except IOError:
                return False
		  */
		  try {
			
		} catch (e) {
			// TODO: handle exception
		}
		 // this.md5 = m.hexdigest()
		 // this.mtime = os.path.getmtime(this.path)
		 this.checkTime = moment().format();
		 return true;
	 } 
	 isExpired(){
		 // TODO 
		 try {
            // tmpMtime = os.path.getmtime(self.__path)
		 } catch(e){
             return false;
         }
         // return (! (self.mtime == tmpMtime) )
	 }
	 isValid(){
		 // TODO  
		 try {
			// tmpMtime = os.path.getmtime(self.__path)
		} catch (e) {
			return false;
		}
		// return (self.md5 == self.targetHash) and (self.mtime == tmpMtime)
	 }
	 
 };
 
 var fileNumb;
 var layoutName = null;
 var DownloadManagerThread = function(){
	 console.log("New DownloadManager instance created.");

	 var running = true;
	 var dlQueue = [];
	 var offline = false;
	 var cleanup = false;
	 var lastCleanup = 0;
	 var runningDownloads = [];
	 var maxDownloads = 50;
	 var reservedFiles = ['wi-cloudy.jpg', 'weathericons-regular-webfont.woff2', '12.otf', 'jquery-1.11.1.min.js', 'wi-windy.jpg', 'weathericons-regular-webfont.woff', 'weathericons-regular-webfont.ttf', '10.ttf', 'wi-rain.jpg', 'weathericons-regular-webfont.svg', 'WeatherIcons-Regular.otf', '8.otf', 'wi-night-clear.jpg', 'weather-icons.min.css', 'compatibility.js', 'MagicSign-dataset-render.js', 'wi-fog.jpg', 'animate.css', 'pdf.js', 'flipclock.min.js', 'wi-day-cloudy.jpg', 'bootstrap.min.css', 'MagicSign-text-render.js', 'jquery-cycle-2.1.6.min.js', 'fonts.css', '11.ttf', 'wi-snow.jpg', 'weathericons-regular-webfont.eot', '9.otf', 'wi-night-partly-cloudy.jpg', 'MagicSign-webpage-render.js', 'MagicSign-image-render.js', 'wi-hail.jpg', 'font-awesome.min.css', 'pdf.worker.js', 'MagicSign-layout-scaler.js', 'wi-day-sunny.jpg', 'jquery.marquee.min.js', 'moment.js'
                       ];

	 // TODO : Populate md5Cache

	 var url = "http://192.168.1.191:8080/magicsign-v2/web/tizen-download.php?file=";
	 //var url = "http://192.168.1.19/library/";
	 var run = function(){
	 	console.log("New DownloadManager instance started.");
	 	
	 	while (running === true) {
	 		var interval = 300;
	 		//Flag to note if on this loop we downloaded new files
	         var updatedContent = false;
	         // Go through the list comparing required files to files we already have.
	         // If a file differs, queue it for download
	         var reqFiles = "<files></files>";	          
	         
	         	// TODO : write response to requiredfiles.xml in disque
	        
	         reqFiles = requiredFilesResponse;
	         var doc = null;
	         doc = reqFiles;
	         // Find the layout node and store it
	         if ("<files></files>" !== doc) {
	         	
	         	var fileNodes = doc.getElementsByTagName("file");
	         	fileNumb = fileNodes.length - 40; // minus reserved files = 40
	         	
	         	for ( var f = 0; f < fileNodes.length; f++) {
	         	  try {	
	         	  if (! reservedFiles.includes(fileNodes[f].getAttribute("path"))) {
	         		var tmpPath, tmpFileName, tmpSize, tmpHash, tmpType, tmpId;
	         		var fileExist = false;
	         		// Does the file exist? Is it the right size?
	         		if (fileNodes[f].getAttribute("type") === "media") {
	         			// media Node
	 					tmpPath = "downloads/" + fileNodes[f].getAttribute("path");
	 					tmpFileName = fileNodes[f].getAttribute("path");
	 					tmpSize = fileNodes[f].getAttribute("size");
	 					tmpHash = fileNodes[f].getAttribute("md5");
	 					tmpType = fileNodes[f].getAttribute("type");
	 					tmpId = fileNodes[f].getAttribute("id");
	 					if (fileList.includes(tmpFileName)) {
							fileExist = true;
						}
	 					if(fileExist){
	 						if(true){ // TODO : check if the file has the same file size.
		 						// File exists and is the right size
	 							ctrl ++;
	 							console.log(tmpFileName + " file exist.");
		 					} 
	 					}
	 					else {
	 						// Queue the file for download later.
	 						var tmpFile = new MagicSignFile(tmpFileName,tmpHash,tmpId,tmpType);
	 						tmpFileList[tmpId]=(tmpFile);
	 						dlQueue.push.apply(dlQueue, [tmpType,tmpFileName,tmpSize,tmpHash,tmpId]);
	 					}
	 				console.log("File " + tmpFileName + " is valid.");	
	 				} else if (fileNodes[f].getAttribute("type") === "layout") {
	 					tmpPath = "downloads/" + fileNodes[f].getAttribute("path") + ".xlf";
	 					tmpFileName = fileNodes[f].getAttribute("path") + ".xlf";
	 					tmpSize = fileNodes[f].getAttribute("size");
	 					if(layout === undefined || layout === null){layout = layoutList[layoutListReference.indexOf(tmpFileName)] ;}
	 					tmpHash = fileNodes[f].getAttribute("md5");
	 					tmpType = fileNodes[f].getAttribute("type");
	 					tmpId = fileNodes[f].getAttribute("id");
	 					
	 					if (fileList.includes(tmpFileName) && layout !== undefined) {
							fileExist = true;
						}
	 					if(fileExist){
	 						var isSameSize = true;
	 						try {isSameSize = tmpSize == layoutListSize[layoutListReference.indexOf(tmpFileName)]; } catch (e) {}
	 						if(isSameSize){ // TODO : check if the file has the same file size.
		 						// File exists and is the right size
	 							ctrl ++;
	 							console.log(tmpFileName + " file exist.");
		 					} else {
								// File exists but different size
		 						// Delete existing file and queue the file for download later.
		 						tizen.filesystem.resolve("downloads", function(dir){dir.deleteFile("downloads/"+tmpFileName);})
		 						var tmpFile = new MagicSignFile(tmpFileName,tmpHash,tmpId,tmpType);
		 						tmpFileList[tmpId]=(tmpFile);
		 						dlQueue.push.apply(dlQueue, [tmpType,tmpFileName,0,tmpHash,tmpId]);
							}
	 					}
	 					 else {
	 						// Queue the file for download later.
	 						var tmpFile = new MagicSignFile(tmpFileName,tmpHash,tmpId,tmpType);
	 						tmpFileList[tmpId]=(tmpFile);
	 						dlQueue.push.apply(dlQueue, [tmpType,tmpFileName,0,tmpHash,tmpId]);
	 					}
	 				} else if (fileNodes[f].getAttribute("type") === "resource"){
	 					ctrl++;
	 					console.log(tmpFileName + " resource file.");
	 				} else {console.log("Blacklist File Node found!");}
	         		tmpPath = null; tmpFileName = null; tmpSize = null; tmpHash = null; tmpType = null; tmpId = null;
	 			}
	         	} catch (e) {
					console.log("Blacklist File Node or empty node :" + e);
				}
	         }
	         	fileNodes = null;
	 		} // End If doc != None
	         updateMediaInventory();

	         cleanOldMedia();
	         
	         // If nothing got queued, create the layout.
	         if (dlQueue.length === 0) {
	         		running = false;
	         		create(layout);
				}
	         
	         // Loop over the queue and download as required
	         while (dlQueue.length > 0) {
	         	var t = dlQueue.slice(0,5);
	         	var tmpType = t[0], tmpFileName = t[1], tmpSize = t[2], tmpHash = t[3], tmpId = t[4];
	         	dlQueue.splice(0,5); /** run and see **/
	         	// Check if the file is downloading already
	         	if (! runningDownloads.includes(tmpFileName)) {
	         		// Make a download thread and actually download the file.
	         		// Add the running thread to the runningDownloads queue
	         		runningDownloads.push(tmpFileName);
	         		updatedContent = true;
	         		
	         		var downloadRequest;
	         		if (tmpType === "layout") {
	         			downloadRequest = new tizen.DownloadRequest(url + tmpId + ".xlf", "downloads");
	         			if(layoutName === null){ layoutName = tmpId + ".xlf";}
					} else {
						downloadRequest = new tizen.DownloadRequest(url + tmpId + "." + tmpFileName.split('.').pop(), "downloads");
					}
	         		
	         		if (offline) {
	 					// If we're running offline, block until completed.  
	         			// TODO : tmpId.......
	         			try {
	         				tizen.download.pause(downloadId);
	         				try {
	         					tizen.download.resume(downloadId);
	 						} catch (e) {
	 							console.log("offline !! can't resume the download !");
	 						}
	 					} catch (e) {
	 						console.log("offline !! download canceled !");
	 					}
	         			
	 				} else {
	 					startDownloading(downloadRequest, tmpId);
	 				}
	         		
	         		
	 			} 
	         	while ((runningDownloads.length) >= (maxDownloads - 1)){
	         		// There are no download thread slots free. Sleep for 5 seconds and try again.
	         		sleep(5000);
	         	}
	         	// Cleanup old files
	         	if (cleanup) {
	         		cleanOldMedia();
	 			}
	         	if (dlQueue.length === 0) {
	         		running = false;
				}
	         	// End While
	 		}
	         	
	 	}
	 };
	 function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

	 Array.prototype.remove = function() { var what, a = arguments, L = a.length, ax; while (L && this.length) { what = a[--L]; while ((ax = this.indexOf(what)) !== -1) { this.splice(ax, 1); } } return this;};

	 var dlThreadCompleteNotify = function(tmpFileName){
	 	// Download thread completed. Log and remove from runningDownloads
	 	console.log("Download thread completed for " + tmpFileName);
	 	runningDownloads.remove(tmpFileName);	
	 };

	 var updateMediaInventory = function(){
		 /**
		 var xml = "";
		 for (var int = 0; int < array.length; int++) {
			 xml += "<file type=" +rf.FileType+ " id=" +rf.Id+ " complete=" +rf.Complete+ " lastChecked=" +rf.LastChecked+ " md5=" +rf.Md5+ " />";
		 }
		 
		 xml += "<files>" +xml+ "</files>";
		 
		 **/
		 
	 };

	 var cleanOldMedia = function(){
	 	// Check how recently we ran.
	 	var now = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
	 	if (lastCleanup < moment(Date.now() + 43200*1000).format("YYYY-MM-DD HH:mm:ss")) {

	 	}
	 	
	 	var documentsDir;
	 	var documentList = [];
	 	function onsuccess(files) {
			for (var i = 0; i < files.length; i++) {
				documentList.push(files[i].name);
	   		}
	   		for (var i = 0; i < documentList.length; i++) {
	   			if (documentList[i].indexOf('_') > -1) {
	   				documentsDir.deleteFile("downloads/"+documentList[i]);
	   			}
	   		}
	 	}

	 	function onerror(error) {
	   	console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	 	}

	    tizen.filesystem.resolve(
	    	'downloads',
	   		function(dir) {
	     		documentsDir = dir;
	     		dir.listFiles(onsuccess, onerror);
	   			}, function(e) {
	     	console.log("Error" + e.message);
	   		}, "rw"
	 	);
	   
	    lastCleanup = now;
	     
	 };

	 
	 run();
 
 };
 
 var startDownloading = function(downloadRequest, tmpId){
	 var listener = {
			  onprogress: function(id, receivedSize, totalSize) {
			    console.log('Received with id: ' + id + ', ' + receivedSize + '/' + totalSize);
			  },
			  onpaused: function(id) {
			    console.log('Paused with id: ' + id);
			  },
			  oncanceled: function(id) {
			    console.log('Canceled with id: ' + id);
			  },
			  oncompleted: function(id, path) {
			    console.log('Completed with id: ' + id + ', path: ' + path);
			    tmpFileList[tmpId].downloadState = 1;
			    fileDownloadCtrl(tmpId);
			  },
			  onfailed: function(id, error) {
			    console.log('Failed with id: ' + id + ', error name: ' + error.name);
			    tmpFileList[tmpId].downloadState = 0;
			    fileDownloadCtrl(tmpId);
			  }
			};
	 var downloadsIds = [];
	 var downloadId = tizen.download.start(downloadRequest, listener);
	 downloadsIds.push(downloadId);
	 
 };
 
 var ctrl=0;
 var fileDownloadCtrl = function(id){
	
	 if(layout === undefined  || layout === null){layout = readLayoutAsText(layoutName);}
	 readLayouts();
	 if(tmpFileList[id].downloadState===1){ctrl++;}
	 if(ctrl===fileNumb){fileNumb=0;ctrl=0;create(layout);}
	 else {return false;}	
};
	 


/** ---------------------------- END DOWNLOAD MANAGER ---------------------------- **/

/** ---------------------------- SCHEDULE MANAGER ---------------------------- **/
var MagicSignLayout = class {
	constructor(lID,isD) {
        this.layoutID = lID;
        this.isDefault = isD;
        this.schedule = [];
        this.mediaCheck = null;
        this.scheduleCheck = null;
        this.mediaNodes = null;
        this.__setup();
    }
	__setup(){
		this.builtWithNoXLF = false;
		this.layoutNode = null;
		this.iter = null;
		var width;
		var height;
		var backgroundColour;
		// Tags assinged to this layout
		this.tags = [];
		// Array of media names (to check against md5Cache later!)
		this.media = [];
		this.mediaCheck = false;
		this.scheduleCheck = false;
		// Read XLF from file (if it exists).Set builtWithNoXLF = True if it doesn't
		var doc;
		try{
			doc = layoutList[layoutListReference.indexOf(this.layoutID + ".xlf")];
			if (doc !== undefined) {
				doc = $.parseXML(doc);
				// Find the layout node and store it
				this.layoutNode = doc.getElementsByTagName("layout");
			}
			try{
				width = this.layoutNode[0].getAttribute("width");
				height = this.layoutNode[0].getAttribute("height");
				backgroundColour = this.layoutNode[0].getAttribute("bgcolor");
			} catch(e){ console.log("Layout XLF is invalid. Missing required attributes");}
			// Present the children of the layout node for further parsing
			this.iter = this.layoutNode[0].childNodes;
		} catch(e){ this.builtWithNoXLF = true;}
		// Find all the media nodes
		this.mediaNodes = doc.getElementsByTagName('media');

	}
	canRun() {
		if (this.builtWithNoXLF) { return false;}
		this.mediaCheck = true;
		this.scheduleCheck = false;
		if (this.mediaNodes.length < 1) { this.mediaCheck = false;}
		// Loop through all the media items in the layout
		var tmpFileName, tmpPath;
		for (var i = 0; i < this.media.length; i++) {
			tmpFileName = this.media[i];
			tmpPath = "downloads/" + tmpFileName;
			// TODO : check the MD5 for each media in layout
			//if (! cacheFilesList.includes(tmpFileName)) { this.mediaCheck = false;}			
		}
		// See if the item is in a scheduled window to run
		for (var l = 0; l < this.schedule.length; l++) {
			var sc = this.schedule[l];
			var fromDt;
			try {
			fromDt =sc[0];
	  		} catch (e) { fromDt = 0;}
	  		var toDt;
			try {
			toDt =sc[1];
	  		} catch (e) { toDt = 2147472000;}
	  		var priority = sc[2];
	  		var now = Date.now();
	  		if(((now > fromDt) && (now < toDt)) || fromDt > toDt) { this.scheduleCheck = true;}
		}
		return this.mediaCheck && (this.scheduleCheck || this.isDefault);
	}
	resetSchedule() {
		console.log("Reset schedule information for layout " + this.layoutID);
		this.schedule=[];
	}
	addSchedule(fromDt, toDt, priority) {
		console.log("Added schdule information for layout "+this.layoutID+": f:"+fromDt+" t:"+toDt+" p:"+priority); 
		this.schedule.push(fromDt,toDt,priority);
	}
	getSchedule() {
		// Return the schedule for this layout
		return this.schedule;
	}
	isPriority() { // TODO : now !!!
		// Check through the schedule and see if we're priority at the moment.
		for (var i = 0; i < this.schedule.length; i++) {
			var sc = this.schedule[i];
			var fromDt;
			try {
			fromDt =sc[0];
	  		} catch (e) { fromDt = 0;}
	  		var toDt;
			try {
			toDt =sc[1];
	  		} catch (e) { toDt = 2147472000;}
	  		var priority = sc[2];
	  		var now = Date.now();
	  		// Check if we're in the window. If fromDt > toDt then we've got the default layout (which is essentially an invalid schedule).
			if ((now > fromDt) && (now < toDt)){
				if (priority === 1){ return true;}
			}
		}
		return false;                                    
	}
	children() {
		return this.iter;
	}
};

var DummyScheduler = function(){
	var layoutList = ['47','48'];
	var layoutIndex = 0;

	var nextLayout = function(){
		// Return the next valid layout
		var DSlayout = new MagicSignLayout(layoutList[layoutIndex],false);
		layoutIndex = layoutIndex + 1;
		if (layoutIndex === layoutList.length) { layoutIndex = 0;}
		if (DSlayout.canRun() === false) {
			if (layoutList.length > 1) {return nextLayout();}
			else{ return new MagicSignLayout("0",false);}
		} else{ return DSlayout;}
	};
};

var ScheduleManager = function(){
	var running = true;
	var layouts = [];
	var previousSchedule = "<schedule/>";
	var defaultLayout = null;
	// Set next start to be 30 days in the future by default
	var nextLayoutStartDT = moment(Date.now()  + 2592000*1000).format("YYYY-MM-DD HH:mm:ss");
	// Set next finish to be 30 seconds in the past
	var nextLayoutFinishDT = moment(Date.now() - 30*1000).format("YYYY-MM-DD HH:mm:ss");
	var nextLayoutFinishID = null;
	
	var run = function(){
		while(running){
			var schedule = '<schedule/>';
			try{ 
				schedule = scheduleResponse;
				//updateSchedule(scheduleText);
			} catch(e){
				console.log("error while caching schedule :" + e);
				try{
					readInternalSchdl();
					schedule = scheduleInternal;
				} catch(e){console.log("could not read schedule ." + e);}
			}
			var scheduleText = "";
			//  Process the received schedule.If the schedule hasn't changed, do nothing.
			if (previousSchedule !== schedule) {
				previousSchedule = schedule;
				var doc = schedule;
				var defaultLayout;
				var tmpLayouts;
				try {
					tmpLayouts = doc.getElementsByTagName('layout');
					defaultLayout = doc.getElementsByTagName('default');
					} catch(e){console.log("Invalid Schedule doc");}
				
				// Parse out the default layout and update if appropriate
				for (var i = 0; i < defaultLayout.length; i++) {
					var layoutID = defaultLayout[i].getAttribute('file');
					
					// THE DEFAULT LAYOUT 
					layoutid = layoutID;
					
					//layout = readLayoutAsText(layoutID+".xlf");
					try{
						if (defaultLayout.layoutID !== layoutID) {
							defaultLayout = new MagicSignLayout(layoutID,true);
						}
					} catch(e){
						defaultLayout = new MagicSignLayout(layoutID,true);
					}
				}
				var newLayouts = [];
				nextLayoutFinishID = [];
				for (var i = 0; i < tmpLayouts.length; i++) {
					var layoutID = tmpLayouts[i].getAttribute('file');
					var layoutFromDT = tmpLayouts[i].getAttribute('fromdt');
					var layoutToDT = tmpLayouts[i].getAttribute('todt');
					var layoutPriority = tmpLayouts[i].getAttribute('priority');
					var flag = true;
					// If the layout already exists, add this schedule to it
					for (var j = 0; j < newLayouts.length; j++) {
						try{
							if (newLayouts[j].layoutID === layoutID) {
							// Append Schedule
							newLayouts[j].addSchedule(layoutFromDT,layoutToDT,layoutPriority);
							flag = false;
							}
						} catch(e){console.log("the layout don't exist");}
					}
					// The layout doesn't exist, add it and add a schedule for it
					if (flag) {
						var tmpLayout = new MagicSignLayout(layoutID,false);
						tmpLayout.addSchedule(layoutFromDT,layoutToDT,layoutPriority);
						newLayouts.push(tmpLayout);
						scheduleText += layoutID + ', ';
					}
				}
				calculateNextTick(newLayouts);
				// Swap the newLayouts array in to the live scheduler
				layouts = newLayouts;
			} // End if previousSchedule != schedule

		} // End while self.running
	};
	var calculateNextTick = function(lay){
		var tmpLay;
		if (lay.length === 0) {
			tmpLay = layouts;
		} else {
			tmpLay = lay;
		}
		var now = Date.now();
		now = moment(now).format("YYYY-MM-DD HH:mm:ss");
		nextLayoutStartDT = moment(Date.now() + 2592000*1000).format("YYYY-MM-DD HH:mm:ss");
		nextLayoutFinishDT = moment(Date.now() + 2592000*1000).format("YYYY-MM-DD HH:mm:ss");
		var tmpStartDT = nextLayoutStartDT;
		var tmpFinishDT = nextLayoutFinishDT;
		for (var i = 0; i < tmpLay.length; i++) {
			var layoutID = tmpLay[i].layoutID;
			var sched = tmpLay[i].getSchedule();
			for (var l = 0; l < sched.length / 3; l++) {
				var layoutFromDT = sched[l*3 + 0];
				var layoutToDT = sched[l*3 + 1];
				// Convert the date strings to seconds since the epoch for conversion
				var layoutFromSecs = moment(layoutFromDT).format("YYYY-MM-DD HH:mm:ss");
				var layoutToSecs = moment(layoutToDT).format("YYYY-MM-DD HH:mm:ss");
				console.log("Scheduler: LayoutID "+layoutID+": From: "+layoutFromSecs+" To: "+layoutToSecs+" (Now: "+now+")");
				if (layoutFromSecs > now && layoutFromSecs < nextLayoutStartDT) {
	                nextLayoutStartDT = layoutFromSecs;
				}
				if (layoutToSecs >= now && layoutToSecs <= nextLayoutFinishDT){
	                nextLayoutFinishDT = layoutToSecs;
				}
				if (layoutFromSecs < now && layoutToSecs == nextLayoutFinishDT) {
	                nextLayoutStartDT = layoutFromSecs;
				}
				if (layoutToSecs === nextLayoutFinishDT){
	                nextLayoutFinishID.push(layoutID);
				}
				else {
	                nextLayoutFinishID = [layoutID];
				}
			}
		}
		running = false;
	};
	
	run();
	scheduleTimer.postMessage({s:nextLayoutStartDT,f:nextLayoutFinishDT,n:nextLayoutFinishID,p:layoutid});
};

/** ---------------------------- END SCHEDULE MANAGER ---------------------------- **/

/** ---------------------------- Layout/Region Management ---------------------------- **/
var layoutManager = function(tmpLayout, layoutId){
	var width, height,bgcolor;
	/** Add a DIV to contain the whole layout **/
	var layoutNodeName = "layout-" + layoutId ;
	
	//Calculate the layout width
	 width = tmpLayout.firstChild.getAttribute("width");
	 //Calculate the layout height
	 height = tmpLayout.firstChild.getAttribute("height");
	 //Calculate the layout bgcolor
	 bgcolor = tmpLayout.firstChild.getAttribute("bgcolor");
	 
	/** Create the XML that will render the layoutNode **/
	var tmpXML = '<div id="' + layoutNodeName + '"style=" width:' + width + 'px ; height:' + height + 'px; background-color: ' + bgcolor + '"></div>'; 
    document.body.insertAdjacentHTML("afterbegin", tmpXML);
        
};
var regionManager = function(tmpLayout, regionId){
	
  var width,height,top,left;	
  // Calculate the region ID name
  var regionNodeName = regionId;
  
  //Calculate the region width
  width = tmpLayout.getElementById(regionId).getAttribute("width");
  //Calculate the region height
  height = tmpLayout.getElementById(regionId).getAttribute("height");
  //Calculate the region top
  top = tmpLayout.getElementById(regionId).getAttribute("top");
  //Calculate the region left
  left = tmpLayout.getElementById(regionId).getAttribute("left");
  
  /** Create a div for the region and add it **/
  var tmpXML = '<div id="' + regionNodeName + '"style="width:' + width + 'px ;height:' + height + 'px ;top:' + top + 'px ; left:' + left + 'px ;float:left"></div>'; 
  document.body.firstChild.insertAdjacentHTML("beforeend", tmpXML); 
  
  /** Iterate through the media items **/ 
  var type;
  for (var i = 0; i < tmpLayout.getElementById(regionId).childNodes.length; i++) {
	    if (tmpLayout.getElementById(regionId).childNodes[i].nodeName === "media") {
	    	type = tmpLayout.getElementById(regionId).childNodes[i].getAttribute("type");
	      break;
	    }        
	}
  switch (type) {
  case "video":
	  var vid_uri = tmpLayout.getElementById(regionId).childNodes[1].childNodes[0].childNodes[0].innerHTML;
	  var vid_options = tmpLayout.getElementById(regionId).childNodes[1].childNodes[0];
	  var video = document.createElement("VIDEO");
	  var vid_source = "file:///opt/usr/home/owner/content/Downloads/" + vid_uri;
	  video.autoplay="autoplay";
	  var isLoop,isMute,scaleType;
	  var NodeEl = document.getElementById(regionId);
	  try {isLoop = vid_options.getElementsByTagName("loop")[0].innerHTML; } catch (e) {}
	  try {isMute = vid_options.getElementsByTagName("mute")[0].innerHTML; } catch (e) {}
	  try {scaleType = vid_options.getElementsByTagName("scaleType")[0].innerHTML; } catch (e) {}
	  if (isLoop !== 1) {
		  video.loop="loop";
	  }
	  if (isMute === 1) {
		  video.muted="muted";
	  }
	  video.src = vid_source;
	  if(scaleType === "stretch"){
		  video.style.width = $("#" + regionNodeName).width() + "px";
		  video.style.height = $("#" + regionNodeName).height() + "px";
	  }else if(scaleType === "center"){
		  NodeEl.setAttribute("style","text-align:center");
	  } else {
		  video.style.width = $("#" + regionNodeName).width() + "px";
		  video.style.height = $("#" + regionNodeName).height() + "px";
	  }
	  
	  document.getElementById(regionNodeName).appendChild(video);
	  vid_uri = null;vid_options = null;video = null;vid_source =null;
	  isLoop = null;isMute = null;scaleType = null; NodeEl = null;
	  break;

  case "image":
	  var img_uri = tmpLayout.getElementById(regionId).childNodes[1].childNodes[0].childNodes[0].innerHTML;
	  var img_options = tmpLayout.getElementById(regionId).childNodes[1].childNodes[0];
	  var img = document.createElement("img");
	  var img_source = "file:///opt/usr/home/owner/content/Downloads/" + img_uri;
	  var NodeEl = document.getElementById(regionId);
	  img.src = img_source;
	  var isLoop,duration,useDuration;
	  var align,scaleType,valign;
	  
	  try {isLoop = tmpLayout.getElementById(regionId).childNodes[0].childNodes[0].innerHTML; } catch (e) {}
	  try {duration = tmpLayout.getElementById(regionId).childNodes[1].getAttribute("duration"); } catch (e) {}
	  try {useDuration = tmpLayout.getElementById(regionId).childNodes[1].getAttribute("useDuration"); } catch (e) {}
	  
	  try {align = img_options.getElementsByTagName("align")[0].innerHTML; } catch (e) {}
	  try {scaleType = img_options.getElementsByTagName("scaleType")[0].innerHTML; } catch (e) {}
	  try {valign = img_options.getElementsByTagName("valign")[0].innerHTML; } catch (e) {}
	  if(scaleType === "stretch"){
		  img.style.width = $("#" + regionNodeName).width() + "px";
		  img.style.height = $("#" + regionNodeName).height() + "px";
	  } else if(scaleType === "center"){
		  NodeEl.setAttribute("style","text-align:center");
		  img.style.width = $("#" + regionNodeName).width() + "px";
	  } else{
		  img.style.width = $("#" + regionNodeName).width() + "px";
		  img.style.height = $("#" + regionNodeName).height() + "px";
	  }
	  document.getElementById(regionNodeName).appendChild(img);
	  img_uri = null;img_options =null;img = null;img_source = null;
	  isLoop = null ; duration = null; useDuration = null;
	  align = null; scaleType = null; valign = null; NodeEl = null; 
	  break;
	  
  case "text":
	  var text = tmpLayout.getElementsByTagName("text")[0].textContent;
	  var text_duration = tmpLayout.getElementsByTagName("media")[0].getAttribute("duration");
	  var text_useDuration = tmpLayout.getElementsByTagName("media")[0].getAttribute("useDuration");
	  var text_effect;
	  try {text_effect = tmpLayout.getElementsByTagName("effect")[0].innerHTML;} catch(e){}
	  var possibleEffects = ["marqueeLeft","marqueeRight","marqueeUp","marqueeDown"];
	  var corresponding = ["left","right","up","down"];
	  //var text_speed = tmpLayout.getElementsByTagName("speed")[0].innerHTML;
	  console.info(regionNodeName);
	  var marquee = document.createElement("marquee");
	  marquee.insertAdjacentHTML("beforeend",text);
	  var effect;
	  if (possibleEffects.includes(text_effect)) {
	  	 effect = corresponding[possibleEffects.indexOf(text_effect)];
	  	//marquee.style.direction(effect);
	  	marquee.setAttribute("style","direction:" + effect);
	  }
	  //marquee.setAttribute("style","truespeed:" + text_speed);
	  document.getElementById(regionNodeName).appendChild(marquee);
	  text = null;text_duration = null;text_useDuration = null;marquee = null;
	  text_effect = null;possibleEffects = null;corresponding = null;effect = null;
	  break;
  
  
  case "webpage":
	  var web_uri = tmpLayout.getElementById(regionId).childNodes[1].childNodes[0].childNodes[0].innerHTML;
	  web_uri = decodeURIComponent(web_uri);
	  var web_options = tmpLayout.getElementById(regionId).childNodes[1].childNodes[0];
	  var web = document.createElement("iframe");
	  web.src = web_uri;
	  var pageHeight,pageWidth;
	  try {
		  pageHeight = web_options.getElementsByTagName("pageHeight")[0].innerHTML;
		  web.height = pageHeight;
		  pageWidth =  web_options.getElementsByTagName("pageWidth")[0].innerHTML;
		  web.width = pageWidth;
		} catch (e) {}
	  document.getElementById(regionNodeName).appendChild(web);
	  web_uri = null; web_options = null;web = null;
	  pageHeight = null; pageWidth = null;
	  break;
	  
  
  case "pdf":
	  var pdf_uri = tmpLayout.getElementById(regionId).childNodes[1].childNodes[0].childNodes[0].innerHTML;
	  var pdf_canvas = document.createElement("canvas");
	  var pdf_source = "file:///opt/usr/home/owner/content/Downloads/" + pdf_uri;
	  var NodeEl = document.getElementById(regionId);
	  NodeEl.setAttribute("style","text-align:center");
	  
	  var PDFinstance = new PDFManager(pdf_source, pdf_canvas);
	  pdf_canvas = PDFinstance.getCanvas();
	  document.getElementById(regionNodeName).appendChild(pdf_canvas);
	  NodeEl = null;
	  break;
	  	  
  default:
	  break;
  }
 
};

var createScheduled = function(currentLayout){
	  
	  try {
		// TODO : CLEAR INDEX.HTML BEFOR STARTING
		var layoutDiv = document.getElementById("layout-layout");
		document.body.removeChild(layoutDiv);
	  } catch (e) {
		// layout dosn't exist yet.Nothing to do.
	  }
	  currentLayout = $.parseXML(currentLayout);
	  
		if(currentLayout === null){		 
			currentLayout ='<?xml version="1.0"?><layout width="1920" height="1080" bgcolor="#000" schemaVersion="3"><region id="95" width="1920.0000" height="1080.0000" top="0.0000" left="0.0000"><options/><media id="127" type="video" render="native" duration="0" useDuration="0" fileId="146"><options><uri>146.mp4</uri><mute>0</mute></options><raw/></media></region><tags/></layout>';
			currentLayout = $.parseXML(currentLayout);
		}
			
		layoutManager(currentLayout, "layout");
		for (var int = 0; int < currentLayout.getElementsByTagName("region").length ; int++) {
			var regionId = currentLayout.getElementsByTagName("region")[int].getAttribute("id");
			regionManager(currentLayout, regionId);
		}
		
		
};

var create = function(currentLayout){
	  
	  try {
		// TODO : CLEAR INDEX.HTML BEFOR STARTING
		var layoutDiv = document.getElementById("layout-layout");
		document.body.removeChild(layoutDiv);
	  } catch (e) {
		// layout dosn't exist yet.Nothing to do.
	  }
	  currentLayout = $.parseXML(currentLayout);
	  
		if(currentLayout === null){		 
			currentLayout ='<?xml version="1.0"?><layout width="1920" height="1080" bgcolor="#000" schemaVersion="3"><region id="95" width="1920.0000" height="1080.0000" top="0.0000" left="0.0000"><options/><media id="127" type="video" render="native" duration="0" useDuration="0" fileId="146"><options><uri>146.mp4</uri><mute>0</mute></options><raw/></media></region><tags/></layout>';
			currentLayout = $.parseXML(currentLayout);
		}
			
		layoutManager(currentLayout, "layout");
		for (var int = 0; int < currentLayout.getElementsByTagName("region").length ; int++) {
			var regionId = currentLayout.getElementsByTagName("region")[int].getAttribute("id");
			regionManager(currentLayout, regionId);
		}
		layoutName = null;
		layout = undefined;
		// START THE SCHEDULE MANAGER
		ScheduleManager();
};

/** -------------------------- END Layout/Region Management -------------------------- **/

/** -------------------- FUNCTIONS TO WRITE/READ THE FILES FROM INTERNAL MEMORY -------------------- **/
var MagicSignConfig;
var readConfig = function(){
	 
	function onsuccess(files)
	{
	   for (var i = 0; i < files.length; i++)
	   {
	      if (files[i].isDirectory === false)
	      {
	         if(files[i].name === 'MagicSignConfig.json'){
	    	 files[i].readAsText(function(str)
	         {
	            //console.log("The config file content " + str);
	            MagicSignConfig = JSON.parse(str);
	            //appAuth();
	         }, function(e)
	         {
	            console.log("Error " + e.message); 
	            MagicSignConfig = null;
	         }, "UTF-8");
	      	}
	      }
	   }
	}


	function onerror(error)
	{
	   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	}

	var documentsDir;
	tizen.filesystem.resolve('wgt-package', function(dir)
	{
	   documentsDir = dir;
	   dir.listFiles(onsuccess, onerror);
	}, function(e)
	{
	   console.log("Error" + e.message);
	}, "r");
};

var readInternalRF = function(){
  try {
	  // MAKE THE REQUIRED FILES FILE IF DON'T EXIST YET
	  makeRequiredFilesText();
	  // READ THE REQUIRED FILES STORED IN INTERNAL MEMORY.RESULT XML FILE : requiredFilesInternal
	  requiredFilesInternal = "<files></files>";
	  requiredFilesInternal = $.parseXML(requiredFilesInternal);
		function onsuccess(files)
		{
		   for (var i = 0; i < files.length; i++)
		   {
		      if (files[i].isDirectory === false)
		      {
		         if(files[i].name === 'RequiredFiles.txt'){
		    	 files[i].readAsText(function(str)
		         {
		            //console.log("The RF file content " + str);
		            requiredFilesInternal = $.parseXML(str);
		            var r = requiredFilesInternal.getElementsByTagName("RequiredFilesXml")[0];
		            requiredFilesInternal = $.parseXML(r.textContent);
		         }, function(e)
		         {
		            console.log("Error " + e.message); 
		            requiredFilesInternal = null;
		         }, "UTF-8");
		      	}
		      }
		   }
		}


		function onerror(error)
		{
		   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
		}

		var documentsDir;
		tizen.filesystem.resolve('downloads', function(dir)
		{
		   documentsDir = dir;
		   dir.listFiles(onsuccess, onerror);
		}, function(e)
		{
		   console.log("Error" + e.message);
		}, "r");
} catch (e) {
	console.log("error in reading RF file");
}	
};

var readInternalSchdl = function(){
  try {
	  	// MAKE THE SCHEDULE FILE IF DON'T EXIST YET
	  	makeScheduleText();
		// READ THE SCHEDULE STORED IN INTERNAL MEMORY.RESULT XML FILE : scheduleInternal
	  	scheduleInternal = "<schedule></schedule>";
	  	scheduleInternal = $.parseXML(scheduleInternal);
		function onsuccess(files)
		{
		   for (var i = 0; i < files.length; i++)
		   {
		      if (files[i].isDirectory === false)
		      {
		         if(files[i].name === 'Schedule.txt'){
		    	 files[i].readAsText(function(str)
		         {
		            //console.log("The Schedule content " + str);
		            scheduleInternal = $.parseXML(str);
		            var r = scheduleInternal.getElementsByTagName("ScheduleXml")[0];
		            scheduleInternal = $.parseXML(r.textContent);
		         }, function(e)
		         {
		            console.log("Error " + e.message); 
		            scheduleInternal = null;
		         }, "UTF-8");
		      	}
		      }
		   }
		}


		function onerror(error)
		{
		   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
		}

		var documentsDir;
		tizen.filesystem.resolve('downloads', function(dir)
		{
		   documentsDir = dir;
		   dir.listFiles(onsuccess, onerror);
		}, function(e)
		{
		   console.log("Error" + e.message);
		}, "r");
} catch (e) {
	console.log("errorin reading schedule file");
}
};

var fileList = [];
var readCacheManager = function(){
  try {
	  	// MAKE THE CACHE FILE IF DON'T EXIST YET
	  	makeCacheManager();
		// READ THE CACHE STORED IN INTERNAL MEMORY.RESULT XML FILE : cacheInternal
		function onsuccess(files)
		{
		   for (var i = 0; i < files.length; i++)
		   {
		      if (files[i].isDirectory === false)
		      {
		        if (! fileList.includes(files[i].name)) {
		        	fileList.push(files[i].name);
				}
		    	if(files[i].name === 'cacheManager.txt'){
		    	 files[i].readAsText(function(str)
		         {
		            console.log("The cache content " + str);
		            cacheInternal = $.parseXML(str);
		            
		            /**		var r = scheduleInternal.getElementsByTagName("_files")[0];
		            		scheduleInternal = $.parseXML(r.textContent);				**/
		         }, function(e)
		         {
		            console.log("Error " + e.message); 
		            cacheInternal = null;
		         }, "UTF-8");
		      	}
		      }
		   }
		   var cacheText = "";
		   for (var g = 0; g < fileList.length; g++) {
			   cacheText += "<Md5Resource>";
			   cacheText += "<path>" + fileList[g] + "</path>";
			   cacheText += "<cacheDate>" + moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") + "</cacheDate>";
			   cacheText += "</Md5Resource>";
		   }
		   updateCM(cacheText);
		}


		function onerror(error)
		{
		   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
		}

		var documentsDir;
		tizen.filesystem.resolve('downloads', function(dir)
		{
		   documentsDir = dir;
		   dir.listFiles(onsuccess, onerror);
		}, function(e)
		{
		   console.log("Error" + e.message);
		}, "r");
} catch (e) {
	console.log("errorin reading cache file");
}
};

var readLayoutAsText = function(l){
 try {
		function onsuccess(files)
		{
		   for (var i = 0; i < files.length; i++)
		   {
		      if (files[i].isDirectory === false)
		      {
		         if(files[i].name === l){
		    	 files[i].readAsText(function(str)
		         {
		            console.log("The file content " + str);
		            layout = str;
		            return str;
		         }, function(e)
		         {
		            console.log("Error " + e.message); 
		            layout = null;
		            return null;
		         }, "UTF-8");
		      	}
		      }
		   }
		}


		function onerror(error)
		{
		   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
		}

		var documentsDir;
		tizen.filesystem.resolve('downloads', function(dir)
		{
		   documentsDir = dir;
		   dir.listFiles(onsuccess, onerror);
		}, function(e)
		{
		   console.log("Error" + e.message);
		}, "rw");	
} catch (e) {
	console.log("error inreading layout file");
}

	
};	

var layoutListReference = [];
var layoutListSize = [];
var readLayouts = function(){
	 try {
			function onsuccess(files)
			{
			   for (var i = 0; i < files.length; i++)
			   {
			      if (files[i].isDirectory === false)
			      {
			         if(files[i].name.endsWith(".xlf") && ! layoutListReference.includes(files[i].name)){
			         layoutListReference.push(files[i].name);
			         layoutListSize.push(files[i].fileSize);
			         files[i].readAsText(function(str)
			         {
			            console.log("The file content " + str);
			            layoutList.push(str);
			            return str;
			         }, function(e)
			         {
			            console.log("Error " + e.message); 
			            layout = null;
			            return null;
			         }, "UTF-8");
			      	}
			      }
			   }
			}


			function onerror(error)
			{
			   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
			}

			var documentsDir;
			tizen.filesystem.resolve('downloads', function(dir)
			{
			   documentsDir = dir;
			   dir.listFiles(onsuccess, onerror);
			}, function(e)
			{
			   console.log("Error" + e.message);
			}, "rw");	
	} catch (e) {
		console.log("error inreading layout file");
	}

		
	};	
	
var listFiles = function (directory) {
	/**
	 List files in specified directorie
	*/

	function onsuccess(files){
	   console.info(files);
		for (var i = 0; i < files.length; i++){
			console.log("There are " + files.length  + " files/directories in the selected folder");
			if (!files[i].isDirectory)
			{
	    	 console.log("name :" + files[i].name);
	    	 console.log("fullPath :" + files[i].fullPath); 
	    	 console.log("fileSize :" + files[i].fileSize); 
	    	 console.log("created :" + files[i].created);
	    	
			}
		}
	}

	function onerror(error) {console.log("The error " + error.message + " occurred when listing the files in the selected folder");}

	var documentsDir;
	tizen.filesystem.resolve(directory, function(dir)
	{
	   documentsDir = dir;
	   dir.listFiles(onsuccess,onerror);
	}, function(e)
	{
	   console.log("Error" + e.message);
	}, "rw");
};	

var updateCM = function(Cache){
	
};

var updateRF = function(ReqFiles){
	 var documentsDir;
	 var documentList = [];
	 function onsuccess(files) {
	   for (var i = 0; i < files.length; i++) {
	     documentList.push(files[i].name);
	   }

	   var RF;
	   if(documentList.includes("RequiredFiles.txt")){
		   var callback = function(modifiedDirectory) {
			    RF = documentsDir.createFile("RequiredFiles.txt");
			    console.log('deleteFile() is successfully done.');
			    if (RF !== null && RF !== undefined) {
				     RF.openStream(
				       "w",
				       function(fs) {
				         fs.write(ReqFiles);
				         fs.close();
				         console.log("update RF done !");
				       }, function(e) {
				         console.log("Error " + e.message);
				       }, "UTF-8"
				     );
				   }
			};
		   documentsDir.deleteFile("downloads/RequiredFiles.txt", callback);
		   }
	   

	   
	 }

	 function onerror(error) {
	   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	 }

	 tizen.filesystem.resolve(
	   'downloads',
	   function(dir) {
	     documentsDir = dir;
	     dir.listFiles(onsuccess, onerror);
	   }, function(e) {
	     console.log("Error" + e.message);
	   }, "rw"
	 );
};

var updateSchedule = function(Schdle){
	 var documentsDir;
	 var documentList = [];
	 function onsuccess(files) {
	   for (var i = 0; i < files.length; i++) {
	     documentList.push(files[i].name);
	   }

	   var Schdl;
	   if(documentList.includes("Schedule.txt")){
		   var callback = function(modifiedDirectory) {
			    Schdl = documentsDir.createFile("Schedule.txt");
			    console.log('deleteFile() is successfully done.' );
			    if (Schdl !== null && Schdl !== undefined) {
				     Schdl.openStream(
				       "w",
				       function(fs) {
				         fs.write(Schdle);
				         fs.close();
				         console.log("update schdule done !");
				       }, function(e) {
				         console.log("Error " + e.message);
				       }, "UTF-8"
				     );
				   }
			};
		   documentsDir.deleteFile("downloads/Schedule.txt", callback);
		   }
	 
	 }

	 function onerror(error) {
	   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	 }

	 tizen.filesystem.resolve(
	   'downloads',
	   function(dir) {
	     documentsDir = dir;
	     dir.listFiles(onsuccess, onerror);
	   }, function(e) {
	     console.log("Error" + e.message);
	   }, "rw"
	 );
};

var makeCacheManager = function(){
	 var documentsDir;
	 var documentList = [];
	 function onsuccess(files) {
	   for (var i = 0; i < files.length; i++) {
	     documentList.push(files[i].name);
	   }

	   var RF;
	   if(!documentList.includes("cacheManager.txt")){ RF = documentsDir.createFile("cacheManager.txt");
	   var cache = '<?xml version="1.0" encoding="utf-8"?><CacheManager xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><_files></_files></CacheManager>';

	   if (RF !== null && RF !== undefined) {
	     RF.openStream(
	       "w",
	       function(fs) {
	         fs.write(cache);
	         fs.close();
	         console.log("make CM done!");
	       }, function(e) {
	         console.log("Error " + e.message);
	       }, "UTF-8"
	     );
	   }
	   }
	 }

	 function onerror(error) {
	   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	 }

	 tizen.filesystem.resolve(
	   'downloads',
	   function(dir) {
	     documentsDir = dir;
	     dir.listFiles(onsuccess, onerror);
	   }, function(e) {
	     console.log("Error" + e.message);
	   }, "rw"
	 );
};

var makeRequiredFilesText = function(){
	 var documentsDir;
	 var documentList = [];
	 function onsuccess(files) {
	   for (var i = 0; i < files.length; i++) {
	     documentList.push(files[i].name);
	   }

	   var RF;
	   if(!documentList.includes("RequiredFiles.txt")){ RF = documentsDir.createFile("RequiredFiles.txt");}
	   

	   if (RF !== null && RF !== undefined) {
	     RF.openStream(
	       "w",
	       function(fs) {
	         fs.write(requiredFilesText);
	         fs.close();
	         console.log("make RF done!");
	       }, function(e) {
	         console.log("Error " + e.message);
	       }, "UTF-8"
	     );
	   }
	 }

	 function onerror(error) {
	   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	 }

	 tizen.filesystem.resolve(
	   'downloads',
	   function(dir) {
	     documentsDir = dir;
	     dir.listFiles(onsuccess, onerror);
	   }, function(e) {
	     console.log("Error" + e.message);
	   }, "rw"
	 );
};

var makeScheduleText = function(){
	 var documentsDir;
	 var documentList = [];
	 function onsuccess(files) {
	   for (var i = 0; i < files.length; i++) {
	     documentList.push(files[i].name);
	   }

	   var Schdl;
	   if(!documentList.includes("Schedule.txt")){ Schdl = documentsDir.createFile("Schedule.txt");}
	   

	   if (Schdl !== null && Schdl !== undefined) {
	     Schdl.openStream(
	       "w",
	       function(fs) {
	         fs.write(scheduleText);
	         fs.close();
	         console.log("make schdule done !");
	       }, function(e) {
	         console.log("Error " + e.message);
	       }, "UTF-8"
	     );
	   }
	 }

	 function onerror(error) {
	   console.log("The error " + error.message + " occurred when listing the files in the selected folder");
	 }

	 tizen.filesystem.resolve(
	   'downloads',
	   function(dir) {
	     documentsDir = dir;
	     dir.listFiles(onsuccess, onerror);
	   }, function(e) {
	     console.log("Error" + e.message);
	   }, "rw"
	 );
};


/** ------------------ END FUNCTIONS TO READ THE FILES FROM INTERNAL MEMORY ------------------ **/

/** ----------------------------------- BEGIN EVENT FUNCTIONS ----------------------------------- **/
function onRFChange(){
	console.log("call from required files checker");
	RequiredFiles(access_tocken);
	
}

function onSCHDLChange(){
	console.log("call from schedule checker"); 
	Scheduled(access_tocken);
	//scheduleResponse.addEventListener("load",ScheduleManager());
}

function onSCHDLTimer(data){
	console.log("call from schedule timer"); 
	console.log(data);
	
	createScheduled(layoutList[layoutListReference.indexOf(data[data.length - 1] + ".xlf")]);
	
}
function onRpiSocket(data){
	console.log(data);
}

/** ----------------------------------- END EVENT FUNCTIONS ----------------------------------- **/

/** ------------------ END FUNCTIONS  ------------------ **/
var worker; 
var scheduleWorker;
var scheduleTimer;
var rpiSocket;
var init = function(){
	console.log("init");
	if(worker === undefined)			{ worker = new Worker("js/workers/RequiredFilesChecker.js");}
	if(scheduleWorker === undefined)	{ scheduleWorker = new Worker("js/workers/ScheduleChecker.js");} 
	if(scheduleTimer === undefined)		{ scheduleTimer = new Worker("js/workers/ScheduleTimerThread.js");} 
	if(rpiSocket === undefined)			{ rpiSocket = new Worker("js/workers/RaspberrypiSocket.js");} 
	
	
	// READ THE MAGIC SIGN CONFIG FILE
	readConfig();
	
	// READ CACHE MANAGER
	readCacheManager();
	
	// READ THE LAYOUTS AVAILABLE
	readLayouts();
	
	// READ THE MAGIC SIGN REQUIRED FILES
	readInternalRF();
	
	// READ THE MAGIC SIGN SCHEDULE FILE
	readInternalSchdl();
	
	// START THE XMDS FUNCTIONS
    var xmds = function() {
    	g_displayName = setDisplayName();
    	g_clientVersion = setClientVersion();
    	g_macAdress = getMacAdress();
    	g_hardwareKey = setHardwareKey();
    	
    	var resolveAfterAuth = function(){
    		return new Promise(resolve => {
    			try {
    				appAuth();
				} catch (e) {
					console.log(e);
				}
    			
    			resolve(access_tocken);
    		});		
    	}; 
    	resolveAfterAuth()
    	.then(function(tocken){	
    		scheduleResponse = Schedule(tocken);				
    		registerDisplayResponse = registerDisplay(tocken);	
    		requiredFilesResponse = RequiredFiles(tocken); 		
    		
    		
    		});
    	
    	
	};		xmds();
	
	
	
	//LISTEN TO THE REQUIRED FILES CHANGE IN THE SERVER
	
	worker.onmessage = function(evt){	
		console.log(evt.data);
		if(evt.data === "required files changed"){
			layout = null;
			onRFChange();
			
			}
		
		}; 
	
	//LISTEN TO THE SCHEDULE CHANGE IN THE SERVER
	
	scheduleWorker.onmessage = function(evt){	
		console.log(evt.data);
		if(evt.data === "schedule changed"){
			onSCHDLChange();
			
			}
		}; 	
		
		//LISTEN TO THE SCHEDULE TIMER FOR PLANIFIED LAYOUT
		
		scheduleTimer.onmessage = function(evt){	
		//console.log(evt.data);
		onSCHDLTimer(evt.data);
		}; 	
		
		//LISTEN TO THE RASPBERRY PI SOCKET 
		
		rpiSocket.onmessage = function(evt){	
		//console.log(evt.data);
		onRpiSocket(evt.data);
		}; 
};



window.onload = init;




