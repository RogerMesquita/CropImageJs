export default class Modal{
    constructor($element) {
        this._modal = $element;
        if(this._modal === null){
            throw "Element Modal Invalid";
        }
        this._closeBtn = $element.querySelector('.close');
        this.init();
    }

    init(){
        if(this._closeBtn != null){
            this._closeBtn.addEventListener('click',() => this.close());
        }
        return
    }

    show(){
        this._showModal();
    }
    close(){
        this._closeModal();
    }

    _createBg(){
        this.bg = document.createElement("div");
        this.bg.classList.add('modal-backdrop', 'fade');
        document.body.appendChild(this.bg);
        setTimeout(()=>this.bg.classList.add('show'));
    }
     _removeBg(){
        this.bg.classList.remove('show');
        setTimeout(()=>this.bg.remove(),300);
    }

    _closeModal(){
        this._modal.classList.remove('show')
        setTimeout(()=>this._modal.style.display = 'none');
        this._removeBg();
    }

    _showModal(){
        this._modal.style.display = 'block';
        setTimeout(() =>this._modal.classList.add('show'),300);
        this._createBg();
    }
}