// Global Variables


// New Class
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
            displayPageEqualHeight();       

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
            const headers = new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            });
            fetch(`http://127.0.0.1:8000/api/discord/`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(obj),
                    "credentials": 'include',
                }).catch( err => {
                    err.text().then((errorMessage)=>{
                      this.props.dispatch(displayTheError(errorMessage));
                    });
                  }).then(()=>{
                    window.location.reload();

                  });

            

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

var editorTagCreatorclass = new editor();

let displayPageEqualHeight = function (){
    let displayPageBody = document.querySelector(".nestedDiscussion__body");
    let displayPageContainer = document.querySelector(".nestedDiscussion");
    let height = displayPageBody.offsetHeight + displayPageBody.offsetTop + 80;
    displayPageContainer.style.cssText = `height: ${height}px`;
};

function createDiscussTag(){
    if(is_user_authenticated){
        editorTagCreatorclass.removeClassAndTagIdAdder();
        editorTagCreatorclass.classAndTagIdAdder();
        displayPageEqualHeight();
    }
    else{
        document.location.href = login_redirect;
    }

}
function createDiscord(){
    if(is_user_authenticated == 'True'){
        editorTagCreatorclass.sentRequest();
        editorTagCreatorclass.removeClassAndTagIdAdder();
        displayPageEqualHeight();
    }
    else{
        document.location.href = login_redirect;
    }

}
let mainDiscussCliper = new cliper(document.querySelector(".nestedDiscussion__collective"));
mainDiscussCliper.effect(`polygon(0 ${mainDiscussCliper.valueFrom(50, "height", "start")}, 100% 0, 100% ${mainDiscussCliper.valueFrom(50, "height", "end")}, 0% 100%)`);


displayPageEqualHeight();