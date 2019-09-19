//varibles
var readerBlock = document.querySelector(".reader__block");
var contactUs = document.querySelector(".contactUs__button");

// class
class contactus{
    constructor(){
        this.button = contactUs;
        this.name = '';
        this.email = '';
        this.detail = '';
    }
    removeRed(ele){
        ele.style.cssText = '';
    }
    nameCheck(){
        this.name = document.querySelector("#contactUs__name");
        if (this.name.value == '') {
            this.name.style.cssText = 'border: 3px red solid;';
            return false;
        }
        else{
            return true;
        }
        

    }
    emailCheck(){
        this.email = document.querySelector("#contactUs__email");
        if (this.email.value == '') {
            this.email.style.cssText = 'border: 3px red solid;';
            return false;
        }
        // else if(this.email.value.tes){

        // }
        else{
            return true;
        }
        
    }
    detailCheck(){
        this.detail = document.querySelector("#contactUs__detail");
        if (this.detail.value == '') {
            this.detail.style.cssText = 'border: 3px red solid;';
            return false;
        }
        else{
            return true;
        }
        
    }
    timer(){
        let pop = document.querySelector(".contactUs__popup");
        pop.style.cssText = "display: block;";
        let tym = 0;
        setInterval(()=>{
            tym ++;
            if(tym == 3){
                pop.style.cssText = "";
            }
        }, 1000);
    }
    main(){
        this.button.setAttribute("times", '1');
        this.button.addEventListener("click", (event)=>{
            if (this.button.getAttribute("times") > 1){
                let elements = [this.name, this.email, this.detail]
                elements.forEach((element) => {
                    this.removeRed(element);
                });
                
            }
            console.log(this.button.getAttribute("times"));
            this.button.setAttribute("times", String(this.button.getAttribute("times") + 1));

            if (this.nameCheck() && this.emailCheck() && this.detailCheck()) {
                let obj = {
                    name: this.name.value,
                    email: this.email.value,
                    detail: this.detail.value
                };
                const headers = new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                });
                
                fetch(`${window.location.href}api/contactus/`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(obj),
                    "credentials": 'include',
                }).catch((error)=>{
                    console.log(error); 
                });
                let elements = [this.name, this.email, this.detail]
                elements.forEach((element) => {
                    this.removeRed(element);
                });
                this.timer();
            }
        });
    }       
}

function readerPopUp() {
    document.querySelector(".reader__body--popup").style.cssText = "";
    clearAlert();
};
var timeoutID;
var oneTime = false;
function delayedAlert() {
    if (!oneTime) {
        document.querySelector(".reader__body--popup").style.cssText = "display: block";
        timeoutID = window.setTimeout(readerPopUp, 3*1000);
        oneTime = true;
    };
};

function clearAlert() {
  window.clearTimeout(timeoutID);
};
    

var interval;
var ticking;
class scrollAnimation{
    constructor(ele){
        this.element = ele;
        this.page = {'#introduction': false, '#articles': false, '#discords': false, '#contact-us': false, '#footer': false};
        ticking = false;
    }
    
