// Global variable
var cUSTOMcOLORaDDON = {
    document: "",
    brNumber: 0,
    autoDocumentCreater: function(ele, color){
        let newDoc = document.createElement("button");
        newDoc.classList.add("text__colors", `text__colors-addOn`);
        newDoc.style.cssText = `background-color: ${color};`;
        newDoc.setAttribute("value", color);
        ele.appendChild(newDoc);
    },
    addDocument: function(color, ele){
        this.document = this.document + ` <button class="text__colors text__colors-green" style="background-color: ${color};" value="${color}"></button>`;
        this.autoDocumentCreater(ele, color);
        this.brNumber ++;
    }
};
var iMAGE_SCR;
// function
var documentBody = function (aCommandName, aShowDefaultUI, aValueArgument) {
    document.execCommand(aCommandName, aShowDefaultUI, aValueArgument);
};
var textSizeButtonF = function(){
    let button = document.querySelectorAll(".text__fontSize");
    let n = 0;
    button.forEach((item)=>{
        item.setAttribute("number", String(n));
        item.addEventListener("click", (event)=>{
            if(item.getAttribute("number") == "0"){
                documentBody("fontSize", false, 6);
                console.log(item.getAttribute("number"));
            }
            else if(item.getAttribute("number") == "1"){
                documentBody("fontSize", false, 4);
                console.log(item.getAttribute("number"));
            }
            else if(item.getAttribute("number") == "2"){
                console.log(item.getAttribute("number"));
                documentBody("fontSize", false, 2);
            }
        });
        n ++;
    });

};
var arrowButtonF = function (){
    let button = document.querySelectorAll(".toolArrow__icon");
    let n = 0;
    button.forEach((item)=>{
        item.setAttribute("number", String(n));
        item.addEventListener("click", (event)=>{
            if(item.getAttribute("number") == "0"){
                documentBody("justifyLeft", false, 7);
            }
            else if(item.getAttribute("number") == "1"){
                documentBody("justifyRight", false, 0);
            }
            else if(item.getAttribute("number") == "2"){
                documentBody("justifyCenter", false, 0);
            }
            else if(item.getAttribute("number") == "3"){
                documentBody("justifyFull", false, 0);
            }
        });
        n ++;
    });

};
class editor{
    constructor(ele){
        this.ele = ele;
        this.selectIteam = window.getSelection();
        this.recentSave = "";
    }
    saveRecentOne(){
        this.recentSave = this.ele.innerHTML;
    }
    revertBackToRecent(){
        this.ele.innerHTML = this.recentSave;
    }

    classAndSpanAdder(cls){
        let identifier = "idetifier-x-2";
        let doc = document.getSelection(); 
        let range = doc.getRangeAt(0);
        let offset = range.endOffset;
        let newNode = document.createElement("span");
        newNode.classList.add(identifier);
        newNode.appendChild(document.createTextNode(doc.toString()));   
        range.insertNode(newNode);
        let indentifierDoc = document.querySelector(`.${identifier}`);
        range.setStartAfter(indentifierDoc);
        range.deleteContents();
        indentifierDoc.classList.add(cls);
        indentifierDoc.classList.remove(identifier);
        this.saveRecentOne();
    }


}

// image functions
var ImageValue;
var   addImage = function() {
   
    // let imgInput = document.querySelector('.editorImage__input');
    // imgInput.addEventListener("change", (ele)=>{
    //     iMAGE_SCR = ele.target.value;


    // });
    document.querySelector(".editorImage__button").addEventListener("click", (ele)=>{
        documentBody('insertImage', false, iMAGE_SCR);
        document.querySelector('img').style.cssText = 'max-width: 90%';

    });
    
};
class toolbar{

