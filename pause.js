var currBPM = 0;
var desiredBPM = globalThis.defaultDesiredBPM;
var videoElements;
var connected = false;
var timerSet = false;
var penalized = false;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message === 'hello') {
		console.log("halelujah", desiredBPM)
		sendResponse({ desiredBPM: desiredBPM })
	}
	
	if (message[0] === 'button-pressed') {
		console.log("wohooo", message[1])
		desiredBPM = message[1]
		handleCharacteristicValueChanged = (event) => {

			(async () => {
				chrome.runtime.sendMessage({ updateButton: "true" })
			})();

			let value = event.target.value;
			currBPM = value.getUint8(1);
			console.log(currBPM);
			console.log("desiredBPM", desiredBPM);
			(async () => {
				chrome.runtime.sendMessage({ currBPM: currBPM })
			})();
			if (currBPM < desiredBPM) {
				if (timerSet == false) {
					
					timerSet = true
					pauseVideo(videoElements[0])
				}
			}
			else {
				timerSet = false 
				if (penalized) {
					playVideo(videoElements[0])
					penalized = false
				}
			}
		}


		page = document.documentElement
		page.addEventListener('pointerover', function (event) {
			if (connected == false) {
				navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
					.then(device => device.gatt.connect()) 
					.then(server => server.getPrimaryService('heart_rate')) 
					.then(service => service.getCharacteristic('heart_rate_measurement')) 
					.then(characteristic => characteristic.startNotifications())
					.then(characteristic => {
						characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
					})                                                                                                  
					.catch(error => { console.error(error); })
				connected = true
				videoElements = document.querySelectorAll("video");
				
			}
		})
	}
});

function pauseVideo(videoElement) {
	if (timerSet == true) {
		videoElement.pause();
		penalized = true
		timerSet = false;
	}
		
}

function playVideo(videoElement) {
	videoElement.play();
}