    pageHeightCreate(){
        this.pageHeight = [];
        this.element.forEach((eac)=>{
        this.pageHeight.push(eac.offsetTop);
        });
    }
    waiting(){
        interval = window.setTimeout(this.fun, 0.8 * 1000);
    }
    fun(){
        ticking = false;
        window.clearTimeout(interval);
    }
    doSomething() {
        
        if(this.last_known_scroll_position< this.pageHeight[0]){
            if(!(this.page["#introduction"])){
                this.page = {'#introduction': false, '#articles': false, '#discords': false, '#contact-us': false, '#footer': false};
                this.page = {'#introduction': true, '#articles': false, '#discords': false, '#contact-us': false, '#footer': false};
            }
        }
        else if(this.pageHeight[0] < this.last_known_scroll_position && this.last_known_scroll_position< this.pageHeight[1]){
            if(!(this.page['#articles'])){
                this.page = {'#introduction': false, '#articles': false, '#discords': false, '#contact-us': false, '#footer': false};
                delayedAlert();
                this.page = {'#introduction': false, '#articles': true, '#discords': false, '#contact-us': false, '#footer': false};
            }
        }
        else if(this.pageHeight[1] < this.last_known_scroll_position && this.last_known_scroll_position < this.pageHeight[2]){
            if(!(this.page['#discords'])){
                this.page = {'#introduction': false, '#articles': false, '#discords': false, '#contact-us': false, '#footer': false};
                this.page = {'#introduction': false, '#articles': false, '#discords': true, '#contact-us': false, '#footer': false};
            }
        }
        else if(this.pageHeight[2] < this.last_known_scroll_position && this.last_known_scroll_position < this.pageHeight[3]){
            if(!(this.page['#contact-us'])){
                this.page = {'#introduction': false, '#articles': false, '#discords': false, '#contact-us': false, '#footer': false};
                this.page = {'#introduction': false, '#articles': false, '#discords': false, '#contact-us': true, '#footer': false};
            }
        }
        else if(this.last_known_scroll_position > this.pageHeight[3]){
            if(!(this.page['#footer'])){
                this.page = {'#introduction': false, '#articles': false, '#discords': false, '#contact-us': false, '#footer': false};
                this.page = {'#introduction': false, '#articles': false, '#discords': false, '#contact-us': false, '#footer': true};
            }
        }
    }
  
   active(){
       this.pageHeightCreate();
        window.addEventListener('scroll', (e)=>{
            this.last_known_scroll_position = document.body.scrollTop;
            if (!ticking) {
                ticking = true;
                this.doSomething();
                this.waiting();
            }
        });
    }
}

function navPopDown() {
    check_button = document.querySelector(".nav__checkbox");
    document.querySelector(".nav__background").addEventListener("click", ()=>{
        check_button.checked = '';
    });
    document.querySelectorAll(".nav__link").forEach((eve)=>{
        eve.addEventListener("click", ()=>{
            check_button.checked = '';
        });
    });
    
}
// funtion
let readerCliper = new cliper(readerBlock);
readerCliper.effect(`polygon(0 ${readerCliper.valueFrom(100, "height", "start")}, 100% 0, 100% ${readerCliper.valueFrom(100, "height", "end")}, 0% 100%)`);

var contUs = new contactus();
contUs.main();

let scrollClass = new scrollAnimation(document.querySelectorAll('.page'));
scrollClass.active()

navPopDown();
// scrollClass.active();

// importand code
//  <---------------------------------------------------------------------------------------------------------------

//functions
// var checker = (elementToChecked, checkvar)=>{
//     if(checkvar){
//         let value = "checked"
//         element.checked = value
//     }
//     else{
//         let value=""
//         element.checked = value
//     }
//     return element.checked
// }
// var removeId = (element)=>{
//     element.id = ""
//     return element.id
// }
// class readerBlockMover{
//     constructor(moverId){
//        this.moverId = moverId;
//        this.message = "";
//        this.intro = readerBody_intro.offsetWidth;
//        this.body1 = readerBody_1.offsetWidth;
//        this.body2 = readerBody_2.offsetWidth;
//        this.body3 = readerBody_3.offsetWidth;
//        this.check = readerIndicaterCheckbox;
//     }

//     removeTransform() {
//         readerBlock.style.cssText = ""
//     }

//     transform(px) {
//         readerBlock.style.cssText = `transform: translateX(${px});`
//         console.log(readerBlock.style.cssText)
//     }

