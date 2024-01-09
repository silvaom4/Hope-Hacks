const express = require('express');
const app = express(); // Thank you Nicole for downloading express
const port = 5000;
const path = require('path')
const astronomyStatic = require('./src/utils/astronomyStatic')
const astronomyRandom = require('./src/utils/astronomyRandom')
const astronomyData = require('./src/utils/astronomyData')
const database = require('./database')
const cron = require('node-cron')
const {sendText} = require('./nasa-daily-image/sendText');
const bodyParser = require('body-parser'); //will parse through particular data

// cron.schedule('* * * * *', sendText);

const templatesPath = path.join(__dirname, 'templates')
const session = require('express-session');

// Add middleware to server
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));



app.use(express.static(path.join(__dirname, 'public')));

//This is used to parse the incoming json data and puts in into the body of the req which
//we can then access 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//This will the home page where our astronomy api update will be on the home page 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/astronomyDay', async (req, res) => {
    try {
        const astronomy = await astronomyStatic();
        res.json(astronomy);
    } catch (error) {
        res.send('Error')
    }
});



app.get('/astroTest', (req, res) => {
    if (!req.query.date) {
        return res.send('Error has been made')
    }
    astronomyData(req.query.date, (err, data) => {
        console.log(err, data)
        if (err) {

            return res.send({ err: err })

        }
        res.send(data)
    })

})



app.get('/date', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'date.html'))

})



app.get('/randomTest', (req, res) => {
    if (!req.query.count) {
        return res.send('Error has been made')
    } else {
        astronomyRandom(req.query.count, (err, data) => {
            console.log(err, data)
            if (err) {
                return res.send({ err: err })
            }
            res.send(data)
        })
    }
})


app.get('/count', (req, res) => {

    try {
        res.sendFile(path.join(__dirname, 'templates', 'random.html'))
    }
    catch {
        res.send('Error trying to connect')
    }



})


//This will be the Quiz Style / Image/Video Page
app.get('/explore', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'explore.html'));
    //might need to add the html file that this pat will exist on 
})
//This is a Tenative Idea for following currently that is on Mars
app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'quiz.html'));
    //need to add a html file for where this path will exist
})

app.get('/subscribe', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'subscribe.html'));

})

//created a new route in order to store the express session of a user from either the /login or /newAccount routes
app.get('/getUsername', (req, res) => {
    // Retrieve the username from the session
    const username = req.session.username || null;

    // Send the username as JSON so the front end can access it
    res.json({ username: username });
});


//post is used to process data, we're using it to process the info in our form
app.post('/login', (req, res) => {

    //since we parsed our data, we can grab the body(data sent by the client) and access the variables
    //in our case, the form has name attributes which we can access
    const username = req.body.username;
    const userPassword = req.body.password;
    if (username && userPassword) {

        //we create a variable which holds a query that is interpreted in mySQL
        const myQuery = `
      SELECT * FROM users
      WHERE username = "${username}"
      `;

        //access the file that holds our databse connection
        database.query(myQuery, (err, data) => {
            //checking to make sure we got data back

            if (data.length > 0) {
                //now lets varify if password is correct 
                if (data[0].password === userPassword) {
                    //the user is redirected the main page with their username showing
                    req.session.username = username;
                    res.redirect('/')
                } else {
                    //user is redirected where the form is if incorrect password and get an alert
                    res.send('<script>alert("Wrong password"); window.location.href="/subscribe";</script>');
                }
            } else {
                //user is redirected where the form is if incorrect username
                res.send('<script>alert("Wrong username"); window.location.href="/subscribe";</script>');
            }
        })

    } else {
        // user is redirected to form and given an alert
        res.send('<script>alert("Invalid username or password"); window.location.href="/subscribe";</script>');
    }
})

//same as /login
app.post('/newAccount', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    //checks if all fields have been inputed
    if (!username || !email || !password) {
        return res.redirect('/subscribe');
    }

    //make a query that inserts data onto our database
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    //accessing the database, we input our query, values, and error handling 
    database.query(insertQuery, [username, email, password], (err, result) => {
        if (err) {
            //if an error occurs, they get an errorcode and message
            return res.status(500).send('Internal Server Error');
        }
        // Store the username in the session
        req.session.username = username;
        //if data goes through, the user is directed to main page with their username showing up
        res.redirect('/');
    });
})

app.post('/SMSsubscription' , (req , res) => {
    const phoneNumber = req.body.phoneNumber
    console.log(phoneNumber);

    const insertQuery = 'INSERT INTO subscriptions (phone_number) VALUES (?)';

    database.query(insertQuery, [phoneNumber], (err, result) => {
        if (err) {
            //if an error occurs, they get an errorcode and message
            return res.status(500).send('Internal Server Error');
        }
        // Store the username in the session
        req.session.phoneNumber = phoneNumber;
        //if data goes through, the user is directed to main page with their username showing up
        res.redirect('/');
    });
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);

    client.validationRequests
    .create({friendlyName: `${phoneNumber}`, phoneNumber: `${phoneNumber}`}) //Twilio verification handler but has a paywall in front of it
    .then(validation_request => console.log(validation_request.friendlyName));
})


app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is working on ${port}`)
})

//I moved the server outside to my root in order for the HTML render