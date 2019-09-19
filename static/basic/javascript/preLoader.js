class Discuss extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({mode: 'open', delegatesFocus: true});
      this._line = '';
      this._targetType = '';
      this._targetId = '';
      this._tag = '';
      this._active = false;

    }
    get line(){
        return this._line;
    }
    set line(val){
        this.setAttribute('line', val);
    }
    get targetType(){
        return this._targetType;
    }
    set targetType(val){
        this.setAttribute('targetType', val)
    }
    get targetId(){
        return this._targetId;
   
    }
    set targetId(val){
        this.setAttribute('targetId', val);
    }
    get tag(){
        return this._tag;
        
    }
    set tag(val){
        this.setAttribute('tag', val);
    }
    get active(){
        return this._active;
    }
    set active(val){
        this.setAttribute('active', val);
    }
    static get observedAttributes(){
        return ['line', 'targetType', 'targetId', 'active', 'tag'];
    }
    listToString(obj){
        var customStr = '';
        obj.forEach((eve)=>{
            customStr = customStr + String(eve) + ' ';
        });
        return customStr;

    }

    runDiscordEditor(){
        let editor = document.querySelector('.mainDiscussion__editor--wrapper');
        editor.style.cssText = 'display: block;';
        window.scrollTo({
            top: (editor.offsetTop + (editor.offsetHeight)/4),
            left: 0,
            behavior: 'smooth'
          });
        document.querySelector('#editor-tag').textContent = this.listToString(this._tag);
        let editorHeading = document.querySelector('#editor-Heading');
        if(this._line.length < 40){
            editorHeading.textContent = this._line;

        }
        else{
            editorHeading.textContent = this._line.substring(0, 40) + '...';
        }

        

    }

    attributeChangedCallback(name, oldVal, newVal){
        let innerSpan = this.shadow.querySelector('.specId');
        switch(name){    
            case 'line': 
            this._line = newVal;
           
            innerSpan.innerHTML = this.line;
            console.log(this.line);
            break;
            case 'targetType': 
            this._targetType = newVal;
       
            break;
            case 'targetId':
                this._targetId = newVal;
            break;
            case 'tag':
                    this._tag =  newVal.split(",");
                    this._tag.pop();
                break;
            case 'active':
                this._active = newVal;
                if (this._active == 'true'){
                    this.runDiscordEditor();
                }

            
        }
        
    }
    connectedCallback(){
        var text = document.createElement('span');
            text.classList.add('specId');
            let template = `
            <div id='specId'>${this._line}</div>
            `;
            this.shadow.appendChild(text);
        
    }

}
window.customElements.define('discuss-tag', Discuss);

var timeOut = function (func, time) {
    let tym = 0;
    setInterval(()=>{
        tym ++;
    if(tym == time){
        func;
    }
    }, 1000);
    
};
function getUrlValue() {
    let url = window.location.href;
    if (url.includes('?') && url.includes('#')) {
        let pattern1 = new RegExp(/\?/,'g')
        let pattern2 = new RegExp("#", 'g')
        let query = url.substring(url.search(pattern1) + 1, url.search(pattern2));
        if (query.includes('&')){
            query = query.split('&');
        }
        else{
            query = [query];
        }
        let obj = {};
        query.forEach((e)=>{
            let a = e.split('=');
            obj[a[0]] = a[1];
        });
        return obj;
        
    }
    else{
        return null;
}
}
var urlValue;
urlValue = getUrlValue();