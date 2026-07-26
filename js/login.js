let email = document.querySelector("#email"); 
let password = document.querySelector("#password");

let loginBtn = document.querySelector("#sign_in");

let getUser = localStorage.getItem("email")
let getPassword = localStorage.getItem("password")
let savedFirstName = localStorage.getItem("firstName");

loginBtn.addEventListener ("click" , function(e){
    e.preventDefault()
    if (email.value==="" || password.value===""){
        alert("please fill data ")
    } else {
        if ( (getUser && getUser.trim() === email.value && getPassword && getPassword === password.value )  )
        {
            localStorage.setItem("loggedIn", "true");
            
            setTimeout ( () => {
                window.location = "index.html"
            } , 1500)
        } else {
            alert("email or password is wrong ")
        }
    }
})