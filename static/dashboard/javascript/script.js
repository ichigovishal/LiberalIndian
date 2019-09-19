function profileUpload() {
    document.uploadForm.submit();
    
}

function openPopUp() {
    document.querySelector(".dashboard__headingPopup").style.cssText = 'display: block; opacity: 1;';
}

function closePopUp() {
    document.querySelector(".dashboard__headingPopup").style.cssText ='';
}
function formValidity() {
    // old password
   let old_password= document.getElementById('old-password');
let old_password_error = document.querySelectorAll('.error')[0];
old_password.addEventListener("focusout", function (event) {
    // Each time the user types something, we check if the
    // email field is valid.
    if (event.target.validity.valid) {
        var formData = new FormData();
        formData.append('old_password', event.target.value);
        var req = new XMLHttpRequest(); 
        req.open("POST", checkPassword);
        req.setRequestHeader('X-CSRFToken', csrfToken);
        req.setRequestHeader('enctype', "multipart/form-data");
        req .withCredentials = true;
        req.onload = function(event) { 
            let data = JSON.parse(event.target.responseText);
            if(data.valid){
                old_password_error.innerHTML = ""; // Reset the content of the message
                old_password_error.className = "error"; // Reset the visual state of the message

            }
            else if(!data.valid){
                old_password_error.innerHTML = "Old Password Is Incorrect";
                old_password_error.className = "error active";

            }
         };
        req.send(formData);
     
    }
    else if(!event.target.validity.valid) {
    
        // If the field is not valid, we display a custom
        // error message.
        old_password_error.innerHTML = "Enter Correct Password";
        old_password_error.className = "error active";
        // And we prevent the form from being sent by canceling the event
        event.preventDefault();
      }
  }, false);

  // new password
  let new_password= document.getElementById('new-password');
  let new_password_error = document.querySelectorAll('.error')[1];
  var new_password_value;
  new_password.addEventListener("focusout", function (event) {
      // Each time the user types something, we check if the
      // email field is valid.
      new_password_value = event.target.value;
      if (event.target.validity.valid) {
        new_password_error.innerHTML = "";
        new_password_error.className = "error";
       
      }
      else if(!event.target.validity.valid) {
      
          // If the field is not valid, we display a custom
          // error message.
          new_password_error.innerHTML = "Minimum Length 8 digit is required";
          new_password_error.className = "error active";
          // And we prevent the form from being sent by canceling the event
          event.preventDefault();
        }
    }, false);

    // confirm password
    let confirm_password= document.getElementById('confirm-password');
   
  let confirm_password_error = document.querySelectorAll('.error')[2];
  confirm_password.addEventListener("focusout", function (event) {
      // Each time the user types something, we check if the
      // email field is valid.
      event.target.pattern = new_password_value;
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


    
}
document.querySelector(".dashboard__changePasswordSubmit").addEventListener("click", (event)=>{
    if(document.changePasswordForm.reportValidity()){
        document.changePasswordForm.submit();
        event.removeEventListener();
    }
    

});
function resize() {
    let dashboard_block= document.querySelectorAll('#listBlock');
    let dashboard_title= document.querySelectorAll('.dashboard__list--title');
    let dashboard_article_list_block= document.querySelector('.dashboard__articleBody');
    let dashboard_discord_list_block= document.querySelector('.dashboard__discodeBody');
    dashboard_discord_list_block.style.cssText = `height: ${dashboard_block[0].offsetHeight - dashboard_title[0].offsetHeight}px;`;
    dashboard_article_list_block.style.cssText = `height: ${dashboard_block[1].offsetHeight - dashboard_title[1].offsetHeight}px;`;

   
    
}
resize();
window.addEventListener('resize', resize);
formValidity();