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

    // Make a GET request to fetch roles
    $.ajax({
        type: "GET",
        url: "http://localhost:9001/agentprofiles/?skip=0&limit=10",
        dataType: "json",
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

    // Make a GET request to fetch agents
    $.ajax({
        type: "GET",
        url: "http://localhost:9001/agents/?skip=0&limit=10",
        dataType: "json",
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
                
                const token = localStorage.getItem("access_token");

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
                const agentIP = $("#create-agent-ip").val();
                const agentActive = $("#create-agent-active").prop("checked");
                const password = $("#create-agent-password").val();

                // Create the agent object
                const agentObject = {
                    name: agentName,
                    ip_address: agentIP,
                    active: agentActive,
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
                        name: profileName
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
    
                // Create the profile object
                const ruleObject = {
                    rule: {
                        name: ruleName,
                        exec_rule: rule,
                    },
                    agent_ids: agentIds.map(Number), // Convert agent IDs to numbers
                    agent_profile_ids: profileIds.map(Number) // Convert agent IDs to numbers
                };
                
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
    
        // Show the #rule-creation-form after loading
        $("#rule-creation-form, .overlay").show();
    });
});