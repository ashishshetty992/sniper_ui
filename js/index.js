// ---------Responsive-navbar-active-animation-----------
function test(){
	var tabsNewAnim = $('#navbarSupportedContent');
	var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
	var activeItemNewAnim = tabsNewAnim.find('.active');
	var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
	var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
	var itemPosNewAnimTop = activeItemNewAnim.position();
	var itemPosNewAnimLeft = activeItemNewAnim.position();
	$(".hori-selector").css({
		"top":itemPosNewAnimTop.top + "px", 
		"left":itemPosNewAnimLeft.left + "px",
		"height": activeWidthNewAnimHeight + "px",
		"width": activeWidthNewAnimWidth + "px"
	});
	$("#navbarSupportedContent").on("click","li",function(e){
		$('#navbarSupportedContent ul li').removeClass("active");
		$(this).addClass('active');
		var activeWidthNewAnimHeight = $(this).innerHeight();
		var activeWidthNewAnimWidth = $(this).innerWidth();
		var itemPosNewAnimTop = $(this).position();
		var itemPosNewAnimLeft = $(this).position();
		$(".hori-selector").css({
			"top":itemPosNewAnimTop.top + "px", 
			"left":itemPosNewAnimLeft.left + "px",
			"height": activeWidthNewAnimHeight + "px",
			"width": activeWidthNewAnimWidth + "px"
		});
	});
}
$(document).ready(function(){
	setTimeout(function(){ test(); });
});
$(window).on('resize', function(){
	setTimeout(function(){ test(); }, 500);
});
$(".navbar-toggler").click(function(){
	$(".navbar-collapse").slideToggle(300);
	setTimeout(function(){ test(); });
});



// --------------add active class-on another-page move----------
jQuery(document).ready(function($){
	// Get current path and find target link
	var path = window.location.pathname.split("/").pop();

	// Account for home page with empty path
	if ( path == '' ) {
		path = 'index.html';
	}

	var target = $('#navbarSupportedContent ul li a[href="'+path+'"]');
	// Add active class to target link
	target.parent().addClass('active');

});





// Add active class on another page linked
// ==========================================
// $(window).on('load',function () {
//     var current = location.pathname;
//     console.log(current);
//     $('#navbarSupportedContent ul li a').each(function(){
//         var $this = $(this);
//         // if the current path is like this link, make it active
//         if($this.attr('href').indexOf(current) !== -1){
//             $this.parent().addClass('active');
//             $this.parents('.menu-submenu').addClass('show-dropdown');
//             $this.parents('.menu-submenu').parent().addClass('active');
//         }else{
//             $this.parent().removeClass('active');
//         }
//     })
// });

// Function to populate roles dynamically
function populateRoles() {
    const rolesSelect = $("#create-roles");

    // Make a GET request to fetch roles
    $.ajax({
        type: "GET",
        url: "http://localhost:9001/roles/?skip=0&limit=10",
        dataType: "json",
        success: function (rolesArray) {
            if (rolesArray && rolesArray.length > 0) {
                rolesArray.forEach(function (role) {
                    rolesSelect.append($('<option>', {
                        value: role.id,
                        text: role.name
                    }));
                });
            } else {
                console.error("Roles array is empty or undefined.");
            }
        },
        error: function () {
            alert("Failed to fetch roles. Please try again.");
        }
    });
}

function populateProfiles() {
    const profileSelect = $("#create-profile");
    const token = localStorage.getItem("access_token");
    // Make a GET request to fetch roles
    $.ajax({
        type: "GET",
        url: "http://localhost:9001/agentprofiles/?skip=0&limit=10",
        dataType: "json",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: function (profilesArray) {
            if (profilesArray && profilesArray.length > 0) {
                profilesArray.forEach(function (profile) {
                    profileSelect.append($('<option>', {
                        value: profile.id,
                        text: profile.name
                    }));
                });
            } else {
                console.error("Profiles array is empty or undefined.");
            }
        },
        error: function () {
            alert("Failed to fetch Profiles. Please try again.");
        }
    });
}

function populateAgents() {
    const agentsSelect = $("#create-profile-agents");
    const token = localStorage.getItem("access_token");
    // Make a GET request to fetch agents
    $.ajax({
        type: "GET",
        url: "http://localhost:9001/agents/?skip=0&limit=10",
        dataType: "json",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: function (agentsArray) {
            if (agentsArray && agentsArray.length > 0) {
                agentsArray.forEach(function (agent) {
                    agentsSelect.append($('<option>', {
                        value: agent.id,
                        text: agent.name
                    }));
                });
            } else {
                console.error("Agents array is empty or undefined.");
            }
        },
        error: function () {
            alert("Failed to fetch agents. Please try again.");
        }
    });
}

