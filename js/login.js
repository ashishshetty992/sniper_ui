$(document).ready(function () {
    $("#login-form").submit(function (event) {
        event.preventDefault();

        const loginUrl = "http://localhost:9001/token"; // Replace with your API endpoint

        const username = $("#username").val();
        const password = $("#password").val();

        $.ajax({
            type: "POST",
            url: loginUrl,
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                if (data.access_token) {
                    $("#welcome-message").html("Hello, " + username).show();
                    // Redirect to the index.html page after successful login
                    localStorage.setItem("access_token", data.access_token);
                    window.location.href = "index.html";
                } else {
                    $("#welcome-message").html("Login failed. Please try again.").show();
                }
            },
            error: function () {
                $("#welcome-message").html("An error occurred. Please try again.").show();
            }
        });
    });
});
