//when the subscriber page is loaded, this function fires of
document.addEventListener("DOMContentLoaded", function () {
    //we get our sign up form from the subscribers page
    const signUpForm = document.querySelector(".sign-up-form");

    //it listens to our submit buttion and fires the next function
    signUpForm.addEventListener("submit", function (event) {
        //allows to do the next validation before the form is fully dubmitted
        event.preventDefault();

        // Validate username using regex (alphanumeric characters only)
        const usernameInput = signUpForm.querySelector('input[name="username"]');
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(usernameInput.value)) {
            alert("Invalid username. Please use alphanumeric characters only.");
            return;
        }

        // Validate password using regex (at least 8 characters, including at least one uppercase letter, one lowercase letter, and one number)
        const passwordInput = signUpForm.querySelector('input[name="password"]');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(passwordInput.value)) {
            alert("Invalid password. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.");
            return;
        }

        // Validate email using regex
        const emailInput = signUpForm.querySelector('input[name="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            alert("Invalid email address.");
            return;
        }

        // If all validations pass, submit the form
        signUpForm.submit();
    });
});


//same as the sign up form
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Validate username using
        const usernameInput = loginForm.querySelector('input[name="username"]');
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(usernameInput.value)) {
            alert("Invalid username. Please use alphanumeric characters only.");
            return;
        }

        // Validate password
        const passwordInput = loginForm.querySelector('input[name="password"]');
        if (passwordInput.value.trim() === "") {
            alert("Password is required.");
            return;
        }

        // If all validations pass, submit the form
        loginForm.submit();
    });
});