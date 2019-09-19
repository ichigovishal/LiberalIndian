// Functions
formValidity = function () {
    // check email
    let email= input[1];
    let email_error = document.querySelectorAll('.error')[0];
    email.addEventListener("focusout", function (event) {
    // Each time the user types something, we check if the
    // email field is valid.
    if (event.target.validity.valid) {
        var formData = new FormData();
        formData.append('email', event.target.value);
        var req = new XMLHttpRequest(); 
        req.open("POST", checkEmail);
        req.setRequestHeader('X-CSRFToken', csrfToken);
        req.setRequestHeader('enctype', "multipart/form-data");
        req .withCredentials = true;
        req.onload = function(event) { 
            let data = JSON.parse(event.target.responseText);
            if(!data.valid){
                email_error.innerHTML = ""; // Reset the content of the message
                email_error.className = "error"; // Reset the visual state of the message

            }
            else if(data.valid){
                email_error.innerHTML = "Email already exits";
                email_error.className = "error active";

            }
         };
        req.send(formData);
     
    }
    else if(!event.target.validity.valid) {
    
        // If the field is not valid, we display a custom
        // error message.
        email_error.innerHTML = "Enter Correct Email";
        email_error.className = "error active";
        // And we prevent the form from being sent by canceling the event
        event.preventDefault();
      }
  }, false);
  // password
  let password=input[2];
   
   let password_error = document.querySelectorAll('.error')[1];
   password.addEventListener("focusout", function (event) {
       // Each time the user types something, we check if the
       // email field is valid.
       if (event.target.validity.valid) {
         password_error.innerHTML = "";
         password_error.className = "error";
        
       }
       else if(!event.target.validity.valid) {
       
           // If the field is not valid, we display a custom
           // error message.
           password_error.innerHTML = "Minimum Length 8 digit is required";
           password_error.className = "error active";
           // And we prevent the form from being sent by canceling the event
           event.preventDefault();
         }
     }, false);
    // confirm password
    let confirm_password=input[3];
   
  let confirm_password_error = document.querySelectorAll('.error')[2];
  confirm_password.addEventListener("focusout", function (event) {
      // Each time the user types something, we check if the
      // email field is valid.
      event.target.pattern = input[2].value;
      if (event.target.validity.valid) {
        confirm_password_error.innerHTML = "";
        confirm_password_error.className = "error";
       
      }
      else if(!event.target.validity.valid) {
      
          // If the field is not valid, we display a custom
          // error message.
          confirm_password_error.innerHTML = "Password Does Not Match";
          confirm_password_error.className = "error active";
          // And we prevent the form from being sent by canceling the event
          event.preventDefault();
        }
    }, false);
    
};