    constructor(animationEleList, animationEle, oneElement, editorToolbarC, consEditorInput){
        this.animationEleList = animationEleList;
        this.animationEle = animationEle;
        this.oneElement = oneElement;
        this.editorToolbar = editorToolbarC;
        this.editorInput = consEditorInput;
      
    }
    reloadInnerText(){
        this.oneElement.innerHTML = text(cUSTOMcOLORaDDON.document);
        
    };
    textConstrutor(){
        let textColorDisplay = document.querySelector(".text__color--display");
        let textSelectorBox = document.querySelector(".text__selectorBox");
        let textColorsLabel = document.querySelector(".text__colors--input-label");
        let colorsButtonEle = document.querySelectorAll(".text__colors");
        let colorsDisplayEle = document.querySelector(".text__color--rgbd");
        let rgbInputEle = document.querySelector(".text__colors--input");
        let textColorCol = document.querySelector(".text__color--col");
        let c = new colorsButtons(colorsButtonEle, colorsDisplayEle, rgbInputEle, textColorCol, this.oneElement.innerHTML);
        c.autoListernerAdder();
        textColorDisplay.addEventListener("click", (ev)=>{
            if(textColorDisplay.id == "addRadiusBorder"){
                textSelectorBox.id = "";
                textColorDisplay.id = "";
                textColorsLabel.style.cssText = "display: none;";  
            }
            else{
                textSelectorBox.id = "expandTopToBottom";
                textColorDisplay.id = "addRadiusBorder";
                textColorsLabel.style.cssText = "display: none;";
                textColorsLabel.style.cssText = "";
            }
        });
    }

    
    addanimation(eleNo){
        let c = this.animationEleList.item(eleNo);
        c.id = "toolbtn-animation";
        this.animationEle.id = "toolbar-animation";
        this.oneElement.id = "displayBlock";

    }
    removeAnimation(){
        this.animationEleList.forEach((r)=>{
            r.id = "";
        });
        this.animationEle.id = "";
        this.oneElement.id = "";

    }
    removeCheckbox(){
        this.animationEleList.forEach((event)=>{
            event.setAttribute("checked", "");
        });
    }
    checker(eleNo) {
        this.animationEleList.forEach((r)=>{
            r.setAttribute("checked", "");
        });
        this.removeAnimation();
        this.animationEleList.item(eleNo).setAttribute("checked", "checked");
        this.addanimation(eleNo);
        
    }
    autoCheck(){
        let n = 0;
        this.animationEleList.forEach((e)=>{
            e.setAttribute("number", String(n));
            e.addEventListener("click", (event)=>{
                if(e.getAttribute("checked") == "checked"){
                    this.removeAnimation();
                    e.setAttribute("checked", "");
                }
                else{
                    e.setAttribute("checked", "checked");
                    this.checker(e.getAttribute("number"));
                    if(e.getAttribute("number") == "0"){
                        this.oneElement.innerHTML = arrow;
                        arrowButtonF();

                    }
                    else if(e.getAttribute("number")  == "1") {
                        this.oneElement.innerHTML = image;
                        addImage();
                        
                        
                    } 
                    else if(e.getAttribute("number")  == "2"){
                        this.reloadInnerText();
                        this.textConstrutor();
                        textSizeButtonF();
                        
                    }
                    
                }
            });
            n ++;
        });

    }


}

