import Cropper from './cropper.esm.js';
import Modal from './modal.js';

export default class CropImage{
    constructor()
    {
        this._image = document.getElementById('image-cropper');
        this._contentModal = document.getElementById('modal');
        this._modal = new Modal(this._contentModal);
        this._crop = document.querySelector('.btn-cropper');
        this._cancelCrop = document.querySelector('.cancelarModal');
        this._closeCrop = document.querySelector('.closeModal');
        this._ratio = 1.4;
        this._details = [];
    }

    initCropperFile(input)
    {
        this._input = input;
        return new Promise(async (resolve, reject) => {
            this._startChange(this._input);
            this._input.click();

            this._functionCrop = () => {
                this._crop.dispatchEvent(new CustomEvent('cropping'));
                resolve(this._details);
            };

           this._crop.addEventListener('click',this._functionCrop,false);

           this._cancelCrop.addEventListener('click',async function(){
                await this._cancelCrop.dispatchEvent(new CustomEvent('cancel'));
                resolve(false);
           }.bind(this));

            this._closeCrop.addEventListener('click',()=> {
                this._cancelCrop.click();
            });
            if(this._checkCancel()) reject(false);
        });
    }

    _checkCancel(){
       document.body.onfocus = () => {
           if(!this._input.value.length){
               this._remove();
               this._removeEvents();
               return true;
           }
           document.body.onfocus = null;
           return false;
       }
    }

    _startChange()
    {
        this._functionChange = (e) => {
            this._ratio = e.target.getAttribute('data-ratio');
            let files = e.target.files;

            if(files[0].size >= 10000099) {
                return false;
            }
            let done = async function (url){
                this._image.src = url;
                await this._actionModal('show');
            }.bind(this);

            let reader;
            let file;

            if (files && files.length > 0) {
                file = files[0];
                if (URL) {
                    done(URL.createObjectURL(file));
                } else if (FileReader) {
                    reader = new FileReader();
                    reader.onload = function (e) {
                        done(reader.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }

        this._input.addEventListener('change',this._functionChange,false);
        this._creatEventForShowHide();
    }

    _creatEventForShowHide()
    {
        this._functionRenderGridCrop = ()=>{
            this.cropper = new Cropper(this._image, {
                aspectRatio: this._ratio,
                viewMode: 2,
                minCropBoxWidth: 400,
                autoCropArea: 1,
                crop: (e) => {
                    this._details['coodenadas'] = e['detail'].x+':'+e['detail'].y+':'+e['detail'].width+':'+e['detail'].height;
                }
            });
        }

        this._functionDestroy = () =>{
            this.cropper.destroy();
            setTimeout(()=> delete this.cropper, 200);
        }

        this._contentModal.addEventListener('showModalCropper',this._functionRenderGridCrop,false);
        this._contentModal.addEventListener('destroyCropper',this._functionDestroy,false);
    }


    _creatEventForCrop()
    {
        this._functionExecCrop = () => {
            let initialAvatarURL;
            let canvas;
            if(this.cropper){
                canvas = this.cropper.getCroppedCanvas({
//          	width: 160,
//            	height: 160,
                });
                //url Base64
                initialAvatarURL = canvas.toDataURL();
                this._details['preview'] = initialAvatarURL;
            }
            this._actionModal('hide');
        }
        this._functionCancelCrop = () => {
            this._actionModal('hide');
            return this._remove();
        }

        this._crop.addEventListener('cropping',this._functionExecCrop,false);
        this._cancelCrop.addEventListener('cancel', this._functionCancelCrop,false);
    }

    _actionModal(op)
    {
        switch (op) {
            case 'show':
                this._modal.show();
                this._contentModal.dispatchEvent(new CustomEvent('showModalCropper'));
                this._creatEventForCrop();
                break;
            case 'hide':
                this._modal.close();
                this._contentModal.dispatchEvent(new CustomEvent('destroyCropper'));
                setTimeout(this._removeEvents.bind(this),200);
                break;
        }
    }

    _removeEvents()
    {
        this._crop.removeEventListener('click',this._functionCrop,false);
        this._crop.removeEventListener('cropping',this._functionExecCrop,false);
        this._cancelCrop.removeEventListener('cancel', this._functionCancelCrop,false);
        this._input.removeEventListener('change',this._functionChange,false);
        this._contentModal.removeEventListener('showModalCropper',this._functionRenderGridCrop,false);
        this._contentModal.removeEventListener('destroyCropper',this._functionDestroy,false);
    }

    _remove()
    {
        this._input.remove();
        this._details = [];
        return false;
    }
}