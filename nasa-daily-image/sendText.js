require('dotenv').config();
const fetch = require('node-fetch');
const database = require('../database')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const sendText = async () => {

    const NASA_API_KEY = 'QOeP5NpXEklQLQfszDMeP3SXy72Y1iV8b5bAhe3G';
    const date = '2022-01-01'; 
    
    console.log('We are here')
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    const myQuery = `
    SELECT * FROM subscriptions
    `;
    
    const db = database.query(myQuery, (err, data) => {
        //checking to make sure we got data back
       

        console.log(data)
        // if (data.length > 0){       
        // } else {
        //     //user is redirected where the form is if incorrect username
        //     res.send('<script>alert("Wrong username"); window.location.href="/subscribe";</script>');
        // }
        return data

    })
       

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(db)
        
        const body = `
          -- ${data.date} --
          Good Morning!
          Today's Image From Space Is:
          -----
          "${data.title}"
          -----
          ${data.explanation}
        `;
        console.log(body)
        data.forEach(number => {
            const {phone_number} = number
            client.messages
            .create({
               body: body,
               mediaUrl: data.url,
               from: '+18332131901',
               to: phone_number
             })
            .then(message => console.log(`message sent:${message.sid}`))
            .catch((error) => console.log(`error:${error.message}`));
        })

    } catch (error) {
        console.log(`error: ${error.message}`)
    }
}

module.exports = {
    sendText
}