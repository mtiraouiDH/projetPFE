
var tocken_api;
var requiredFiles = new String();
var HWkey;
addEventListener( "message", function(evt){
	
	tocken_api = evt.data.t;
	requiredFiles = evt.data.r;
	HWkey = evt.data.k;

if(tocken_api !== undefined ||requiredFiles !== undefined){
	function checkRequiredFiles() {
		
		if (tocken_api !== undefined && requiredFiles !== null) {
			var data = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:tns=\"urn:xmds\" xmlns:types=\"urn:xmds/encodedTypes\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\r\n  <soap:Body soap:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">\r\n    <tns:RequiredFiles>\r\n      <serverKey xsi:type=\"xsd:string\">"+"123456"+"</serverKey>\r\n      <hardwareKey xsi:type=\"xsd:string\">"+HWkey+"</hardwareKey>\r\n    </tns:RequiredFiles>\r\n  </soap:Body>\r\n</soap:Envelope>";

			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;

			

			xhr.open("POST", "http://192.168.1.191:8080/magicsign-v2/web/xmds.php?v=5&method=RequiredFiles");
			xhr.setRequestHeader("content-type", "text/xml");
			xhr.setRequestHeader("authorization", "Bearer "+tocken_api);
			xhr.setRequestHeader("cache-control", "no-cache");
			
			xhr.addEventListener("readystatechange", function () {
				  if (this.readyState === 4) { 	
					  var parsedResp = new String();
					  parsedResp = (this.response);
					  if (parsedResp.localeCompare(requiredFiles) !== 0)       // Required files changed in server. Post that to main thread !
					  { postMessage( "required files changed");} 
					  else { postMessage( "required files did not change" ); } // Required files haven't changed in server. 
					  data = null, xhr = null, parsedResp = null;
					  setTimeout(checkRequiredFiles, 60000);
				  }
				});

			xhr.send(data);

		}
		
	}

  checkRequiredFiles();
} 			 // END IF STATEMENT
} ); 		// END EVENT LISTENER




