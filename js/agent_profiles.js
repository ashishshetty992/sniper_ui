$(document).ready(function () {
    $.ajax({
        url: 'http://0.0.0.0:9001/allprofilesagent/?skip=0&limit=10',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var profilesData = data; // Assuming the response is an array of profiles

            var table = $('#profile-agents-table').DataTable({
                data: profilesData,
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    {
                        data: 'agents',
                        render: function (data) {
                            return data.length;
                        }
                    },
                    {
                        data: 'id', // Assuming you have some unique identifier for scheduling
                        render: function (data) {
                            return '<button class="btn btn-primary schedule-btn" data-id="' + data + '">Schedule</button>';
                        }
                    }
                ]
            });

            $('#profile-agents-table tbody').on('click', 'td', function () {
                var tr = $(this).closest('tr');
                var row = table.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    // Open this row
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            });

            function format(profile) {
                var agentTable = '<table class="subtable">';
                agentTable += '<thead><tr><th>ID</th><th>Name</th><th>Active</th><th>IP Address</th><th>Created At</th></tr></thead>';
                agentTable += '<tbody>';

                profile.agents.forEach(function (agent) {
                    agentTable += '<tr>';
                    agentTable += '<td>' + agent.id + '</td>';
                    agentTable += '<td>' + agent.name + '</td>';
                    agentTable += '<td>' + (agent.active ? 'Yes' : 'No') + '</td>';
                    agentTable += '<td>' + agent.ip_address + '</td>';
                    agentTable += '<td>' + agent.created_at + '</td>';
                    agentTable += '</tr>';
                });

                agentTable += '</tbody>';
                agentTable += '</table>';

                return agentTable;
            }
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
});