$(function () {

    // Show the user creation form when the button is clicked
    $("#create-user-button").on("click", function () {
        $("#user-creation-form").load("user_creation_form.html", function () {
            // This callback function runs after the external HTML is loaded

            populateRoles();
            console.log("Roles loaded");

            // Handle the form submission
            $("#create-user-form").on("submit", function (event) {
                event.preventDefault();
            
                const username = $("#create-username").val();
                const email = $("#create-email").val();
                const fullname = $("#create-fullname").val();
                const password = $("#create-password").val();
                const roleId = $("#create-roles").val();
                
                // Create the user object
                const userObject = {
                    user: {
                        username: username,
                        email: email,
                        full_name: fullname,
                        password: password,
                        disabled: false,
                        is_superadmin: false
                    },
                    role_ids: [parseInt(roleId)]
                };

                if (token) {
                    // Send a POST request to create the user
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:9001/users/",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        contentType: "application/json",
                        data: JSON.stringify(userObject),
                        success: function (data) {
                            $("#user-creation-form, .overlay").hide();
                            alert("User created successfully!");
                        },
                        error: function (xhr, status, error) {
                            alert("User creation failed. Please try again.");
                        }
                    });
                }
            });
        });

        // Show the user-creation-form after loading
        $("#user-creation-form, .overlay").show();
    });

    // Close the form when clicking outside or pressing Escape
    $(".overlay").on("click", function () {
        $("#user-creation-form, .overlay").hide();
    });

    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            $("#user-creation-form, .overlay").hide();
        }
    });

    // Show the agent creation form when the button is clicked
    $("#create-agent-button").on("click", function () {
        $("#agent-creation-form").load("agent_creation_form.html", function () {
            // Handle agent creation form here
            $("#agent-creation-form").on("submit", function (event) {
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
                            $("#agent-creation-form, .overlay").hide();
                            alert("Agent created successfully!");
                            location.reload();
                        },
                        error: function (xhr, status, error) {
                            alert("Agent creation failed. Please try again.");
                        }
                    });
                }
            });
        });

        // Show the agent-creation-form after loading
        $("#agent-creation-form, .overlay").show();
    });

    $("#create-profile-button").on("click", function () {
        $("#profile-creation-form").load("profile_creation_form.html", function () {
            // Handle profile creation form here

            // Fetch and populate agents in the multi-select input
            populateAgents();
            console.log("Populated agents");
            // Handle the form submission
            $("#profile-creation-form").on("submit", function (event) {
                event.preventDefault();

                const profileName = $("#create-profile-name").val();
                const agentIds = $("#create-profile-agents").val();

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
                            $("#profile-creation-form, .overlay").hide();
                            alert("Profile created successfully!");
                        },
                        error: function (xhr, status, error) {
                            alert("Profile creation failed. Please try again.");
                        }
                    });
                }
            });
        });

        // Show the profile-creation-form after loading
        $("#profile-creation-form, .overlay").show();
    });

//     // JavaScript Logic for the Edit Rule Form
$(document).on("click", ".edit-btn", function () {
    const ruleId = $(this).data("id");
    fetchRuleDetailsForEdit(ruleId);
    openEditRuleForm(ruleId);
});

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
            // Populate the form with the fetched rule details
            populateEditForm(ruleDetails);
        },
        error: function () {
            alert("Failed to fetch rule details. Please try again.");
        }
    });
}

// Function to populate the edit form with rule details
function populateEditForm(ruleDetails) {
    console.log(ruleDetails)
    // Example: Display rule name, path, category, and subcategory
    $("#edit-name").val(ruleDetails.rule.name);
    $("#rule-id").val(ruleDetails.rule.id);
    $("#edit-path").val(ruleDetails.rule.path);
    $("#edit-category").val(ruleDetails.rule.category);
    $("#edit-sub-category").val(ruleDetails.rule.sub_category);

    // Example: Populate selected agents in the dropdown
    console.log('ruleDetails.agents')
    populateAllOptions("#edit-agents", ruleDetails.rule.agents);

    console.log('ruleDetails.allAgents')
    // Example: Populate all agents in the dropdown
    populateAllOptions("#all-agents", ruleDetails.agents);

    console.log('ruleDetails.agent_profiles')
    // Example: Populate selected agent profiles in the dropdown
    populateAllOptions("#edit-profiles", ruleDetails.rule.agent_profiles);

    console.log('ruleDetails.allAgentProfiles')
    // Example: Populate all agent profiles in the dropdown
    populateAllOptions("#all-profiles", ruleDetails.agent_profiles);

    console.log(ruleDetails);
    // Show the edit form after populating the details
    // $("#editRuleForm, .overlay").show();
}

// Example function to populate all options in a dropdown
function populateAllOptions(dropdownId, allOptions) {
    const dropdown = $(dropdownId);
    dropdown.empty(); // Clear existing options

    console.log('allOptions')
    allOptions.forEach(option => {
        dropdown.append($('<option>', {
            value: option.id,
            text: option.name
        }));
    });
    $("#edit-agents option").prop("selected", true);
    $("#edit-profiles option").prop("selected", true);
}

function addAgent() {
    const selectedAgents = $("#edit-agents").val() || [];

    // Get the selected agents from the "all-agents" dropdown
    const newAgents = $("#all-agents").val() || [];


    // Filter out the agents that are already selected
    const agentsToAdd = newAgents.filter(agent => !selectedAgents.includes(agent));
    debugger;
    // Add the new agents to the "edit-agents" dropdown
    agentsToAdd.forEach(agentId => {
        const agentText = $(`#all-agents option[value="${agentId}"]`).text();
        $("#edit-agents").append(`<option value="${agentId}" selected>${agentText}</option>`);
    });
    $("#edit-agents option").prop("selected", true);
}

