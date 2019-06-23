 
var wait = 0;
var tocken_api;
var schedule = new String();
var HWkey;
addEventListener( "message", function(evt){
	
	tocken_api = evt.data.t;
	schedule = evt.data.r;
	HWkey = evt.data.k;

if(tocken_api !== undefined ||schedule !== undefined){
function checkSchedule() {
	// wait 3 minutes befor start checking
	var waitFct = function(){if(wait === 0){wait = 1;setTimeout(waitFct,3*1000);}} 
	waitFct();
	if (tocken_api !== undefined) {
		var data = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:tns=\"urn:xmds\" xmlns:types=\"urn:xmds/encodedTypes\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\r\n  <soap:Body soap:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\r\n    <tns:Schedule>\r\n      <serverKey xsi:type=\"xsd:string\">123456</serverKey>\r\n      <hardwareKey xsi:type=\"xsd:string\">" + HWkey + "</hardwareKey>\r\n    </tns:Schedule>\r\n  </soap:Body>\r\n</soap:Envelope>";

		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.addEventListener("readystatechange", function () {
		  if (this.readyState === 4) { 	
			  var parsedResp = new String();
			  parsedResp = (this.response);
			  if (parsedResp.localeCompare(schedule) !== 0)       // schedule changed in server. Post that to main thread !
			  { postMessage( "schedule changed" ); } 
			  else { postMessage( "schedule did not change" ); } // schedule haven't changed in server. 
			  setTimeout(checkSchedule, 60000);
			  data = null, xhr = null, parsedResp = null;
		  }
		});

		xhr.open("POST", "http://192.168.1.191:8080/magicsign-v2/web/xmds.php?v=5&method=Schedule");
		xhr.setRequestHeader("content-type", "text/xml");
		xhr.setRequestHeader("authorization", "Bearer "+tocken_api);
		xhr.setRequestHeader("cache-control", "no-cache");
		

		xhr.send(data);

	}
	
}

checkSchedule();
} 			 // END IF STATEMENT
} ); 		// END EVENT LISTENER