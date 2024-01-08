// when the index is loaded, this function is fired of 
document.addEventListener("DOMContentLoaded", function () {
    // Fetch the username from the server using a simple GET request
    fetch('/getUsername')
        // if any session is stoted in our route, it'll keep going through the promises stages
        .then(response => response.json())
        .then(data => {
            // Check if the response contains a username
            if (data.username) {
                // Display the username in the page
                document.getElementById('colorlib-logo').innerHTML +=
                    '<span class="usernameDisplay">Hello!, ' + data.username + ' We are taking off!' + '</span>';
            }
        })
        .catch(error => console.error('Error fetching username:', error));
});
