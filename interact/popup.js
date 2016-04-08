window.onload = function() {
    document.getElementById( 'export' ).onclick = function() {
        var value = document.getElementById( 'table-identification' ).value;
        
        chrome.extension.sendMessage({
            identity : value
        });
    }
}