const form = document.querySelector('#form')
const locState = document.querySelector('#loc-state')
const splash = document.querySelector('.splash')
const username = localStorage.getItem('username')
const reset = document.querySelector('#reset-username')
const clientContainer = document.querySelector('.client-container')
const recomendContainer = document.querySelector('.recomend-container')
const quickMenu = document.querySelector('.menu-button')


if(navigator.geolocation){
navigator.geolocation.getCurrentPosition((position) => {
        locState.innerHTML = 'Allowed';
        let username = localStorage.getItem('username')

        if(username) {
            splash.classList.remove('show')
            splash.classList.add('hide')
            main(username, position.coords.latitude, position.coords.longitude)
        } else {
            form.classList.remove('hide')
            form.classList.add('show')
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if(form.check.checked) {
                    localStorage.setItem('username', form.username.value)
                } 
                main(form.username.value, position.coords.latitude, position.coords.longitude)
                splash.classList.add('hide')
            })
        }

        reset.addEventListener('click', ()=>{
            localStorage.removeItem('username')
            window.location.reload()
        })
    })
} else {
    console.log('Not supported!')
}


const openClient = document.querySelector('.open-client')
openClient.addEventListener('click', ()=>{
    clientContainer.style.display = 'block';
    clientContainer.classList.remove('animate__fadeOutRight')
    clientContainer.classList.add('animate__fadeInRight')
    window.history.back()
})
const closeClient = document.querySelector('.close-client')
closeClient.addEventListener('click', ()=>{
    // clientContainer.style.display = 'none'
    clientContainer.classList.remove('animate__fadeInRight')
    clientContainer.classList.add('animate__fadeOutRight')
})


const go = document.querySelector('.go')
go.addEventListener('click', ()=> {recomendContainer.style.display = 'block'; window.history.back()} )

const recClose = document.querySelector('.rec-close')
recClose.addEventListener('click', ()=> {recomendContainer.style.display = 'none'})




// document.addEventListener('DOMContentLoaded', function() {
    //     if (!Notification) {
    //       alert('Desktop notifications not available in your browser. Try Chromium.');
    //       return;
    //     }
      
    //     if (Notification.permission !== "granted")
    //       Notification.requestPermission();
    //   });
      
    //   function notifyMe(title, msg, logo="https://github.com/faisal-shohag/realtime_location_tracking/blob/master/public/images/3d-navigation.png?raw=true") {
    //     if (Notification.permission !== "granted")
    //       Notification.requestPermission();
    //     else {
    //       var notification = new Notification(title, {
    //         icon: logo,
    //         body: msg,
    //       });
    //     }
    //   }
      
     



