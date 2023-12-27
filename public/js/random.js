console.log('Random Page test');
const randomForm = document.getElementById('random-form')
const randomInput = document.getElementById('random-input')
const randomButton = document.getElementById('random-button')



const ul = document.getElementById('random-ul')

randomForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const count = randomInput.value
    console.log(count);

    ul.innerHTML = ''
    
    fetch('http://localhost:5000/randomTest?count=' + count).then((response) => {
        response.json().then((data) => {
            console.log(data);
            if (data.err) { // getting close
                ul.innerHTML = data.err
            } else { // -- here down everything thing works
                for (let i = 0; i < data.length; i++) {
            
                let container = document.createElement('section')
                 container.className = 'random-container'
               
                // -img
                let imgElement = document.createElement('img') 
                imgElement.className = 'random-img-class'             
                imgElement.src = data[i].img
                imgElement.alt = data[i].title
                container.appendChild(imgElement)
               // -date
                let dateElement = document.createElement('p')
                dateElement.textContent = data[i].date
                container.appendChild(dateElement)

                // -title
                let titleElement = document.createElement('p')               
                titleElement.textContent = data[i].title
                container.appendChild(titleElement)

                // -bio
                let bioElement = document.createElement('p')  
                bioElement.textContent = data[i].bio
                container.appendChild(bioElement)

                
                ul.appendChild(container)

            }

            }

            
        })
    })

})