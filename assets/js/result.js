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
    "scrollX": true,
    "columns": [
      { 
        "data": "id",
        "render": function(data) {
          return data || '<span class="badge bg-secondary">Not Available</span>';
        }
      },
      {
        "data": "status",
        "render": function (data, type, row) {
          if (type === 'display') {
            if (data === null) {
              return '<span class="badge bg-secondary">No Status</span>';
            }
            return data === 'success' 
              ? '<span class="badge bg-success">Success</span>' 
              : '<span class="badge bg-danger">Failed</span>';
          }
          return data;
        }
      },
      {
        "data": "file_name",
        "render": function(data) {
          return data || '<span class="badge bg-warning text-dark">No File</span>';
        }
      },
      {
        "data": "scanned_file",
        "render": function(data) {
          return data || '<span class="badge bg-warning text-dark">Not Scanned</span>';
        }
      },
      {
        "data": "severity",
        "render": function(data) {
          if (data === null) return '<span class="badge bg-secondary">Not Rated</span>';
          const severityClasses = {
            'low': 'bg-info',
            'medium': 'bg-warning text-dark',
            'high': 'bg-danger'
          };
          return `<span class="badge ${severityClasses[data.toLowerCase()] || 'bg-secondary'}">${data}</span>`;
        }
      },
      {
        "data": "details",
        "render": function(data) {
          return data || '<span class="text-muted"><i class="bi bi-info-circle"></i> No Details Available</span>';
        }
      },
      {
        "data": "created_at",
        "render": function (data) {
          if (!data) return '<span class="badge bg-secondary">No Date</span>';
          
          const date = new Date(data);
          if (isNaN(date.getTime())) return '<span class="badge bg-danger">Invalid Date</span>';
          
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          
          return `<span class="text-primary">
                    <i class="bi bi-calendar"></i> ${day}/${month}/${year}
                    <br>
                    <i class="bi bi-clock"></i> ${hours}:${minutes}
                 </span>`;
        }
      },
      {
        "data": "agent",
        "render": function(data) {
          if (!data || !Array.isArray(data) || data.length === 0) {
            return '<span class="badge bg-secondary">No Agent</span>';
          }
          return data.map(function(agent) {
            return agent.agent_name || 'Unnamed Agent';
          }).join(', ');
        }
      }
    ],
    "order": [[6, "desc"]], // Sort by created_at by default
    "pageLength": 10,
    "responsive": true,
    "scrollCollapse": true,
    // Add buttons and their styling
    "dom": '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
           '<"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6">>'+
           '<"row"<"col-sm-12"tr>>' +
           '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
    "buttons": [
      {
        extend: 'csv',
        text: '<i class="bi bi-file-earmark-text"></i> CSV',
        className: 'btn btn-primary btn-sm me-1',
        exportOptions: {
          columns: ':visible'
        }
      },
      {
        extend: 'excel',
        text: '<i class="bi bi-file-earmark-excel"></i> Excel',
        className: 'btn btn-success btn-sm me-1',
        exportOptions: {
          columns: ':visible'
        }
      },
      {
        extend: 'pdf',
        text: '<i class="bi bi-file-earmark-pdf"></i> PDF',
        className: 'btn btn-danger btn-sm me-1',
        exportOptions: {
          columns: ':visible'
        },
        customize: function(doc) {
          doc.defaultStyle.fontSize = 10;
          doc.styles.tableHeader.fontSize = 11;
          doc.styles.tableHeader.alignment = 'left';
        }
      },
      {
        extend: 'print',
        text: '<i class="bi bi-printer"></i> Print',
        className: 'btn btn-info btn-sm',
        exportOptions: {
          columns: ':visible'
        }
      }
    ],
    "language": {
      "emptyTable": '<div class="text-center text-muted"><i class="bi bi-inbox-fill fs-2"></i><br>No data available</div>'
    }
  });

  // Adjust columns on window resize
  $(window).on('resize', function() {
    table.columns.adjust();
  });
})();