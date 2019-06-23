
importScripts("../moment.js");
var nextLayoutStartDT;
var nextLayoutFinishDT;
var nextLayoutFinishID;
var playingLayoutID;
var currentTime;
var notified = false;
var offSchedule = false;
var offScheduleDT;
var nextLayoutPlayingID = [];
addEventListener( "message", function(evt){
	
	
	function callback(){
		nextLayoutStartDT = evt.data.s;
		nextLayoutFinishDT = evt.data.f;
		nextLayoutFinishID = evt.data.n;
		playingLayoutID = evt.data.p;
		currentTime =  moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
		if (currentTime > nextLayoutStartDT && currentTime < nextLayoutFinishDT && !notified) {
			postMessage(nextLayoutFinishID);
			notified = true;
			offScheduleDT = nextLayoutFinishDT;
			
		} else if (offScheduleDT < currentTime && !offSchedule) {
			nextLayoutPlayingID.push(playingLayoutID);
			postMessage(nextLayoutPlayingID);
			notified = false;
			offSchedule = true;
			
		}
		setTimeout(callback, 20000);
	}
	
	notified = false;
	offSchedule = false;
	callback();
	
});