class colorsButtons{
    constructor(colorsDocs, displayBlock, rgbInput, textColorColI, constOneElementInnerHTML){
        this.colorsDocs = colorsDocs;
        this.displayBlock = displayBlock;
        this.rgbInput = rgbInput;
        this.textColorColI = textColorColI;
        this. constOneElementInnerHTML =  constOneElementInnerHTML;
       
    }
    styleExtrater(ele){
        // let startLength = ele.style.cssText.search(new RegExp(":", "g"));
        // let endlength = ele.style.cssText.search(new RegExp(";", "g"));
        // return ele.style.cssText.substring(startLength + 1, endlength);
        return ele.getAttribute("value");
    }
    buttonGenerator(){
        console.log("works")
        this.colorsDocs.forEach((e)=>{
            e.addEventListener("click", (event)=>{
                let colorValue = this.styleExtrater(e);
                this.displayBlock.textContent = colorValue;
                this.textColorColI.style.cssText = `background-color: ${colorValue};`;
                documentBody("foreColor", false, colorValue);
 
            });

        });
    }
    autoListernerAdder(){
        this.buttonGenerator();
        
        this.rgbInput.addEventListener("change", (a)=>{
            let colorValue = this.rgbInput.value;
            cUSTOMcOLORaDDON.addDocument(colorValue, document.querySelector(".text__colors--box"));
            document.querySelectorAll(`.text__colors-addOn`).forEach((e)=>{
                e.addEventListener("click", ()=>{
                    let colorValue = this.styleExtrater(e);
                    this.displayBlock.textContent = colorValue;
                    this.textColorColI.style.cssText = `background-color: ${colorValue};`;
                    documentBody("foreColor", false, colorValue);
                })
            });
        });

    }
    
}


// variable
let arrow = `
<div class="toolLayout__cell toolArrow">
<span>arrange & flip</span>
<div class="toolArrow__arrange">
    <button class="toolArrow__iconBtn"  type="button">
        <span class="toolArrow__icon toolArrow__icon-left"></span>
    </button>
    <button class="toolArrow__iconBtn"  type="button">
        <span class="toolArrow__icon toolArrow__icon-right"></span>
    </button>
    <button class="toolArrow__iconBtn"  type="button">
        <span class="toolArrow__icon toolArrow__icon-center"></span>
    </button>
    <button class="toolArrow__iconBtn"  type="button">
        <span class="toolArrow__icon toolArrow__icon-justified"></span>
    </button>
</div>
</div>`;
let text = function(txt){
    return `
<!-- This is where tool is -->
<div class="toolLayout__cell text">
    <span class="text__title">Size of your Text</span><br />
    <button class="text__fontSize text__fontSize-l" number=""  type="button">large text</button><br />
    <button class="text__fontSize text__fontSize-m" number=""  type="button">medium text</button><br />
    <button class="text__fontSize text__fontSize-s" number=""  type="button">small text</button><br />
</div>
<div class="toolLayout__cell text__color">
    
    <div class="text__color--box">
    <input id="hiddenInput" value="">
        <span>color</span><br>
        <button class="text__color--display"  type="button">
            <span class="text__color--col"></span><span class="text__color--rgbd">#000000</span>
        </button>
        <div class="text__selectorBox">
            <div class="text__colors--box">
                 <button class="text__colors text__colors-green" type="button" style="background-color: #15E67F;" value="#15E67F"></button>
                 <button class="text__colors text__colors-green"  type="button" style="background-color: #E3DE8C;" value="#E3DE8C"></button>
                 <button class="text__colors text__colors-green"  type="button" style="background-color: #D8A076;" value="#D8A076"></button>
                 <button class="text__colors text__colors-green"  type="button" style="background-color: #D83762;" value="#D83762"></button>
                 <button class="text__colors text__colors-green"  type="button" style="background-color: #76B6D8;" value="#76B6D8"></button>
                 <button class="text__colors text__colors-green"  type="button" style="background-color: #1C7A90;" value="#1C7A90"></button>
                 <button class="text__colors text__colors-green"  type="button" style="background-color: #249CB8;" value="#249CB8"></button>
                 <button class="text__colors text__colors-green"  type="button" style="background-color: #4ABED9;" value="#4ABED9"></button>
                 <button class="text__colors text__colors-green"  type="button" style="background-color: #FBD75B;" value="#FBD75B"></button>
                 <button class="text__colors text__colors-green"  type="button" style="background-color: #FBE571;" value="#FBE571"></button>
                 ${txt}
            </div>
            <div class=text__colors--input-holder>
                <label class="text__colors--input-label" for="IdText__colors--input" style="display: none;" type="color">RGBD</label>
                <input class="text__colors--input" id="IdText__colors--input">
            </div>
            

        </div>

    </div>

 </div>
 <!-- <div class="toolLayout__cell text__bold">
     <span>Bold</span>
     <div class="dragButton">
         
     </div>


 </div> -->`;
}

 let image = ` 
 <div class="toolLayout__cell editorImage">
 <span class="editorImage__title">Choose a profile picture</span>
 <div class="editorImage__container">
      <label for="avatar" class="editorImage__label"><span class="editorImage__button--span "></span></label>
  <input class="editorImage__input" type="file" name="image" id="avatar" onchange="saveImage()" accept="image/png, image/jpeg">
  <button class="editorImage__button" type="button"><span class="editorImage__span"></span></button>
 </div>
</div>`;
// Query Selector
editorToolBtn = document.querySelectorAll(".editor__toolbtn");
editorToolBackground = document.querySelector(".editor__toolBackground");
editorTool = document.querySelector(".editor__tool");
editorToolbar = document.querySelector(".editor__toolbar");
editorInput = document.querySelector(".editor__body");
button = document.querySelectorAll(".editor__button");
popUp = document.querySelector(".editor__headingPopup");


