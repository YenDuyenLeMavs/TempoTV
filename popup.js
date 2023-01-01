(async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, "hello");
    if (response) {
        document.getElementById("desiredBPM").value = response.desiredBPM
    }       
})();

chrome.runtime.onMessage.addListener((message) => {
    console.log(message.currBPM)
    document.getElementById("currBPMLabel").style.visibility = "visible"
    document.getElementById("currBPM").style.visibility = "visible"

    if (message.currBPM != null)
        document.getElementById("currBPM").innerHTML = message.currBPM
    if (message.updateButton == "true")
        document.getElementById("connectButton").innerHTML = "Update Desired BPM"
})

if (navigator.bluetooth === undefined) {
    p.textContent = "Web bluetooth is not supported";
}
else {
    let button = document.getElementById("connectButton");

    function buttonPressed() {        
        let message = ["button-pressed", document.getElementById("desiredBPM").value]
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log(message[1])
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    }
  

    button.addEventListener("click", buttonPressed);
}