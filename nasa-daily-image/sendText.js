require('dotenv').config();
const fetch = require('node-fetch');
const database = require('../database')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const sendText = async () => {

    const NASA_API_KEY = 'QOeP5NpXEklQLQfszDMeP3SXy72Y1iV8b5bAhe3G';
    const currentDate = new Date().toISOString().split('T')[0];
    
    console.log('We are here')
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${currentDate}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json'
        }
    };
    const myQuery = `
    SELECT * FROM subscriptions
    `;
    
    const db = database.query(myQuery, async (err, data) => {
        // checking to make sure we got data back
        console.log(data);

        try {
            const response = await fetch(url, options);
            const nasaData = await response.json();
            
            const body = `
              -- ${nasaData.currentDate} --
              Good Morning!
              Today's Image From Space Is:
              -----
              "${nasaData.title}"
              -----
              ${nasaData.explanation}
            `;

            if (data.length > 0) {
                data.forEach(number => {
                    const { phone_number } = number;
                    client.messages
                        .create({
                            body: body,
                            mediaUrl: nasaData.url,
                            from: '+18332131901',
                            to: phone_number
                        })
                        .then(message => console.log(`message sent:${message.sid}`))
                        .catch((error) => console.log(`error:${error.message}`));
                });
            } else {
                console.log('No subscribers found.');
            }
        } catch (error) {
            console.log(`error: ${error.message}`);
        }
    });
};

module.exports = {
    sendText
}