// program
var IsParent;
isParent = function(child, find_parent) {
    let is_parent = false;
    let lastParent = child;
    let body = document.querySelector("body");
    while (!is_parent) {
        lastParent = lastParent.parentNode
        if (lastParent == find_parent) {
            is_parent = true;
            return true
        }
        else if(lastParent == body){
            is_parent = true
            return false
        }
    }
    
}
function modelClose() {
    window.addEventListener("mouseup", (event)=>{
        box = document.querySelector(".editor__tool")
        if(event.target != box && (!isParent(event.target.parentNode, box))){
            toobar.removeAnimation();
            toobar.removeCheckbox();
        }
    })
    
}
// d = new editor(editorInput);
let toobar = new toolbar(editorToolBtn, editorToolBackground, editorTool, editorToolbar, editorInput);
toobar.autoCheck();
function publishFun() {
    let popUpCliper = new cliper(popUp, "display: inline-block;");
    popUpCliper.effect(`polygon(0 ${popUpCliper.valueFrom(100, "height", "start")}, 100% 0, 100% ${popUpCliper.valueFrom(100, "height", "end")}, 0% 100%)`);
}
function publishCloseFun() {
    popUp.style.cssText = ""
}

function saveImage()
{
  let img_element = document.querySelector('.editorImage__input')
  let postUrl = 'latest-save/'
  let fieldName = img_element.name;
  let filePath = img_element.value;
  let main_data = document.querySelector('.document__body')
  try{
    var formData = new FormData();
    if (!(filePath.length == 0)) {
        formData.append(fieldName, new File(img_element.files, img_element.files[0].name));
        formData.append('image', fieldName)
        
    }
    formData.append('main_data', [main_data.innerHTML])
  
    var req = new XMLHttpRequest(); 
    req.open("POST", postUrl);
    req.setRequestHeader('X-CSRFToken', csrfToken)
    req.setRequestHeader('enctype', "multipart/form-data")
    req .withCredentials = true;
    req.onload = function(event) { 
        let data = JSON.parse(event.target.responseText);
        iMAGE_SCR = document.querySelector('body').getAttribute('data-media-url')+ data.image
     };
    req.send(formData);
  }finally{

  }
}
function formSubmin() {
    document.querySelectorAll('.editor__body--pseudoInput')[0].value = document.querySelector(".document__body").textContent
    document.querySelectorAll('.editor__body--pseudoInput')[1].value = document.querySelector(".document__body").innerHTML
    document.editorForm.submit()
}
function save_and_back() {
    let sufix = null;
    try{
        saveImage()
    }
    finally{
        try{
            sufix = urlValue.next;
        }
        finally{
            if (sufix == null){
                sufix = '/'
            }
            window.location.href = `${sufix}`
        }
    }
    
}
modelClose()