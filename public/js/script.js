document.addEventListener('DOMContentLoaded', function () {
    const imageGallery = document.querySelector('#imageForm');
    const searchMedia = document.querySelector('#user-input');
    const mediaList = document.querySelector('#mediaList');
    const loadingMore = document.querySelector('#loadMore');
    const mediaModal = document.getElementById('myModal');
    const backButton = document.getElementById('back');
    const modalContent = document.querySelector('.modal-content');
    const loadMoreParent = document.querySelector('#loadMoreParent')
    let limit = 20;
    let data;

    const fetchData = async (url, options) => {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    };
    const addListener = () => {

        const handleLoadMore = loadMore.addEventListener('click', (e) => {
            e.preventDefault();
            limit += 20;
            console.log('New limit:', limit);
    
            data.collection.items.slice(0, limit).forEach(async (item) => {
                const imageArray = item.href;
                const media = await fetch(imageArray)
                    .then((res) => res.json())
                    .then((data) => {
                        const image = data.filter((link) => link.endsWith('small.jpg'));
                        const video = data.filter((link) => link.endsWith('.mp4'));
                        const media = {};
                        if (image) {
                            media['image'] = image[0];
                        }
                        if (video) {
                            media['video'] = video[0];
                        }
                        return media;
                    });
    
                const title = item.data[0].title;
                const description = item.data[0].description;
    
                const resultDiv = document.createElement('div');
    
                if (media.image) {
                    resultDiv.innerHTML = `
                        <div class="exploreMain"> 
                            <img src="${media.image}" alt="${title}"> 
                            <p>${title}</p>  
                        </div>
                    `;
                    mediaList.appendChild(resultDiv);
                    clickElement(resultDiv, title, description, media);
                }
    
                if (media.video) {
                    resultDiv.innerHTML = `
                        <div class="exploreMain">
                            <video width="320" height="240" controls>
                                <source src="${media.video}" type="video/mp4" alt="${title}">
                            </video>
                            <p>${title}</p>
                        </div>
                    `;
                    mediaList.appendChild(resultDiv);
                    clickElement(resultDiv, title, description, media);
                    console.log('Im being clicked');
                }
                loadMoreParent.innerHTML = `<button id=loadMore type="submit">Load More</button>`
                addListener();
            });
        });
    }


    function showImageModal(title, description, media) {   // Modal function that will display modal when triggered by the clickElement that was made
        if (media.image) {
            modalContent.innerHTML = `
            <div class="imagesection">
             <div class="imagerender">
                <img src="${media.image}" alt="${title}" width="300px" height="200px">
             </div>
             <div class="imageinfo">
                <h2>${title}</h2>
                <p>${description}</p>
             </div>
            </div>
                <button id="back" class="back btn">X</button>
            `;
            mediaModal.style.display = 'block';

            const backButton = modalContent.querySelector('.back');
            backButton.addEventListener('click', closeImageModal);
        }
        if (media.video) {
            modalContent.innerHTML = `
            <div class="videosection">
             <div class="videorender">
                <video width="320" height="240" controls>
                    <source src="${media.video}" type="video/mp4" alt="${title}">
                </video>
             </div>
             <div class="videoinfo">
                <h2>${title}</h2>
                <p>${description}</p>
             </div>
            </div>
                <button id="back" class="back btn">X</button>
            `;
            mediaModal.style.display = 'block';

            const backButton = modalContent.querySelector('.back');
            backButton.addEventListener('click', closeImageModal);
        }
    }

    function closeImageModal() {
        mediaModal.style.display = 'none';
    }

    function clickElement(resultDiv, title, description, media) {
        resultDiv.addEventListener('click', () => {
            showImageModal(title, description, media);
        });
    }

    document.getElementById('imageForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const searchedMedia = encodeURIComponent(searchMedia.value.trim());

        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            };

            const url = `https://images-api.nasa.gov/search?q=${searchedMedia}`;
            console.log(url);

            data = await fetchData(url, options);

            if (data && data.collection && data.collection.items) {
                mediaList.innerHTML = '';

                if (data && data.collection && data.collection.items.length === 0) {
                    mediaList.innerHTML = `Sorry, there aren't any results for "${searchedMedia}". Please try another word.`;
                }

                
                console.log(data.collection.items);

                data.collection.items.slice(0, limit).forEach(async (item) => {
                    const imageArray = item.href;
                    const media = await fetch(imageArray)
                        .then((res) => res.json())
                        .then((data) => {
                            const image = data.filter((link) => link.endsWith('small.jpg'));
                            const video = data.filter((link) => link.endsWith('.mp4'));
                            const media = {};
                            if (image) {
                                media['image'] = image[0];
                            }
                            if (video) {
                                media['video'] = video[0];
                            }
                            return media;
                        });

                    const title = item.data[0].title;
                    const description = item.data[0].description;

                    const resultDiv = document.createElement('div');

                    if (media.image) {
                        resultDiv.innerHTML = `
                            <div class="exploreMain"> 
                                <img src="${media.image}" alt="${title}"> 
                                <p>${title}</p>  
                            </div>
                        `;
                        resultDiv.classList.add('mediaItem')
                        mediaList.appendChild(resultDiv);
                        clickElement(resultDiv, title, description, media);
                    }

                    if (media.video) {
                        resultDiv.innerHTML = `
                            <div class="exploreMain">
                                <video width="320" height="240" controls>
                                    <source src="${media.video}" type="video/mp4" alt="${title}">
                                </video>
                                <p>${title}</p>
                            </div>
                        `;
                        resultDiv.classList.add('mediaItem')
                        mediaList.appendChild(resultDiv);
                        clickElement(resultDiv, title, description, media);
                        console.log('Im being clicked');
                    }
                    loadMoreParent.innerHTML = `<button id=loadMore type="submit">Load More</button>`
                    addListener();
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