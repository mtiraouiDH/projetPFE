"use strict";

var ScreenShot = class{
	constructor(ServerKey, HardwareKey){
		this.ServerKey = ServerKey;
		this.HardwareKey = HardwareKey;
		this.ScreenShotRequested = false;
		this.ImageUri = "downloads/122.jpg";
		this.ImageName = "122.jpg";
		this.ImageLength = 0;
		this.base64 = null;

	}
	isScreenShotRequested(){

	}
	getBase64(){
		tizen.filesystem.resolve(this.ImageUri,function(file){
			var imageFileObj = file;
			if(imageFileObj) { 
				imageFileObj.openStream(
					'r',
					function(fileStream) {
						this.ImageLength = fileStream.bytesAvailable;
						this.base64 = fileStream.readBase64(this.ImageLength);
						fileStream.close();
					});
			}
		}); 
	}
	submitScreenShot(){

	}
}