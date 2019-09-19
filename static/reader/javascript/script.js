// Varible
let articleWrapper = document.querySelector(".displayPage__wrapper");
let a = document.querySelector(".displayPage__article");
var article_id = document.querySelector('.displayPage__article').getAttribute('primaryid');
var discordLength;

// functions


class editor{
    constructor(){
        this.doc = '';
        this.range = '';
        this.indentifierDoc = '';
        this.line = '';
        this.tagCreate = false;
    }
    updateDoc(){
        this.doc =  window.getSelection();
        this.doc.modify('extend', 'forward', 'sentence');

   }
    updateindetifierDoc(){
        this.indentifierDoc = document.querySelector('discuss-tag');
    }
    
   
    classAndTagIdAdder(){
        this.updateDoc();
        let range = this.doc.getRangeAt(0);
        let newNode = document.createElement("discuss-tag");
        newNode.appendChild(document.createTextNode(this.doc.toString()));   
        range.insertNode(newNode);
        this.updateindetifierDoc();
        range.setStartAfter(this.indentifierDoc);
        range.deleteContents();
        this.indentifierDoc.line = this.indentifierDoc.textContent;
        this.line = this.indentifierDoc.line;
        this.indentifierDoc.textContent = '';
        this.targetType = this.indentifierDoc.parentElement.getAttribute('primaryType');
        this.targetId = this.indentifierDoc.parentElement.getAttribute('primaryId');
        this.indentifierDoc.tag = this.indentifierDoc.parentElement.getAttribute('tag');
        this.tag = this.indentifierDoc.tag;
        this.indentifierDoc.targetId = this.targetId;
        this.indentifierDoc.targetType = this.targetType;
        this.tagCreate = true;
        if (this.targetType == 'article' || this.targetType == 'discord') {
            this.indentifierDoc.active = 'true';
            this.removeClassAndTagIdAdder();
            discussCliper.effect(`polygon(0 ${discussCliper.valueFrom(100, "height", "start")}, 100% 0, 100% ${discussCliper.valueFrom(150, "height", "end")}, 0% 100%)`);
        }
        else{
            this.removeClassAndTagIdAdder();
            alert('Please Select Line From Article Or Discord, To Start A Discussion');
        }
    }
   
    sentRequest(){
        
       
        
        if(this.targetType == 'discord'){
            this.title = document.querySelector(".mainDiscussion__editor--mainHeading").textContent;
        let obj ={
            "title": this.title,
            "line": this.line,
            "main_data": document.querySelector("#editor-content").value,
            search_tag:  this.tag

        };
            obj.nested_discord =  this.targetId;
            obj.related_article = 'None';
            console.log(obj);
            const headers = new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            });
            fetch(`/api/discord/`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(obj),
                    "credentials": 'include',
                }).catch( err => {
                    err.text().then((errorMessage)=>{
                      this.props.dispatch(displayTheError(errorMessage));
                    });
                  }).then(()=>{
                    window.location.href = `http://127.0.0.1:8000/discord/${this.targetId}/`;

                  });

            

        }
        else if(this.targetType == 'article'){
             this.title = document.querySelector(".mainDiscussion__editor--mainHeading").textContent;
             let obj ={
                "title": this.title,
                "line": this.line,
                "main_data": document.querySelector("#editor-content").value,
                search_tag:  this.tag,
               related_article: this.targetId,
               nested_discord: '10'
    
            };
            
            const headers = new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            });
            fetch(`/api/discord/`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(obj),
                    "credentials": 'include',
                }).catch( err => {
                    err.text().then((errorMessage)=>{
                      this.props.dispatch(displayTheError(errorMessage));
                    })
                }).then(()=>{
                    window.location.reload();
                    
                })
                
        }
    }
    removeClassAndTagIdAdder(){
        if (this.tagCreate){
            let newRange = document.createRange();
            newRange.selectNode(document.getElementsByTagName("discuss-tag").item(0));
            newRange.deleteContents();
            newRange.insertNode(document.createTextNode(this.line));
            this.tagCreate = false;
        }
        else{ 
            console.log("Select line first.");
        }
    }
}