// Add event listeners for adding and removing agents and profiles
$("#add-agent-btn").on("click", function () {
    addAgent();
});

function removeAgent() {
    // Get the selected agents from the "edit-agents" dropdown
    const selectedAgents = $("#edit-agents").val() || [];

    // Remove the selected agents from the "edit-agents" dropdown
    selectedAgents.forEach(agentId => {
        $(`#edit-agents option[value="${agentId}"]`).remove();
    });
    $("#edit-agents option").prop("selected", true);
}

// Event listener for the "Remove Agent" button
$("#remove-agent-btn").on("click", function () {
    event.preventDefault();
    removeAgent();
});


function addProfile() {
    const selectedProfiles = $("#edit-profiles").val() || [];

    // Get the selected agents from the "all-agents" dropdown
    const newProfile = $("#all-profiles").val() || [];

    // Filter out the agents that are already selected
    const profilesToAdd = newProfile.filter(profile => !selectedProfiles.includes(profile));
    // Add the new agents to the "edit-profiles" dropdown

    profilesToAdd.forEach(profileId => {
        const profileText = $(`#all-profiles option[value="${profileId}"]`).text();
        $("#edit-profiles").append(`<option value="${profileId}" selected>${profileText}</option>`);
    });
    $("#edit-profiles option").prop("selected", true);
}

$("#add-profile-btn").on("click", function () {
    addProfile();
});

function removeProfile() {
    // Get the selected agents from the "edit-agents" dropdown
    const selectedProfiles = $("#edit-profiles").val() || [];

    // Remove the selected agents from the "edit-agents" dropdown
    selectedProfiles.forEach(profileId => {
        $(`#edit-profiles option[value="${profileId}"]`).remove();
    });
    $("#edit-profiles option").prop("selected", true);
}



$("#remove-profile-btn").on("click", function () {
    event.preventDefault();
    removeProfile();
});

// // Add event listener for form submission
// $("#edit-rule-form").on("submit", function (event) {
//     event.preventDefault();
    
//     // Logic to handle form submission and update the rule
// });

// Add event listener for cancel button
$("#cancel-edit-btn").on("click", function () {
    closeEditRuleForm();
});

$("#edit-rule-form").on("submit", function (event) {
    event.preventDefault();
    // Collect input box values
    const ruleName = $("#edit-name").val();
    const ruleId = $('#rule-id').val()
    const rulePath = $("#edit-path").val();
    const ruleCategory = $("#edit-category").val();
    const ruleSubCategory = $("#edit-sub-category").val();

    // Collect selected agent IDs and profile IDs
    const selectedAgentIds = $("#edit-agents").val();
    const selectedProfileIds = $("#edit-profiles").val();

    // Create the payload for the PUT request
    const putPayload = {
        rule_update: {
            name: ruleName,
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
                $("#editRuleForm, .overlay").hide();
                alert("Rule updated successfully!");
                location.reload();
            },
            error: function (xhr, status, error) {
                alert("Rule update failed. Please try again.");
            }
        });
    }
});


// Example function to open and close the edit rule form
function openEditRuleForm(ruleId) {
    $("#editRuleForm, .overlay").show();
}

function closeEditRuleForm() {
    $("#editRuleForm, .overlay").hide();
}


    $("#create-rule-button").on("click", function () {
        $("#rule-creation-form").load("rule_creation_form.html", function () {
            // Handle profile creation form here

            // Fetch and populate agents in the multi-select input
            populateAgents();
            populateProfiles()
            console.log("Populated agents");
            // Handle the form submission
            $("#rule-creation-form").on("submit", function (event) {
                event.preventDefault();

                const ruleName = $("#create-name").val();
                const rule = $("#create-rule").val();
                const agentIds = $("#create-profile-agents").val();
                const profileIds = $("#create-profile").val();
                const ruleCategory = $("#create-category").val()
                const ruleSubCategory = $("#create-sub-category").val()
                const rulePath = $("#create-path").val()
                // Create the profile object
                const ruleObject = {
                    rule: {
                        name: ruleName,
                        exec_rule: rule,
                        category: ruleCategory,
                        sub_category: ruleSubCategory,
                        active: true,
                        path: rulePath
                    },
                    agent_ids: agentIds.map(Number), // Convert agent IDs to numbers
                    agent_profile_ids: profileIds.map(Number) // Convert agent IDs to numbers
                };
                console.log(ruleObject)
                
                const token = localStorage.getItem("access_token");

                if (token) {
                    // Send a POST request to create the profile
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:9001/rules/",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        contentType: "application/json",
                        data: JSON.stringify(ruleObject),
                        success: function (data) {
                            $("#ule-creation-form, .overlay").hide();
                            alert("Rule created successfully!");
                        },
                        error: function (xhr, status, error) {
                            alert("Rule creation failed. Please try again.");
                        }
                    });
                }
            });
        });
        $("#rule-creation-form, .overlay").show();
    });
});