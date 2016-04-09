chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    
    var isEmpty = function( obj ) { return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({}); }
    this.excel = {};
    
    switch( request.type ) {
        case 'export' : 
            
            var that = this;
        
            chrome.tabs.query({ active : true, currentWindow : true }, function( tabs ) {
                chrome.tabs.sendMessage( tabs[0].id, {
                    type : 'export',
                    identity : request.identity
                }, function( response ) {
                    
                    chrome.storage.local.get( ['excel'], function( data ) {
                        console.log( 'Data from storage', data );
                        that.excel = data.excel;
                        console.log( that.excel );
                    

                        if( typeof that.excel == 'undefined' || typeof that.excel.rows == 'undefined' || typeof that.excel.rows.length == 'undefined' ) {
                            that.excel = { rows : [] };
                        }

                        that.excel.colums = response.result.colums;
                        that.excel.headers = response.result.headers;

                        var rows = response.result.rows;
                        var count = rows.length;

                        for( var i = 0 ; i< count ; i++ ) {
                            that.excel.rows.push( response.result.rows[ i ] );
                        }

                        console.log( that.excel );

                        console.log('Before Storing Into Cache ', that.excel );
                        chrome.storage.local.set( {'excel' : that.excel });
                    } );
                });
            });
            
            break;
        
        case 'download' : 
            
            var excel = chrome.storage.local.get( ['excel'], function( data ) {
                excel = data;
            } );
            
            chrome.tabs.query({ active : true, currentWindow : true }, function( tabs ) {
                
                chrome.storage.local.get( ['excel'], function( data ) {
                    var excel = data.excel;
                    
                    chrome.tabs.sendMessage( tabs[0].id, {
                        type : 'download', data : excel
                    }, function( response ){
                        chrome.storage.local.remove( ['excel']);
                    });
                })
        
            });
            
            break;
    }

});