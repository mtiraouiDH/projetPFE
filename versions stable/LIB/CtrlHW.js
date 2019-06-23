"use strict";
var b2bcontrol = b2bapis.b2bcontrol;
var CtrlHW = class {
	constructor(){
		this.TotalMemory = null;
		this.AvailableRamUsage = null;
		this.setup();
	}
	setup(){
		/**
		this.getCPUUsage();
		this.getRamUsage();
		this.getScreenCapture();
		**/
	}
	powerReboot(){
		console.log("[powerReboot] function call");
		
		var onSuccess = function() {
			
			console.log("[powerReboot] success ");
		};
		var onError = function(error) {
			
			console.log("[powerReboot] code :" + error.code + " error name: " + error.name + "  message " + error.message);
		};
		
		b2bcontrol.rebootDevice(onSuccess, onError);
	}
	setPowerOff(){
		console.log("[setPowerOff] function call");
		
		var onSuccess = function() {
			
			console.log("[setPowerOff] success ");
		};
		var onError = function(error) {
			
			console.log("[setPowerOff] code :" + error.code + " error name: " + error.name + "  message " + error.message);
		};
		
		b2bcontrol.setPowerOff(onSuccess, onError);
	}
	getCPUUsage(){
		console.log("[getCPUUsage] function call");
		
		 function onSuccess(cpu) 
		 {
			 console.log("The Load on device is " + cpu.load);
		 }
		 
		 function onError(error) 
		 {		 
			 console.log("Not supported: " + error.message);	 
		 }
		 tizen.systeminfo.getPropertyValue("CPU", onSuccess, onError);
	}
	getRamUsage() {
		
		console.log("[getRAMUsage] function call");
		this.TotalMemory = tizen.systeminfo.getTotalMemory();
		this.AvailableRamUsage = tizen.systeminfo.getAvailableMemory() ;
		
		console.log("The available memory size is " + this.AvailableRamUsage + " bytes.");
		
		console.log("The TotalMemory size is " + this.TotalMemory + " bytes."); 
	}
	getScreenCapture() {
		
		console.log("[getScreenCapture] function call");
		var onSuccess = function(val) {
			
			console.log("[getScreenCapture]success to call asyncFunction: " + val);
		};
		var onError = function(error) {
			
			console.log("[getScreenCapture] code :" + error.code + " error name: " + error.name + "  message " + error.message);
		};
		
		b2bcontrol.captureScreen(onSuccess, onError); 
	}
	setHDMISource(){
		var connectedVideoSources;
		function successCB(source, type) {
		    console.log("setSource() is successfully done. source name = " + source.name + ", source port number = " + source.number);
		}

		function errorCB(error) {
		    console.log("setSource() is failed. Error name = "+ error.name + ", Error message = " + error.message);
		}
		function systemInfoSuccessCB(videoSource) {
		    connectedVideoSources = videoSource.connected;
		    for (var i = 0; i < connectedVideoSources.length; i++) {
		        console.log("--------------- Source " + i + " ---------------");
		        console.log("type = " + connectedVideoSources[i].type);
		        console.log("number = " + connectedVideoSources[i].number);
		        if (connectedVideoSources[i].type === "HDMI") {
		            // set HDMI as input source of the TV window
		            tizen.tvwindow.setSource(connectedVideoSources[i], successCB, errorCB);
		            break;
		        }
		    }
		}

		function systemInfoErrorCB(error) {
		    console.log("getPropertyValue(VIDEOSOURCE) is failed. Error name = "+ error.name + ", Error message = " + error.message);
		}
		try {
		    tizen.systeminfo.getPropertyValue("VIDEOSOURCE", systemInfoSuccessCB, systemInfoErrorCB);
		} catch (error) {
		    console.log("Error name = "+ error.name + ", Error message = " + error.message);
		}
	}
	// Gets the list of available windows.
	
	getAvailableWindows() {
        function successCB(availableWindows) {
            var html = [];
            for (var i = 0; i < availableWindows.length; i++) {
                log("Available window ["+ i + "] = " + availableWindows[i]);
            }
        }

        try {
            tizen.tvwindow.getAvailableWindows(successCB);
        } catch (error) {
            log("Error name = "+ error.name + ", Error message = " + error.message);
        }
    }
	// Gets information about the current source of a specified TV hole window.
	
	getSource() {
        try {
            var source = tizen.tvwindow.getSource();
            log("Source type: " + source.type + "number = " + source.number);
        } catch (error) {
            console.log("Error name = "+ error.name + ", Error message = " + error.message);
        }
    }
}