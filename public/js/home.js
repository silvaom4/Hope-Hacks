document.addEventListener('DOMContentLoaded', () => {
    const apodContainer = document.getElementById('apod-container');
    const apodTitle = document.getElementById('apod-title');
    const apodDate = document.getElementById('apod-date');
    const apodBio = document.getElementById('apod-bio');
    const apodImg = document.getElementById('apod-img');

    // Fetch data from the server
    fetch('/astronomyDay')
        .then(response => response.json())
        .then(data => {
            // Update the DOM with the fetched data
            apodTitle.textContent = data.title;
            apodDate.textContent = `Date: ${data.date}`;
            apodBio.textContent = data.bio;
            apodImg.src = data.img;
        })
        .catch(error => console.error('Error fetching astronomy data:', error));
});
