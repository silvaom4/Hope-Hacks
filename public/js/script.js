document.addEventListener('DOMContentLoaded', function() {
    const imageGallery = document.querySelector('#imageForm');
    const searchMedia = document.querySelector('#user-input');
    const mediaList = document.querySelector('#mediaList');


    const fetchData = async (url, options) => {
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(error);
        }
      };

    document.getElementById('imageForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const searchedMedia = encodeURIComponent(searchMedia.value.trim()); // handle the user input and doesnt read any unnessary spaces when entering contact


        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            };

            const url = `https://images-api.nasa.gov/search?q=${searchedMedia}`;
            console.log(url);

            const data = await fetchData(url, options);

            if (data && data.collection && data.collection.items) { //This helps establish whether data collection and the collection items is the correct structure of the API

                mediaList.innerHTML = ''; //clear existing content inside the div "medialist". Each time a new fetch is displayed it replaces the existing content 


                data.collection.items.forEach((item) => { //Iterates through the data of the API
                    console.log(item.data);

                    const imageURL = item.links[0].href; // this handles what I want to get from the API
                    const title = item.data[0].title;
                    const description = item.data[0].description;

                    const resultDiv = document.createElement('div') //This is creating a new div that will then have all of the elements I want to get from the api

                    resultDiv.innerHTML = ` 
                        <img src="${imageURL}" alt="${title}"> 
                        <p>${title}</p>
                        <h5>${description}</h5>
                    `;

                    mediaList.appendChild(resultDiv); //this line appends the resultDiv to the mediaList div. This adds a new div for each result to the HTML.

                    
                });
                
            } else {
                console.error('Data structure is not as expected:', data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });
});
