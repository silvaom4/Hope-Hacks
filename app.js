const express = require('express');
const app = express(); // Thank you Nicole for downloading express
const port = 5000;
const path = require('path')
const astronomyStatic = require('./src/utils/astronomyStatic')
const astronomyRandom = require('./src/utils/astronomyRandom')
const astronomyData = require('./src/utils/astronomyData')
// const database = require('./database')

const templatesPath = path.join(__dirname, 'templates')



app.use(express.static(path.join(__dirname, 'public')));

//This is used to parse the incoming json data and puts in into the body of the req which
//we can then access 
app.use(express.json());
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
    } else {
        astronomyData(req.query.date, (err, data) => {
            res.send(data)
        })
    }


})

app.get('/date', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'date.html'))

})



app.get('/randomTest', (req, res) => {
    if (!req.query.count) {
        return res.send('Error has been made')
    } else {
        astronomyRandom(req.query.count, (err, data) => {
            res.send(data)
        })
    }
})

app.get('/count', (req,res) => {

    try {
        res.sendFile(path.join(__dirname,'templates','random.html'))
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
                    //the user is directed the main page for now
                    res.redirect('/')
                } else {
                    //user is directed where the form is if incorrect password
                    res.redirect('/subscribe');
                }
            } else {
                //user is directed where the form is if incorrect username
                res.redirect('/subscribe');
            }
        })

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
        //if data goes through, the user is directed to main page for now
        res.redirect('/');
    });
})



app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is working on ${port}`)
})

//I moved the server outside to my root in order for the HTML render