(function() {
    $('.alert').hide();
    "use strict";

    setTimeout(function () {
        $('.dataTables_length').css('margin', '1%');
        console.log('data')
    }, 500);
  
    var table = $('#resultTable').DataTable({
      "ajax": {
        "url": "http://localhost:9001/rule-execution-results?skip=0&limit=1000",
        "dataSrc": ""
      },
      "columns": [
        { "data": "id" },
        {
            "data": "status",
            "render": function (data, type, row) {
              if (type === 'display') {
                return data === 'success' ? '<span class="text-success">' + data + '</span>' : data;
              }
              return data;
            }
          },
        {
            "data": "results",
            "render": function(data) {
              // Assuming results is a string representation of a Python list
              var paths = data.slice(1, -1).split(',');
              var listItems = paths.map(function (path) {
                return '<li>' + path + '</li>';
              });
              return '<ul>' + listItems.join('') + '</ul>';
            }
        },
        {
            "data": "created_at",
            "render": function (data) {
              // Format date as dd/mm/yyyy without using moment.js
              var date = new Date(data);
              var day = date.getDate();
              var month = date.getMonth() + 1; // Months are zero-based
              var year = date.getFullYear();
    
              // Ensure two digits for day and month
              if (day < 10) {
                day = '0' + day;
              }
              if (month < 10) {
                month = '0' + month;
              }
    
              return day + '/' + month + '/' + year;
            }
          },
        { "data": "latency" },
        {
          "data": "rule",
          "render": function(data) {
            // Assuming rule is an array of objects, you can customize this rendering
            return data.map(function(rule) {
              return rule.name;
            }).join(', ');
          }
        },
        {
          "data": "schedule",
          "render": function(data) {
            // Assuming schedule is an array of objects, you can customize this rendering
            return data.map(function(schedule) {
              return schedule.reference;
            }).join(',');
          }
        },
        {
          "data": "agent",
          "render": function(data) {
            // Assuming agent is an array of objects, you can customize this rendering
            return data.map(function(agent) {
              return agent.agent_name;
            }).join(', ');
          }
        },
      ],
      "createdRow": function (row, data, dataIndex) {
        // Add class based on status
        if (data.status === 'success') {
          $(row).addClass('success-row');
        }
      }
    });

  })();  