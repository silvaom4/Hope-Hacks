document.addEventListener('DOMContentLoaded', function() {
    const imageGallery = document.querySelector('#imageForm');
    const searchMedia = document.querySelector('#user-input');
    const mediaList = document.querySelector('#mediaList');


    const fetchData = async (url, options) => { // async keyword means that this function is asynchronous and will continue running without blocking the Event Loop
        try {
          const response = await fetch(url, options);  // this waiting to get the value of the "fetch" and once it has that value it stores it i the response variable
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


                data.collection.items.forEach( async (item) => { //Iterates through the data of the API
                    const imageArray = item.href; // this handles what I want to get from the API
                    const media = await fetch(imageArray)
                     .then( res => res.json())
                     .then( data => {
                        const image = data.filter(link => link.endsWith('small.jpg'))  //the filter out smalljpg and video that will show on our frontend
                        const video = data.filter(link => link.endsWith('.mp4'))
                        const media = {};
                        if(image){
                            media['image']= image[0];
                        } 
                        if(video) {
                            media['video']= video[0];
                        }
                        console.log(media)
                        return media

                     })
                    // console.log(imageUrl)
                    const title = item.data[0].title;
                    const description = item.data[0].description;

                    const resultDiv = document.createElement('div')
                    // resultDiv.classList.add('grid'); //This is creating a new div that will then have all of the elements I want to get from the api
                    if (media.image) {
                            resultDiv.innerHTML = `
                            <div class = "exploreMain"> 
                                <img src="${media.image}" alt="${title}"> 
                                <p>${title}</p>
                                <h5>${description}</h5>
                            </div>
                            `;
                        }
                    if (media.video) {
                         resultDiv.innerHTML = ` 
                         <div class = "exploreMain">
                                <video width="320" height="240" controls> <source src="${media.video}" type="video/mp4" alt="${title}"></video>
                                <p>${title}</p>
                                <h5>${description}</h5>
                        </div>
                            `;
                    }

                    

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




const fetchData2 = async (url , options) => {
    
    try {
        const response = await fetch(url , options);
        const data = await response.json();
        return data
    } catch (error) {
        console.log(err)
    }
}