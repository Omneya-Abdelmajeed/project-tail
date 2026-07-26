let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let password = document.getElementById("password");

let register_btn = document.querySelector(".register");

register_btn.addEventListener("click", function (e) {
    e.preventDefault(); 

    if (firstName.value === "" || lastName.value === "" || email.value === "" || password.value === "") {
        alert("Please fill data");
    } else {
       
        localStorage.setItem("firstName", firstName.value.trim());
        localStorage.setItem("lastName", lastName.value.trim());
        localStorage.setItem("email", email.value.trim());  
        localStorage.setItem("password", password.value);  

        alert("Registration Successful!");

        setTimeout(() => {
            window.location = "login.html";
        }, 1500);
    }
});
