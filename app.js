const express = require('express');
const app = express(); // Thank you Nicole for downloading express
const port = 5000;
const path = require('path')
const astronomyStatic = require('./src/utils/astronomyStatic')
const astronomyRandom = require('./src/utils/astronomyRandom')
const astronomyData = require('./src/utils/astronomyData')

const templatesPath = path.join(__dirname, 'templates')



app.use(express.static(path.join(__dirname, 'public')));



//This will the home page where our astronomy api update will be on the home page 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html' ));
});

app.get('/astronomyDay' , async (req , res) => {
    try {
        const astronomy = await astronomyStatic();
        res.json(astronomy);
    } catch (error) {
        res.send('Error')
    }
});

app.get ('/astroTest' , (req , res) => {
  if(!req.query.date) {
    return res.send('Error has been made')
  } else {
      astronomyData( req.query.date , (err,data) => {
          res.send(data)
      })
   }

    
})

app.get('/date', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'date.html'))

})

app.get('/randomTest' , (req, res) => {
    if(!req.query.count) {
        return res.send('Error has been made')
      } else {
          astronomyRandom( req.query.count , (err,data) => {
              res.send(data)
          })
       }
})
//This will be the Quiz Style / Image/Video Page
app.get('/explore', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'explore.html' ));
   //might need to add the html file that this pat will exist on 
})
//This is a Tenative Idea for following currently that is on Mars
app.get('/quiz', (req , res) => {
    res.sendFile(path.join(__dirname, 'templates', 'quiz.html' ));
  //need to add a html file for where this path will exist
})

app.get ('/subscribe', (req , res) => {
    res.sendFile(path.join(__dirname, 'templates', 'subscribe.html' ));

})

app.listen(port , (err) => {
   if(err) throw err;
   console.log(`Server is working on ${port}`)
})

//I moved the server outside to my root in order for the HTML render