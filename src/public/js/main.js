const socket = io()

document.getElementById("attachment").addEventListener('click', function() {
    document.getElementById("file-input").click();
});

/*document.getElementById("file-input").addEventListener('change', function() {
    let pos = this.files.length - 1;
    document.getElementById("add_labels").innerHTML += `<div class="labels"  src="">${this.files[pos].name}</div>`;
});*/

function el(el) {
    return document.getElementById(el);
}
    el("txt_publicate").addEventListener('focus',function() {
        if (!this.value.length) { //Si la longitud de la cadena de caracteres es 0 => falsa
            el("publicate").disabled = true; //Deshabilitamos el botón
        } else { //Si no...
            el("publicate").disabled = false; //Lo habilitamos
        }
    });
    el("txt_publicate").addEventListener('focus',function() {
        if (!this.value.length) { //Si la longitud de la cadena de caracteres es 0 => falsa
            el("publicate").disabled = true; //Deshabilitamos el botón
        } else { //Si no...
            el("publicate").disabled = false; //Lo habilitamos
        }
    });

    let enlaces = document.querySelector('.Menu');
let menuHamburguesa = document.querySelector('.menu-hamburguesa');

let body =   document.getElementById('body');

menuHamburguesa.addEventListener('click', function(){
    enlaces.classList.toggle('Menu1');
});
io();

$(function () {
    $('#like').click(function (e) {
      


    });
});




    








  
   