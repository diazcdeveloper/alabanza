

const btnHide = document.getElementById("show");
const btnShow = document.getElementById("hide");
const btnSeguroborrar = document.getElementById("btn_seguroborrar");

const formContenedor = document.getElementById("formulario");


btnShow.onclick = function(){
    formContenedor.classList.remove("hide");
    btnShow.classList.add("hide");
    btnHide.classList.remove("hide");
};

btnHide.onclick = function(){
    formContenedor.classList.add("hide");
    btnShow.classList.remove("hide");
    btnHide.classList.add("hide");
};
