$(document).ready(function () {
    const token = localStorage.getItem("access_token");

    $(".sendButton .close").click(function(){
        $(".alert").hide('medium');
    });

    var table = $('#agent-profiles-table').DataTable({
        ajax: {
            url: 'http://localhost:9001/allprofilesagent/?skip=0&limit=10',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            {
                data: 'created_at',
                render: function (data) {
                    // Format date as dd-mm-yyyy
                    var date = new Date(data);
                    var day = date.getDate().toString().padStart(2, '0');
                    var month = (date.getMonth() + 1).toString().padStart(2, '0');
                    var year = date.getFullYear();
                    return day + '-' + month + '-' + year;
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    // var expandAgentsButton = '<button class="expand-agents-button">Expand Agents</button>';
                    var expandAgentsButton = '<button class="btn-sm btn-primary expand-agents-button" style="margin:5px;">Agents</button>';
                    return expandAgentsButton;
                }
            },
            {
                data: 'active',
                render: function (data) {
                    return '<div class="check-box agents-check-box"><input type="checkbox" ' + (data ? 'checked' : '') + '></div>';
                }
            },
            {
                data: null,
                render: function (data) {
                    return `
                        <button class="btn btn-sm btn-primary schedule-btn" data-id="${data.id}">Schedule</button>
                        <button class="btn btn-success btn-circle btn-circle-sm ping-btn" data-id="${data.id}"><i class="bi bi-activity"></i></button>
                        <button class="btn btn-info edit-btn" data-id="${data.id}">Edit</button>
                    `;
                }
            }
        ],
        paging: true,
        searching: true,
        lengthChange: true,
        info: true,
        autoWidth: true,
        columnDefs: [
            { targets: [4], width: '50px' } // Adjust column width
        ]
    });
    

    $('#agent-profiles-table tbody').on('click', 'button.expand-agents-button', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open, close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row to show agents
            expandAgents(row, tr); // Pass 'row' to the function
        }
    });

    function expandAgents(row, tr) { // Accept 'row' as a parameter
        // Create a nested table for agents
        var agentsTable = '<table class="agents-table" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
        agentsTable += '<tr><th>Name</th><th>IP Address</th><th>Active</th></tr>';
        
        row.data().agents.forEach(function (agent) {
            agentsTable += '<tr>';
            agentsTable += '<td>' + agent.name + '</td>';
            agentsTable += '<td>' + agent.ip_address + '</td>';
            agentsTable += '<td>' + (agent.active ? 'Yes' : 'No') + '</td>';
            agentsTable += '</tr>';
        });
        
        agentsTable += '</table>';
        
        // Display the nested table
        row.child(agentsTable).show();
        tr.addClass('shown');
    }

    $('#agent-profiles-table tbody').on('click', '.schedule-btn', function () {
        var profileId = $(this).data('id');
        // Create a modal with date, time, and scheduling options
        var modalHtml = `
            <div class="modal fade" id="scheduleModal" tabindex="-1" role="dialog" aria-labelledby="scheduleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="scheduleModalLabel">Schedule Task</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="date">Date</label>
                                    <input type="date" class="form-control" id="date" min="" required>
                                </div>
                                <div class="form-group">
                                    <label for="time">Time</label>
                                    <input type="time" class="form-control" id="time" required>
                                </div>
                                <div class="form-group">
                                    <label for="scheduleOptions">Scheduling Options</label>
                                    <select class="form-control" id="scheduleOptions">
                                        <option value="daily">Once a Day</option>
                                        <option value="weekly">Once a Week</option>
                                        <option value="monthly">Once a Month</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" id="saveSchedule">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('date').min = new Date().getFullYear() + "-" +  parseInt(new Date().getMonth() + 1 ) + "-" + new Date().getDate()
        // Append the modal HTML to the body
        $('body').append(modalHtml);

        // Show the modal
        $('#scheduleModal').modal('show');

        // Handle modal close
        $('#scheduleModal').on('hidden.bs.modal', function () {
            $(this).remove(); // Remove the modal from the DOM
        });

        // Handle Save button click
        $('#saveSchedule').on('click', function () {
            // Retrieve the selected date, time, and scheduling option
            var selectedDate = $('#date').val();
            var selectedHour = $('#hour').val();
            var selectedMinute = $('#minute').val();
            var selectedOption = $('#scheduleOptions').val();


            // Implement your scheduling logic here
            // You can send this data to the server for scheduling or save it locally

            if (!selectedDate) {
                // Date is required, show an error message
                $('.date-error').show();
                return; // Exit the function, don't proceed
            } else {
                // Date is valid, hide the error message
                $('.date-error').hide();
            }

            var data_json = JSON.stringify({start_date: selectedDate, hour: selectedHour, minute:selectedMinute, frequency:selectedOption})
            console.log(data_json)
            $.ajax({
                type: "POST",
                url: "http://localhost:9001/schedule/rule-run",
                contentType: "application/json",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                data: data_json,
                success: function (data) {
                    $("#profile-creation-form, .overlay").hide();
                    alert(data);
                },
                error: function (xhr, status, error) {
                    alert("failed to schedule");
                }
            });
            
            $(".alert").show('medium');
            setTimeout(function(){
              $(".alert").hide('medium');
            }, 5000);

            // Close the modal
            $('#scheduleModal').modal('hide');
        });
    });

        // Handle the "Ping" button click
        $('#agent-profiles-table tbody').on('click', '.ping-btn', function () {
            var row = table.row($(this).parents('tr'));
            var data = row.data();
            var data_json = JSON.stringify({hostname: data.ip_address, username: data.name, extension: 'xlsx'})
            console.log(data_json)
    
            // Show a loading animation on the selected row
            row.nodes().to$().addClass('ping-loading');
            $.ajax({
                type: "POST",
                url: "http://localhost:9001/heartbeatcheck/",
                contentType: "application/json",
                data: data_json,
                success: function (data) {
                    $("#profile-creation-form, .overlay").hide();
                    alert(data);
                },
                error: function (xhr, status, error) {
                    alert("Heartbeat and file extension not accesible. Please try again.");
                }
            });

            // Simulate a delay for the ping operation (you can replace this with your actual operation)
            setTimeout(function () {
                // Remove the loading animation
                row.nodes().to$().removeClass('ping-loading');
    
                // Show a success message in a toast
                alert('Ping successful!');
    
                // Highlight the selected row with a green background
                row.nodes().to$().addClass('ping-success');
            }, 2000); // Adjust the delay time (in milliseconds) as needed
        });

});
