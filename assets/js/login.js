(function() {
    "use strict";
    $('.alert').hide()

    console.log("Hello World!");
    $("#login-form").on("submit", function (event) {
        event.preventDefault();

        const loginUrl = "http://127.0.0.1:9001/token"; // Replace with your API endpoint

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
                    console.log(data)
                    localStorage.setItem("access_token", data.access_token);
                    localStorage.setItem("username", username);
                    setTimeout(function () {
                        window.location.href = "index.html";
                        console.log('data')
                    }, 500);
                } else {
                    $("#welcome-message").html("Login failed. Please try again.").show();
                }
            },
            error: function () {
                $("#welcome-message").html("An error occurred. Please try again.").show();
            }
        });
    });

})();