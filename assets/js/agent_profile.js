(function() {
    $('.alert').hide()
    "use strict";

    $('.schedule-card').hide();
    $('.card-create-entities').hide();
    populateAgents()
    populateProfiles()

    setTimeout(function () {
        $('.dataTables_length').css('margin', '1%');
        console.log('data')
    }, 500);

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
                data: 'id', // Assuming you have some unique identifier for scheduling
                render: function (data) {
                    return '<button class="btn btn-secondary schedule-btn btn-info" data-id="' + data + '"><i class="bi bi-calendar"></i></button>';
                }
            },
            {
                data: 'id', // Assuming you have some unique identifier for scheduling
                render: function (data) {
                    return '<button class="btn btn-success btn-circle btn-circle-sm ping-btn"  data-id="' + data + '"><i class="bi bi-activity"></i></button>';
                }
            },
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

    $("#agent-creation-form").on("submit", function (event) {
        console.log('ashish')
        event.preventDefault();
        
        const agentName = $("#create-agent-name").val();
        const name = $("#create-name").val();
        const agentIP = $("#create-agent-ip").val();
        const password = $("#create-agent-password").val();

        // Create the agent object
        const agentObject = {
            name: name,
            agent_name: agentName,
            ip_address: agentIP,
            active: true,
            password: password
        };

        console.log(agentObject)

        const token = localStorage.getItem("access_token");

        if (token) {
            // Send a POST request to create the agent
            $.ajax({
                type: "POST",
                url: "http://localhost:9001/agents/",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                contentType: "application/json",
                data: JSON.stringify(agentObject),
                success: function (data) {
                    $('.agent-success-alert').show();
    
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                },
                error: function (xhr, status, error) {
                    $('.agent-fail-alert').show()
                }
            });
        }
    });

    function populateAgents() {
        const agentContainer = $(".agent-checkboxes");
        const token = localStorage.getItem("access_token");
        // Make a GET request to fetch agents
        $.ajax({
            type: "GET",
            url: "http://localhost:9001/agents/",
            dataType: "json",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            success: function (agentsArray) {
                if (agentsArray && agentsArray.length > 0) {
                    agentsArray.forEach(function (agent) {
                        const checkbox = $('<input>', {
                            type: 'checkbox',
                            value: agent.id,
                            id: `agent-checkbox-${agent.id}`
                        });

                        const label = $('<label>', {
                            text: agent.agent_name + ' |  ' + agent.ip_address,
                            for: `agent-checkbox-${agent.id}`
                        });

                        agentContainer.append(checkbox);
                        agentContainer.append(label);
                        agentContainer.append('<br>');
                    });
                } else {
                    console.error("Agents array is empty or undefined.");
                }
            },
            error: function () {
                console.error("Failed to fetch agents. Please try again.");
            }
        });
    }

    function populateProfiles() {
        const profileContainer = $(".profile-checkboxes");
        const token = localStorage.getItem("access_token");
        // Make a GET request to fetch profiles
        $.ajax({
            type: "GET",
            url: "http://localhost:9001/agentprofiles/",
            dataType: "json",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            success: function (profilesArray) {
                if (profilesArray && profilesArray.length > 0) {
                    profilesArray.forEach(function (profile) {
                        const checkbox = $('<input>', {
                            type: 'checkbox',
                            value: profile.id,
                            id: `profile-checkbox-${profile.id}`
                        });

                        const label = $('<label>', {
                            text: profile.name,
                            for: `profile-checkbox-${profile.id}`
                        });

                        profileContainer.append(checkbox);
                        profileContainer.append(label);
                        profileContainer.append('<br>');
                    });
                } else {
                    console.error("Profiles array is empty or undefined.");
                }
            },
            error: function () {
                console.error("Failed to fetch Profiles. Please try again.");
            }
        });
    }

    function getSelectedCheckboxValues(containerId) {
        const selectedValues = [];
        $(`.${containerId} input[type=checkbox]:checked`).each(function () {
            selectedValues.push($(this).val());
        });
        return selectedValues;
    }

    // $("#rule-creation-form").on("submit", function (event) {
    //     event.preventDefault();

    //     const ruleName = $("#create-rule-name").val();
    //     const rule = $("#create-rule").val();
    //     const agentIds = getSelectedCheckboxValues('agent-checkboxes');
    //     const profileIds = getSelectedCheckboxValues('profile-checkboxes');
    //     const ruleCategory = $("#create-category").val()
    //     const ruleSubCategory = $("#create-sub-category").val()
    //     const rulePath = $("#create-path").val()
    //     // Create the profile object
    //     const ruleObject = {
    //         rule: {
    //             name: ruleName,
    //             exec_rule: rule,
    //             category: ruleCategory,
    //             sub_category: ruleSubCategory,
    //             active: true,
    //             path: rulePath
    //         },
    //         agent_ids: agentIds.map(Number), // Convert agent IDs to numbers
    //         agent_profile_ids: profileIds.map(Number) // Convert agent IDs to numbers
    //     };
    //     console.log(ruleObject)
        
    //     const token = localStorage.getItem("access_token");

    //     if (token) {
    //         // Send a POST request to create the profile
    //         $.ajax({
    //             type: "POST",
    //             url: "http://localhost:9001/rules/",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`
    //             },
    //             contentType: "application/json",
    //             data: JSON.stringify(ruleObject),
    //             success: function (data) {
    //                 $('.rule-success-alert').show();
    
    //                 setTimeout(function () {
    //                     location.reload();
    //                 }, 2000);
    //             },
    //             error: function (xhr, status, error) {
    //                 $('.rule-fail-alert').show()
    //             }
    //         });
    //     }
    // });

    $("#rule-creation-form").on("submit", function (event) {
        event.preventDefault();
    
        const ruleName = $("#create-rule-name").val();
        const agentIds = getSelectedCheckboxValues('agent-checkboxes');
        const profileIds = getSelectedCheckboxValues('profile-checkboxes');
        const ruleCategory = $("#create-category").val();
        const ruleSubCategory = $("#create-sub-category").val();
        const rulePath = $("#create-path").val();
        const yaraFile = $("#upload-yara-file").prop('files')[0]; // Get the selected YARA file
    
        const formData = new FormData();
        formData.append('agent_ids', 4); // Assuming agent_ids is always 4
        formData.append('agent_profile_ids', 0); // Assuming agent_profile_ids is always 0
        formData.append('rule_file', yaraFile);
        // Append query parameters to the URL
        const url = new URL("http://localhost:9001/rules/");
        url.searchParams.append('name', ruleName);
        url.searchParams.append('category', ruleCategory);
        url.searchParams.append('sub_category', ruleSubCategory);
        url.searchParams.append('path', rulePath);
    
        const token = localStorage.getItem("access_token");
    
        if (token) {
            $.ajax({
                type: "POST",
                url: url.href, // Get the full URL with query parameters
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                processData: false,
                contentType: false,
                data: formData,
                success: function (data) {
                    $('.rule-success-alert').show();
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                },
                error: function (xhr, status, error) {
                    $('.rule-fail-alert').show();
                }
            });
        }
    });

    $("#profile-creation-form").on("submit", function (event) {
        event.preventDefault();

        const profileName = $("#create-profile-name").val();
        const agentIds = getSelectedCheckboxValues('agent-checkboxes');

        // Create the profile object
        const profileObject = {
            agent_profile: {
                name: profileName,
                active: true
            },
            agent_ids: agentIds.map(Number) // Convert agent IDs to numbers
        };

        const token = localStorage.getItem("access_token");

        if (token) {
            // Send a POST request to create the profile
            $.ajax({
                type: "POST",
                url: "http://localhost:9001/agentprofiles/",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                contentType: "application/json",
                data: JSON.stringify(profileObject),
                success: function (data) {
                    $('.profile-success-alert').show();
    
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                },
                error: function (xhr, status, error) {
                    $('.profile-fail-alert').show()
                }
            });
        }
    });

    //schedule 

    $("#schedule-creation-form").on("submit", function (event) {
        event.preventDefault();

        var selectedDate = $('#create-date').val();
        var selectedTime = $('#create-time').val();
        var hour = selectedTime.split(':')[0]
        var minutes = selectedTime.split(':')[1]
        var selectedOption = $('#scheduleOptions').val();
        var profileId = $(this).attr('data-profile-id');
        console.log(profileId)

        const token = localStorage.getItem("access_token");

        $.ajax({
            type: 'POST',
            url: 'http://localhost:9001/schedule/rule-run',
            contentType: 'application/json',
            headers: {
                    "Authorization": `Bearer ${token}`
                },
            data: JSON.stringify({
                start_date: selectedDate,
                hour: hour,
                minutes: minutes,
                frequency: selectedOption,
                reference: 'agent_profile',
                reference_id: profileId
            }),
            success: function (data) {
                $('.rule-schedule-success-alert').show();

                setTimeout(function () {
                    // location.reload();
                }, 2000);
            },
            error: function (error) {
                $('.rule-schedule-fail-alert').show();
                // Handle error response as needed
                agentId = null
            }
        });

    });

    var agent_table = $('#agent-profiles-table').DataTable()
    $('#agent-profiles-table tbody').on('click', '.schedule-btn', function () {

        $('.schedule-card').toggle();

        var data = agent_table.row($(this).parents('tr')).data();
        var execRuleName = data.ip_address;
        var profileId = data.id;

        // Update the card title with the exec_rule name
        $('.schedule-card .card-title').text("Schedule for "+ execRuleName);

        // Update the form with the rule ID
        $('#schedule-creation-form').attr('data-profile-id', profileId);
    });

    $('.create-entity-button').on('click', function () {
        $('.card-create-entities').toggle();
    });

    //ping

    $('#agent-profiles-table tbody').on('click', '.ping-btn', function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var data_json = JSON.stringify({hostname: data.ip_address, username: data.name, extension: 'xlsx'})
        console.log(data_json)

        // Show a loading animation on the selected row
        $.ajax({
            type: "POST",
            url: "http://localhost:9001/heartbeatcheck/",
            contentType: "application/json",
            data: data_json,
            success: function (data) {
                row.nodes().to$().addClass('ping-success');
                setTimeout(function() {
                    row.nodes().to$().removeClass('ping-success');
                }, 60000);
            },
            error: function (xhr, status, error) {
                row.nodes().to$().addClass('ping-failure');
                setTimeout(function() {
                    row.nodes().to$().removeClass('ping-failure');
                }, 60000);
            }
        });
    });

})();