class DiscordAdder{
    constructor(data){
        this.counter = 0;
        this.data = data;
        this.element = document.querySelector('.mainDiscussion__display');
    }
    objectToString(obj){
        var customStr = '';
        obj.forEach((eve)=>{
            customStr = customStr + String(eve) + ',  ';
        });
        return customStr;

    }
    docCreator(){
        let divMain = document.createElement('div');
        divMain.classList.add('discuss__nesting');
        divMain.classList.add('mainDiscussion__nesting');

            // Inside mainDiv
            let div = document.createElement('div');
            //new
                let span = document.createElement('span');
                span.classList.add('discuss__icon');
                span.classList.add('mainDiscussion__icon');
                div.appendChild(span);
                // new
                let space = document.createTextNode('\u00A0');
                div.appendChild(space);
                //new
                span = document.createElement('span');
                span.classList.add('mainDiscussion__mainHeading');
                span.id='editor-tag';
                span.innerText = this.headingText;
                div.appendChild(span);
                //new
                space = document.createTextNode( '\u00A0');
                div.appendChild(space);
                //new
                span = document.createElement('span');
                span.classList.add('discuss__icon');
                span.classList.add('mainDiscussion__icon');
                div.appendChild(span);
                //new
                let br = document.createElement('br');
                div.appendChild(br);


                //new
                let a = document.createElement('a');
                a.classList.add('mainDiscussion__subHeadingLink');
                a.href = `/discord/${this.discord_id}/`;
                    //new
                    span = document.createElement('span');
                    span.classList.add('discuss__intro');
                    span.classList.add('mainDiscussion__subHeading');
                    span.textContent = this.lineText;
                    a.appendChild(span);
                div.appendChild(a);
                br = document.createElement('br');
                div.appendChild(br);


                //new
                let divSub = document.createElement('div');
                divSub.classList.add('mainDiscussion__content');
                divSub.setAttribute('primaryType', 'discord');
                divSub.setAttribute('primaryId', this.discord_id);
                divSub.setAttribute('tag', this.objectToString(this.tags));
                divSub.textContent = this.discord;
                div.appendChild(divSub);
            divMain.appendChild(div);

            //new
            div = document.createElement('div');
            div.classList.add('mainDiscussion__author');
            div.textContent = `by: ${this.author.first_name} ${this.author.last_name}`;
            divMain.appendChild(div);
        this.element.appendChild(divMain);
    }
    
    addOn(number){
        if(this.counter < this.data.length){
            var step;
            for (let step = 0; step < number; step++) {
                if(this.counter < this.data.length){
                    const data = this.data[this.counter];
                    this.counter++;
                    this.discord_id = data.discord_id;
                    this.headingText = data.title;
                    this.lineText = data.line;
                    this.discord = data.main_data;
                    this.author = data.author;
                    this.tags = data.search_tag;
                    String(this.tags);
                    this.docCreator();
                    discussCliper.effect(`polygon(0 ${discussCliper.valueFrom(100, "height", "start")}, 100% 0, 100% ${discussCliper.valueFrom(150, "height", "end")}, 0% 100%)`);
                    if(this.counter == this.data.length){
                        document.querySelector('#moreDiscord').style.cssText = 'display: none; opacity: 0';
                    }
                }
                


          
            }
        }
        displayPageEqualHeight();
    }

}
let displayPageEqualHeight =function (){
    let displayPageBody = document.querySelector(".displayPage__body");
    let displayPageContainer = document.querySelector(".displayPage__container");
    let height = displayPageBody.offsetHeight + displayPageBody.offsetTop + 80;
    displayPageContainer.style.cssText = `height: ${height}px`;
};
let editorTagCreatorclass = new editor();
function scrollToTop(){
    window.scrollTo(0, 0);
}
function createDiscussTag(){
    if(is_user_authenticated == 'True'){
        editorTagCreatorclass.removeClassAndTagIdAdder();
        editorTagCreatorclass.classAndTagIdAdder();
        displayPageEqualHeight();
    }
    else{
        document.location.href = login_redirect;
    }

}
function createDiscord(){
    if(is_user_authenticated){
        editorTagCreatorclass.sentRequest();
        editorTagCreatorclass.removeClassAndTagIdAdder();
        displayPageEqualHeight();
    }
    else{
        document.location.href = login_redirect;
    }

}
// single function
var interval;
var ticking = false;
function waiting(){
    interval = window.setTimeout(this.fun, 2 * 1000);
}
function fun(){
    ticking = false;
    window.clearTimeout(interval);
}
window.addEventListener('scroll',(e)=>{
    if (!ticking) {
        ticking = true;
        if (document.body.scrollTop < 2000){
            document.querySelector(".displayPage__buttonBlock").style.cssText = 'display: block;';
        }
        this.waiting();
    }
});
// single function end

fetch(`/api/discord/?related_article=${article_id}&format=json`
).then((unJsonData)=>{
    unJsonData.json().then((data)=>{
        var discordClass = new DiscordAdder(data);
        discordClass.addOn(2);
        document.querySelector('#moreDiscord').addEventListener("click", ()=>{
            discordClass.addOn(5);


        });
    });
}).catch((error)=>{
    console.log(error);
});

// Program

let articleCliper = new cliper(articleWrapper);
articleCliper.effect(`polygon(0 ${articleCliper.valueFrom(100, "height", "start")}, 100% 0, 100% ${articleCliper.valueFrom(150, "height", "end")}, 0% 100%)`);

var discussCliper = new cliper(document.querySelector(".mainDiscussion"));
discussCliper.effect(`polygon(0 ${discussCliper.valueFrom(100, "height", "start")}, 100% 0, 100% ${discussCliper.valueFrom(150, "height", "end")}, 0% 100%)`);

window.addEventListener('resize', ()=>{displayPageEqualHeight();});

displayPageEqualHeight();