//     checked(ele) {
//         for (let i = 0; i < this.check.length; i++) {
//             const element = this.check[i];
//             element.checked = ""
//         }
//         if(ele == "intro"){
//             return true
//         }
//         else if(ele == "1"){
//             readerIndicaterCheckbox_1.checked = "checked"
//             return true
//         }
//         else if(ele == "2"){
//             readerIndicaterCheckbox_2.checked = "checked"
//             return true
//         }
//         else if(ele == "3"){
//             readerIndicaterCheckbox_3.checked = "checked"
//             return true
//         }
//         else{
//             return false
//         }

//     }

//     work() {
//         this.removeTransform()
//         if(this.moverId == "intro"){
//             this.transform(`${this.intro + 100 + this.body1}px`)
//             this.checked(this.moverId)
//             return true
//         }
//         else if(this.moverId == "1"){
//             this.transform(`${50 + this.body1}px`)
//             this.checked(this.moverId)
//             return true
//         }
//         else if(this.moverId == "2"){
//             this.transform("0")
//             this.checked(this.moverId)
//             return true
//         }
//         else if(this.moverId == "3"){
//             this.transform(`-${50 + this.body3}px`)
//             this.checked(this.moverId)
//             return true
//         }
//         else{
//             return false
//         }
//     }
// }
// //variables
// var  readerIndicaterCheckbox_1 = document.querySelector(" .reader__indicater__checkbox--1")
// var  discussWrapper = document.querySelector(".discuss__wrapper")
// var readerBlock = document.querySelector(".reader__block")
// var readerBody_intro = document.querySelector(".reader__body--intro")
// var readerBody_1 = document.querySelector(".reader__body--1")
// var readerBody_2 = document.querySelector(".reader__body--2")
// var readerBody_3 = document.querySelector(".reader__body--3")
// var readerIndicaterCheckbox = document.querySelectorAll(".reader__indicater__checkbox")
// var readerIndicaterCheckbox_1 = document.querySelector(".reader__indicater__checkbox--1")
// var readerIndicaterCheckbox_2 = document.querySelector(".reader__indicater__checkbox--2")
// var readerIndicaterCheckbox_3 = document.querySelector(".reader__indicater__checkbox--3")



// //program
// readerIndicaterCheckbox_1.addEventListener("change", (event)=>{
//     if(readerIndicaterCheckbox_1.checked){
//         let y = new readerBlockMover(readerIndicaterCheckbox_1.value)
//         y.work()
//     }
// })
// readerIndicaterCheckbox_2.addEventListener("change", (event)=>{
//     if(readerIndicaterCheckbox_2.checked){
//         let y = new readerBlockMover(readerIndicaterCheckbox_2.value)
//         y.work()
//     }
// })
// readerIndicaterCheckbox_3.addEventListener("change", (event)=>{
//     if(readerIndicaterCheckbox_3.checked){
//         let y = new readerBlockMover(readerIndicaterCheckbox_3.value)
//         y.work()
//     }
// })

// let reader = document.querySelector(".reader__block");

// // function

// // When true, moving the mouse draws on the canvas
// var isDrawing = false;
// var x = 0;
// var y = 0;
// var transform = 0;
// var moveTime = 0;


// // The x and y offset of the canvas from the edge
// // of the page.
// const rect = reader.getBoundingClientRect();

// // Add the event listeners for mousedown, mousemove, and mouseup
// reader.addEventListener(' touchstart', e => {
//     x = e.clientX;
//   isDrawing = true;
// });

// reader.addEventListener(' touchmove', e => {
//   if (isDrawing === true) {
//      moveTime ++;
//      console.log("touchON")

//      if (moveTime > 10) {
//         x = e.clientX;
//         moveTime = 0;     
//      }
//      else if((x - e.clientX) > 0){
//          console.log("+move")

//      }
//      else if((x - e.clientX) < 0){
//         console.log("-move");

//     }
     
    
    
//   }
// });

// reader.addEventListener(' touchend', e => {
//   if (isDrawing === true) {
    
//     x = 0;
//     isDrawing = false;
//     moveTime = 0;
//   }
// });

//  ---------------------------------------------------------------------------------------------------------->