console.log('This is date test');
const dateForm = document.getElementById('date-form')
const dateInput = document.getElementById('date-input')
const datePara = document.getElementById('date-para')
const datePara2 = document.getElementById('date-para2')
const datePara3 = document.getElementById('date-para3')
const datePara4 = document.getElementById('date-para4')



// bug - date only goes to 1995-06-16

dateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(dateInput.value);
    const date = dateInput.value
    datePara.textContent = 'Loading'
    datePara2.textContent = ''
    datePara3.textContent = ''
    datePara4.textContent = ''

    fetch('http://localhost:5000/astroTest?date='+ date).then((response) => {
        response.json().then((data) => {
            if (data.err) {
                datePara.textContent = data.err
            } else {
                 console.log(data);
            datePara.textContent = data.date 
            datePara2.textContent = data.title 
            datePara3.textContent = data.bio

            datePara4.innerHTML = `<img src='${data.img}' alt='${data.title}'>`
            }
           
            
        })
    })




})