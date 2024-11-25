(function() {
    $('.alert').hide()
    "use strict";

    const token = localStorage.getItem("access_token");
    console.log('Dashboard')
    populateAgents()
    populateProfiles()

    $('.schedule-card').hide();
    $('.edit-rule-card').hide();
    $('.card-create-entities').hide();

    setTimeout(function () {
        $('.dataTables_length').css('margin', '1%');
    }, 500);

    console.log(token)

    if (!token) {
        // Redirect to login.html if the token is not present
        window.location.href = 'pages-login.html';
        return; // Stop execution of the script
    }
    var table = $('#rulesTable').DataTable({
        ajax: {
            url: 'http://localhost:9001/get_rules_with_agents_and_profile/',
            headers: {
                        "Authorization": `Bearer ${token}`
                    },
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            { 
                data: 'exec_rule',
                render: function(data, type, row) {
                    // Split the exec_rule string by commas
                    let execRules = data.split(',');
                    // Extract the last part of each exec_rule path
                    let lastParts = execRules.map(function(rule) {
                        // Split the path by slashes
                        let parts = rule.trim().split('/');
                        // Get the last part of the path
                        return parts[parts.length - 1];
                    });
                    // Join the last parts with commas
                    return lastParts.join(', ');
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    // var expandAgentsButton = '<button class="expand-agents-button">Expand Agents</button>';
                    var expandAgentsButton = '<button class="btn-sm btn-primary expand-agents-button" style="margin:5px;">Agents</button>';
                    var expandProfilesButton = '<button class="btn-sm btn-primary expand-profiles-button">Profiles</button>';
                    return expandAgentsButton +'        '+ expandProfilesButton;
                }
            },
            {
                data: 'id', // Assuming you have some unique identifier for scheduling
                render: function (data) {
                    return '<button class="btn btn-secondary scan-now-btn btn-info" data-id="' + data + '"><i class="bi bi-play"></i></button>';
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
                    return '<button class="btn btn-secondary btn-warning edit-btn" data-id="' + data + '"><i class="bi bi-pen"></i></button>';
                }
            }
        ]
    });

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
                console.log("Failed to fetch Profiles. Please try again.");
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
    //     // const rule = $("#create-rule").val();
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
        const agentIds = getSelectedCheckboxValues('agent-checkboxes').map(Number);;
        const profileIds = getSelectedCheckboxValues('profile-checkboxes').map(Number);;
        const ruleCategory = $("#create-category").val();
        const ruleSubCategory = $("#create-sub-category").val();
        const rulePath = $("#create-path").val();
        const yaraFiles = $("#upload-yara-file").prop('files'); // Get the selected YARA file
        // console.log("yar file", $("#upload-yara-file").prop('files')[0])
        // console.log("yar files", $("#upload-yara-file").prop('files'))
    
        const formData = new FormData();
        agentIds.forEach(id => formData.append('agent_ids', id)); // Append each agent id individually
        profileIds.forEach(id => formData.append('agent_profile_ids', id)); // Append each profile id individually
        // formData.append('agent_ids', agentIds);
        // formData.append('agent_profile_ids', profileIds); // Assuming agent_profile_ids is always 0
        // formData.append('rule_file', yaraFile);
        // Append query parameters to the URL

        for (let i = 0; i < yaraFiles.length; i++) {
            formData.append('rule_file', yaraFiles[i]);
        }


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

    $('#rulesTable tbody').on('click', 'button.expand-agents-button', function () {
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

    $('#rulesTable tbody').on('click', 'button.expand-profiles-button', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open, close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row to show agent profiles
            expandProfiles(row, tr); // Pass 'row' to the function
        }
    });

    function expandAgents(row, tr) { // Accept 'row' as a parameter
        // Create a nested table for agents
        var agentsTable = '<table class="agents-table" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
        agentsTable += '<tr><th>Name</th><th>IP Address</th><th>Active</th></tr>';
        
        row.data().agents.forEach(function (agent) {
            agentsTable += '<tr class="table-primary">';
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

    function expandProfiles(row, tr) { // Accept 'row' as a parameter
        // Create a nested table for agent profiles
        var profilesTable = '<table class="profiles-table" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
        profilesTable += '<tr><th>Name</th></tr>';
        
        row.data().agent_profiles.forEach(function (profile) {
            profilesTable += '<tr>';
            profilesTable += '<td>' + profile.name + '</td>';
            profilesTable += '</tr>';
        });
        
        profilesTable += '</table>';
        
        // Display the nested table
        row.child(profilesTable).show();
        tr.addClass('shown');
    }

    var rule_table = $('#rulesTable').DataTable()
    $('#rulesTable tbody').on('click', '.schedule-btn', function () {

        $('.schedule-card').toggle();

        var data = rule_table.row($(this).parents('tr')).data();
        var execRuleName = data.exec_rule;
        var ruleName = data.name;
        var ruleId = data.id;

        let paths = execRuleName.split(',');

        let filenames = paths.map(path => path.split('/').pop());

        let filenamesStr = filenames.join(',');

        // Update the card title with the exec_rule name
        $('.schedule-card .card-title').text("Schedule for "+ filenamesStr);

        // Update the form with the rule ID
        $('#schedule-creation-form').attr('data-rule-id', ruleId);
    });

    $('.create-entity-button').on('click', function () {
        $('.card-create-entities').toggle();
    });
    
    $("#schedule-creation-form").on("submit", function (event) {
        event.preventDefault();

        var selectedDate = $('#create-date').val();
        var selectedTime = $('#create-time').val();
        var hour = selectedTime.split(':')[0]
        var minutes = selectedTime.split(':')[1]
        var selectedOption = $('#scheduleOptions').val();
        var ruleId = $(this).attr('data-rule-id');
        console.log(ruleId)

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
                reference: 'rule',
                reference_id: ruleId
            }),
            success: function (data) {
                $('.rule-schedule-success-alert').show();

                setTimeout(function () {
                    location.reload();
                }, 2000);
            },
            error: function (error) {
                $('.rule-schedule-fail-alert').show();
                // Handle error response as needed
                ruleId = null
            }
        });

    });


    // EDIT

    $('#rulesTable').on("click", ".edit-btn", function () {

        const ruleId = $(this).data("id");
        fetchRuleDetailsForEdit(ruleId);
        openEditRuleForm(ruleId);
    });

    function openEditRuleForm(ruleId) {
       $('.edit-rule-card').toggle();
    }
    
    // Function to fetch rule details for editing
    function fetchRuleDetailsForEdit(ruleId) {
        const token = localStorage.getItem("access_token");
    
        $.ajax({
            type: "GET",
            url: `http://localhost:9001/get_rules_with_agents_and_profile_by_rule_id/${ruleId}`,
            headers: {
                "Authorization": `Bearer ${token}`
            },
            success: function (ruleDetails) {
                populateEditForm(ruleDetails);
            },
            error: function () {
               console.log("Failed to fetch rule details. Please try again.");
            }
        });
    }
    
    function populateEditForm(ruleDetails) {
        console.log(ruleDetails)
        $("#edit-name").val(ruleDetails.rule.name);
        $("#rule-id").val(ruleDetails.rule.id);
        $("#edit-path").val(ruleDetails.rule.path);
        $("#edit-category").val(ruleDetails.rule.category);
        $("#edit-sub-category").val(ruleDetails.rule.sub_category);
        $("#edit-rule").val(ruleDetails.rule.exec_rule);
        $('#rule-edit-form').attr('data-rule-id', ruleDetails.rule.id);

        $(".agent-checkboxes input[type='checkbox']").prop('checked', false);
        if (ruleDetails.rule.agents && ruleDetails.rule.agents.length > 0) {
            ruleDetails.rule.agents.forEach(function (agent) {
                const checkboxId = `#agent-checkbox-${agent.id}`;
                $(checkboxId).prop('checked', true);
            });
        }

        $(".profile-checkboxes input[type='checkbox']").prop('checked', false);
        if (ruleDetails.rule.agent_profiles && ruleDetails.rule.agent_profiles.length > 0) {
            ruleDetails.rule.agent_profiles.forEach(function (agent) {
                const checkboxId = `#profile-checkbox-${agent.id}`;
                $(checkboxId).prop('checked', true);
            });
        }
    }

    $("#rule-edit-form").on("submit", function (event) {
        event.preventDefault();
        // Collect input box values
        const ruleName = $("#edit-name").val();
        var ruleId = $(this).attr('data-rule-id');
        const rulePath = $("#edit-path").val();
        const ruleCategory = $("#edit-category").val();
        const ruleSubCategory = $("#edit-sub-category").val();
        const rule = $("#edit-rule").val();
    
        // Collect selected agent IDs and profile IDs
        const selectedAgentIds = $("#rule-edit-form .agent-checkboxes input:checked").map(function() { return this.value;}).get();
        const selectedProfileIds = $("#rule-edit-form .profile-checkboxes input:checked").map(function() { return this.value;}).get();;

        // Create the payload for the PUT request
        const putPayload = {
            rule_update: {
                name: ruleName,
                exec_rule: rule,
                path: rulePath,
                category: ruleCategory,
                sub_category: ruleSubCategory
            },
            agent_ids: selectedAgentIds,
            agent_profile_ids: selectedProfileIds
        };

        const token = localStorage.getItem("access_token");
        if (token) {
            // Send a PUT request to update the rule
            $.ajax({
                type: "PUT",
                url: `http://localhost:9001/rules/${ruleId}`,
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                contentType: "application/json",
                data: JSON.stringify(putPayload),
                success: function (data) {
                    $('.rule-update-success-alert').show();
    
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                },
                error: function (xhr, status, error) {
                    $('.rule-update-fail-alert').show();
                }
            });
        }
    });

    $('#rulesTable tbody').on('click', '.scan-now-btn', function() {
        const ruleId = $(this).data('id');
        const row = table.row($(this).closest('tr'));
        const rowData = row.data();
        
        // Show confirmation dialog
        if (!confirm('Are you sure you want to run this scan now?')) {
            return;
        }
        
        // Disable the button and show loading state
        const $button = $(this);
        $button.prop('disabled', true)
               .html('<i class="bi bi-hourglass-split"></i>');
        
        // Make API call to start the scan
        $.ajax({
            url: `http://localhost:9001/rules/${ruleId}/scan`,
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            contentType: 'application/json',
            success: function(response) {
                // Process execution results
                let resultDetails = '';
                let hasErrors = false;
                let totalMatches = 0;
                let totalFilesScanned = 0;
                
                response.execution_results.forEach(result => {
                    const status = result.status === 'success' 
                        ? '<span class="badge bg-success">Success</span>' 
                        : '<span class="badge bg-danger">Failed</span>';
                    
                    let details = '';
                    if (result.status === 'success') {
                        totalMatches += result.matches ? result.matches.length : 0;
                        totalFilesScanned += result.files_scanned || 0;
                        
                        details = `
                            <small class="d-block text-muted">
                                Files Scanned: ${result.files_scanned || 0}
                                ${result.matches ? `<br>Matches Found: ${result.matches.length}` : ''}
                                ${result.scan_time ? `<br>Scan Time: ${result.scan_time}s` : ''}
                            </small>`;
                    } else {
                        details = `<small class="text-danger d-block">${result.error}</small>`;
                        hasErrors = true;
                    }
                    
                    resultDetails += `
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-1">
                                <strong class="me-2">Agent ${result.agent_name}:</strong> ${status}
                            </div>
                            ${details}
                        </div>`;
                });

                // Show toast with results
                const toast = `
                    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true" style="min-width: 350px;">
                            <div class="toast-header ${hasErrors ? 'bg-warning' : 'bg-success'} text-white">
                                <i class="bi ${hasErrors ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2"></i>
                                <strong class="me-auto">Scan Results</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                <h6 class="mb-3">Rule: ${response.rule_name}</h6>
                                ${!hasErrors ? `
                                    <div class="alert alert-light mb-3">
                                        <small>
                                            Total Files Scanned: ${totalFilesScanned}<br>
                                            Total Matches Found: ${totalMatches}
                                        </small>
                                    </div>
                                ` : ''}
                                ${resultDetails}
                                <div class="mt-2 pt-2 border-top">
                                    <a href="results.html" class="btn btn-sm btn-primary">View Details</a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                
                // Add toast to body and auto-remove after 8 seconds
                $(toast).appendTo('body');
                setTimeout(() => {
                    $('.toast').toast('hide');
                }, 8000);
                
                // Re-enable button after delay
                setTimeout(() => {
                    $button.prop('disabled', false)
                           .html('<i class="bi bi-play"></i>');
                }, 2000);
            },
            error: function(xhr, status, error) {
                // Show error toast
                const toast = `
                    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header bg-danger text-white">
                                <i class="bi bi-exclamation-circle me-2"></i>
                                <strong class="me-auto">Error</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                                <div class="mb-2">Failed to start scan:</div>
                                <small class="text-danger">${error}</small>
                            </div>
                        </div>
                    </div>`;
                
                // Add toast to body and auto-remove after 5 seconds
                $(toast).appendTo('body');
                setTimeout(() => {
                    $('.toast').toast('hide');
                }, 5000);
                
                // Re-enable button
                $button.prop('disabled', false)
                       .html('<i class="bi bi-play"></i>');
            }
        });
    });
})();