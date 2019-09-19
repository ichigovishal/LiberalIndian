class cliper{
    constructor(element, additionStyle=""){
        this.element = element;
        this.additionStyle = additionStyle;
        this.value = 0;
    }
    forMobileCheck(value){
        if(window.innerWidth < 415){
            return window.innerHeight * (10 / 100);
        }
        else{
            return value;
        }

    }
    func(type, val){
        let value = this.forMobileCheck(val);
        if(type == "height"){
            this.value = value;
            return (value / this.element.offsetHeight) * 100;
        }
        else if(type == "width"){
            return (value / this.element.offsetWidth) * 100;

        }
    }
    valueFrom(value, type, direction){  
        if(direction == "start"){
            return `${this.func(type, value)}%`;
        }
        else if(direction == "end"){
            return `${100 - this.func(type, value)}%`;
        }
    }

    effect(clipValue){
        this.element.style.cssText = `clip-path: ${clipValue}; padding-top: ${this.value + 100}px; padding-bottom: ${this.value + 100}px; ${this.additionStyle}`;
    }
}