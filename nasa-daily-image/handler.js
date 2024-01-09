const twilio = require('twilio');
const express = require('express');
const fetch = require('cross-fetch');
// const cron = require('node-cron');

require('dotenv').config();

const app = express();

app.get('/send-message', async (req, res) => {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN
  } = process.env;

  const TWILIO_PHONE_NUMBER = '+18332131901';
  const MY_PHONE_NUMBER = '+19802308366'; // need to figure out how to input the numbers from our database to here

  const NASA_API_KEY = 'QOeP5NpXEklQLQfszDMeP3SXy72Y1iV8b5bAhe3G';
  const date = '2022-01-01'; 

  const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  };

  try {
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

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const message = await client.messages.create({
      body: body,
      mediaUrl: data.url,
      from: TWILIO_PHONE_NUMBER,
      to: MY_PHONE_NUMBER
    });

    console.log("Message sent successfully:", message.sid);
    res.send("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error sending message");
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});




// cron.schedule('0 14 * * *', async () => {
//   try {
//     const response = await fetch('http://localhost:4000/send-message');
//     const result = await response.text();
//     console.log(result);
//   } catch (error) {
//     console.error("Error sending scheduled message:", error);
//   }
// });




//////^^^^^^^^^^ THIS HANDLES SCHEDULING