// the user can put their age and it gives them that many pictures
//We've extracted just the date, title, bio, and img url. 
//depending what data we want to show in the front end
const astronomyRandom = (count , callback) => {
    const url = 'https://api.nasa.gov/planetary/apod?api_key=QOeP5NpXEklQLQfszDMeP3SXy72Y1iV8b5bAhe3G&count=' + count;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    }

    // Return the promise generated by fetch
    return fetch(url, options)
        .then(res => res.json())
        .then(json => {
            const data = json.map(item => ({
                date: item.date,
                title: item.title,
                bio: item.explanation,
                img: item.url
            }));
            
            callback(undefined , data)
        })
        .catch(err => {
            throw new Error('Error with data');
        })
};

module.exports = astronomyRandom;