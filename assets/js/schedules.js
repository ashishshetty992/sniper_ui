(function() {
    $('.alert').hide();
    "use strict";

    setTimeout(function () {
        $('.dataTables_length').css('margin', '1%');
        console.log('data')
    }, 500);
  
    var table = $('#scheduleTable').DataTable({
        "ajax": {
            "url": "http://13.232.50.69:9001/schedules?skip=0&limit=1000",
            "dataSrc": ""
        },
        "columns": [
            { "data": "id" },
            { "data": "frequency" },
            { "data": "status" },
            { "data": "hour" },
            { "data": "minutes" },
            { "data": "start_date" },
            { "data": "reference" },
            { 
                "data": "created_at",
                "render": function(data) {
                    // Format date in dd/mm/yyyy
                    var date = new Date(data);
                    var day = date.getDate();
                    var month = date.getMonth() + 1;
                    var year = date.getFullYear();
                    return day + '/' + month + '/' + year;
                }
            },
        ]
    });

  })();  