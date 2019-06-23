 addEventListener( "message", function(evt){ 		
		// Define WebSocket url
        var webSocketURL = "ws://192.168.1.19:8081/ws";

        // Define WebSocket
        var webSocket = new WebSocket(webSocketURL);

        // When the WebSocket connection is established
        webSocket.onopen = function (e) {
            console.log('connection open, readyState : ' + e.target.readyState);
        };

        // When the WebSocket message has been received
        webSocket.onmessage = function (e) {
            console.log('server message : ' + e.data);
            postMessage(e.data);
        };

        // When fail the WebSocket connection or the WebSocket connection is closed with prejudice
        webSocket.onerror = function (e) {
            console.log('error, readyState : ' + e.target.readyState);
        };

        // When the WebSocket connection is closed
        webSocket.onclose = function (e) {
            console.log('current readyState : ' + e.target.readyState);
        };
        function callback(){
        	sendMessage('GENDER PERCENTAGE');
        	setTimeout(callback, 900*1000);
        }
        
        callback();

        function sendMessage(msg) {
            if (webSocket.readyState === 1) {
                webSocket.send(msg);
            }
        }
 });

       
