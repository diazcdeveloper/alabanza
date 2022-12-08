const db = firebase.firestore();

const form = document.getElementById('formulario');
const cancionesContent = document.getElementById('canciones');
const cancionContent = document.querySelectorAll('.cancion_content');
const cancionTarjeta = document.querySelector(".cancion")


let editStatus = false;
let id = "";

// METODO PARA AGRAGAR DATOS A LA BASE DE DATOS
const saveCancion = (titulo, tono, letra) =>
    db.collection('canciones').doc().set({
        titulo,
        tono,
        letra
    })

// METODO PARA MOSTRAR TODAS LAS CANCIONES QUE ESTAN EN LA BASE DE DATOS
const getCanciones = () => db.collection('canciones').get();

const getCancion = (id) => db.collection('canciones').doc(id).get();

// METODO QUE MUESTRA LAS CANCIONES PERO A CADA INSTANTE
const onGetCancion = (callback) => db.collection('canciones').onSnapshot(callback);

const deleteCancion = id => db.collection('canciones').doc(id).delete();

const updateCancion = (id, updatedTask) => db.collection('canciones').doc(id).update(updatedTask);



window.addEventListener('DOMContentLoaded', async (e) => {
    onGetCancion((querySnapshot) => {
        cancionesContent.innerHTML = '';
        querySnapshot.forEach((doc) => {

            const cancion = doc.data();
            cancion.id = doc.id;



            // enlaceModal.innerHTML += 
            // `
            // <button class="btn_modal"  data-id="${cancion.id}">
            // ${cancion.titulo}
            // </button>
            // `

            cancionesContent.innerHTML += "";

            cancionesContent.innerHTML +=
                `

                <div class="cancion_mostrar" id="cancion_mostrar">
                    <button class="btn_mostrar"  data-id="${cancion.id}">
                    ${cancion.titulo}
                    </button>
                    <div class="btn_modal">
                        <button class="btn_borrar btn" data-id="${cancion.id}">Borrar</button>
                        <button class="btn_editar btn" data-id="${cancion.id}">Editar</button>
                    </div>
                </div>
                `

                // <h2 class="titulo">${cancion.titulo}</h2>
                // <p class="tono">${cancion.tono}</p>
                // <p class="letra">${cancion.letra}</p>
                // <div class="btn_modal">
                //     <button class="btn_borrar btn" data-id="${cancion.id}">Borrar</button>
                //     <button class="btn_editar btn" data-id="${cancion.id}">Editar</button>
                // </div>


            const btnCanciones = document.querySelectorAll(".btn_mostrar")
            btnCanciones.forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    
                    
                    const doc = await getCancion(e.target.dataset.id)
                    const cancion = doc.data()

                    cancionTarjeta.innerHTML = 
                    `
                    <div class="cancion_content" id="cancion_content">
                        <h2 class="titulo" id="titulo">${cancion.titulo}</h2>
                        <p class="tono" id="tono">${cancion.tono}</p>
                        <p class="letra" id="letra">${cancion.letra}</p>
                    </div>

                    `
                    // cancionContent["tono"].value = cancion.tono;
                    // cancionContent["letra"].value = cancion.letra;
                    


                    
                })
                
            })


            const btnsDelete = document.querySelectorAll('.btn_borrar');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {

                    swal({
                        title: "Estas seguro?",
                        text: "una vez eliminado no podras recuperar la información de tu servicio",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                deleteCancion(e.target.dataset.id)
                                swal("Está hecho, eliminaste la canción", {
                                    icon: "success",
                                });
                            } else {
                                swal("Aun conservas tu canción, ALÁBALE!!!");
                            }
                        });
                    // await deleteServicio(e.target.dataset.id)
                })
            })

            const btnsEdit = document.querySelectorAll('.btn_editar');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getCancion(e.target.dataset.id)
                    const cancion = doc.data();

                    editStatus = true;
                    id = doc.id;

                    form['titulo'].value = cancion.titulo;
                    form['tono'].value = cancion.tono;
                    form['letra'].value = cancion.letra;
                    form['btn_enviar'].innerHTML = "Actualizar";

                    form.classList.remove("hide")
                    window.scrollTo(0, 0);

                })
            })

        });
    })
})

const btnFormulario = document.querySelector(".btn_formulario")

btnFormulario.addEventListener("click", e => {
    form.classList.toggle("hide")
})


form.addEventListener("submit", async (e) =>{
    e.preventDefault()

    const titulo = form['titulo'];
    const tono = form['tono'];
    const letra = form['letra'];

    if (!editStatus) {
        await saveCancion(titulo.value, tono.value, letra.value);
        form.classList.add("hide")
    } else {
        await updateCancion(id, {
            titulo: titulo.value,
            tono: tono.value,
            letra: letra.value
        });

        editStatus = false;
        id = "";

        form.classList.add("hide")

        swal("Canción editada", "" , "success");

        form['btn_enviar'].innerHTML = "Enviar";

    }

    await getCanciones();

    form.reset();
    titulo.focus();

})

