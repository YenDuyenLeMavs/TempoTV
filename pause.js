/*const access_token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzhaNTMiLCJzdWIiOiJCQkZNTkwiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd251dCB3cHJvIHdzbGUgd2VjZyB3c29jIHdhY3Qgd294eSB3dGVtIHd3ZWkgd2NmIHdzZXQgd3JlcyB3bG9jIiwiZXhwIjoxNjcyMjMyNTMzLCJpYXQiOjE2NzIyMDM3MzN9.EKW6SLaLtoOBZwPAboJStkXSwQCjb5JknWUNbk5TIzc"

fetch('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json', {
	method: "GET",
	headers: { "Authorization": "Bearer " + access_token }
})
	.then(response => response.json())
	.then(json => console.log("heart info?   ", json)); */
/*var heartRate = 0;
var videoElements;
var connected = false;

handleCharacteristicValueChanged = (event) => {
	let value = event.target.value;
	heartRate = value.getUint8(1);
	console.log(heartRate);
	
	if (heartRate < 90) {
		pauseVideo(videoElements[0])
	}
	else {
		playVideo(videoElements[0])
	}
}
//video = document.querySelectorAll("video")[0]


page = document.documentElement
page.addEventListener('pointerover', function (event) {
	if (connected == false) {
		navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] }) // we filter the devices, displaying only those with heartrate services
			.then(device => device.gatt.connect()) // after the user select a device, we return the selected one
			.then(server => server.getPrimaryService('heart_rate')) // we get the service
			.then(service => service.getCharacteristic('heart_rate_measurement')) // then the characteristics
			.then(characteristic => characteristic.startNotifications())
			.then(characteristic => {
				characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged); // then we subscribe to the characteristic notifications
			})                                                                                                    // and set the callback function
			.catch(error => { console.error(error); })// we display the errors on the console
		connected = true
		videoElements = document.querySelectorAll("video");

	}
	console.log("mousey move")
})
*/
//import { defaultDesiredBPM } from '/module.js'
//const defaultDesiredBPM = require('/module.js')
var currBPM = 0;
//var defaultDesiredBPM = 90;
var desiredBPM = globalThis.defaultDesiredBPM;
console.log("at begin of pause.js, desiredBPM = ", desiredBPM)
var maxCatchUpTime = 5000
var videoElements;
var connected = false;
var timerSet = false;
var penalized = false;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("??????????????asdfadsf????????????????")
	/*navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] }) // we filter the devices, displaying only those with heartrate services
		.then(device => device.gatt.connect()) // after the user select a device, we return the selected one
		.then(server => server.getPrimaryService('heart_rate')) // we get the service
		.then(service => service.getCharacteristic('heart_rate_measurement')) // then the characteristics
		.then(characteristic => characteristic.startNotifications())
		.then(characteristic => {
			characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged); // then we subscribe to the characteristic notifications
		})                                                                                                    // and set the callback function
		.catch(error => { console.error(error); })// we display the errors on the console
*/
	// 2. A page requested user data, respond with a copy of `user`
	/*
	if (message === 'hello') {
		console.log("hellooooo???")
		sendResponse(desiredBPM)
	
	}*/
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
					//setTimeout(() => { pauseVideo(videoElements[0]) }, maxCatchUpTime);
					pauseVideo(videoElements[0])
				}
			}
			else {
				timerSet = false // cancel the count down
				if (penalized) {
					playVideo(videoElements[0])
					penalized = false
				}
			}
		}


		page = document.documentElement
		page.addEventListener('pointerover', function (event) {
			if (connected == false) {
				navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] }) // we filter the devices, displaying only those with heartrate services
					.then(device => device.gatt.connect()) // after the user select a device, we return the selected one
					.then(server => server.getPrimaryService('heart_rate')) // we get the service
					.then(service => service.getCharacteristic('heart_rate_measurement')) // then the characteristics
					.then(characteristic => characteristic.startNotifications())
					.then(characteristic => {
						characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged); // then we subscribe to the characteristic notifications
						/*characteristic.addEventListener('characteristicvaluechanged', function () {
							var currHeartRate = characteristic.readValue()
							characteristic.addEventListener('characteristicvaluechanged', function () {
								handleCharacteristicValueChanged(currHeartRate, desiredHeartRate)
							}, false)
						})*/
					})                                                                                                    // and set the callback function
					.catch(error => { console.error(error); })// we display the errors on the console
				connected = true
				videoElements = document.querySelectorAll("video");
				
			}
			console.log("mousey move")
		})
	}
});

console.log("alksdjf;lakjdslfkjas;dlfjk")

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
/*
window.addEventListener("load", function (e) {
	videoElements = document.querySelectorAll("video");
	for (let i = 0; i < videoElements.length; i++) {
		console.log("asdfasdfasdf")
		console.log(videoElements[i])
		//setTimeout(() => { pauseVideo(videoElements[i]) }, 15000);
		//setTimeout(() => { playVideo(videoElements[i]) }, 20000);
	}
	//videoElements[0].pause()
	//setTimeout(() => { pauseVideo(videoElements[0]) }, 15000);

});*/
console.log("????")

console.log("whatttt")