chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var excel = {
            colums: 0,
            headers: [],
            rows: []
        };

        $.fn.exists = function () {
            return this.length !== 0;
        }

        var table;

        if ($('#' + request.identity).exists()) {
            table = $('#' + request.identity);
        } else {
            table = $('.' + request.identity).eq(0);
        }

        /* Finding Headers here. */
        var header = table.find('thead');

        /* All header columns. */
        if (header.exists()) {
            var colums = header.find('th');

            colums.each(function (index) {
                var text = $(this).text();

                if (text.trim().length > 0) {
                    excel.colums++;
                    excel.headers.push(text);
                }
            });
        };

        /* Find Rows Here. */
        var body = table.find('tbody');

        if (body.exists()) {
            var rows = body.find('tr');

            rows.each(function (index) {
                var row = $(this);

                var columns = row.find('td');
                var excelRow = [];

                columns.each(function (index) {
                    var key = excel.headers[index];

                    if (typeof key != 'undefined') {

                        var value = '';

                        if ($(this).find('select').exists()) {
                            value = $(this).find('select').find(":selected").text();
                        } else {
                            value = $(this).text();
                        }

                        excelRow.push( value );
                    }
                });

                excel.rows.push( excelRow );
            })
        }

        var workbook = ExcelBuilder.Builder.createWorkbook();
        var worksheet = workbook.createWorksheet({ name : 'Exported' });
        var stylesheet = workbook.getStyleSheet();
        
        excel.rows.splice( 0, 0, excel.headers );
        excel.rows.splice( 1, 0, [] );
        
        var width = [];
        
        for( var i=0; i< excel.colums; i++ ) {
            width.push( 100 );
        }
        
        worksheet.setData( excel.rows );
        worksheet.setColumns( width );
        workbook.addWorksheet( worksheet );
        
        ExcelBuilder.Builder.createFile( workbook ).then( function( data ) {
            window.open( 'data:application/vnd.ms-excel;base64,' + data );
        });    
        
    });