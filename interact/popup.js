window.onload = function() {
    document.getElementById( 'export' ).onclick = function() {
        var value = document.getElementById( 'table-identification' ).value;
        
        chrome.extension.sendMessage({
            type : 'export',
            identity : value
        });
    };
    
    document.getElementById( 'download' ).onclick = function() {
        chrome.extension.sendMessage({
            type : 'download'
        })  
    };
}