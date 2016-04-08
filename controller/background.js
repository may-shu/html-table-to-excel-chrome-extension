chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            identity : request.identity
        }, function (response) {
            
        });
    });

});