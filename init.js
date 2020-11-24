import CropImage from './js/cropImage.js';

let buttonAdd = document.querySelector('.addImagem');
let today=new Date();
buttonAdd.addEventListener('click',async function (){
    let file = document.createElement('input');
    file.type = 'file';
    file.name = 'fotos[]';
    file.id = 'input-image-'+today.getHours()+today.getMinutes()+today.getSeconds();
    file.accept = 'image/png, image/jpeg';
    file.setAttribute('data-coordenadas','0');
    file.setAttribute('data-confirm','false');
    file.setAttribute('data-ratio',1.7);
    let thumb = document.createElement('img');
    thumb.classList.add('rounded');
    thumb.id = 'thumb-'+today.getHours()+today.getMinutes()+today.getSeconds();
    thumb.src = '';
    window.document.body.append(file);
    window.document.body.append(thumb);


    let $cropper = new CropImage();
    await $cropper.initCropperFile(file).then((result)=>{
        if(result){
            console.log(result.coodenadas);
            thumb.src = result.preview;
            return;
        }
        file.remove();
    });
});










