require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const sendText = async () => {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`;
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json'
        }
    };

    const response = await fetch(url, options);
    const data = await response.json();
    
    const body = `
      -- ${data.date} --
      Good Morning!
      Today's Image From Space Is:
      -----
      "${data.title}"
      -----
      ${data.explanation}
    `;
    
    client.messages
      .create({
         body: body,
         mediaUrl: data.url,
         from: '+18332131901',
         to: '+17043696922'
       })
      .then(message => console.log(`message sent:${message.sid}`))
      .catch((error) => console.log(`error:${error.message}`));
}

module.exports = {
    sendText
}