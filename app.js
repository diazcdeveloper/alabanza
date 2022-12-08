
const db = firebase.firestore();

const form = document.getElementById('formulario');
const servicioContenedor = document.getElementById('servicio-contenedor');

//iconos de desplegar formulario

const btnH = document.getElementById("show");
const btnS = document.getElementById("hide");

// termina iconos de desplegar formulario



let editStatus = false;
let id = '';

const saveServicio = (director, dia, canciones) =>
    db.collection('servicio').doc().set({
        director,
        dia,
        canciones
    })

const getServicios = () => db.collection('servicio').get();

const getServicio = (id) => db.collection('servicio').doc(id).get();

const onGetServicio = (callback) => db.collection('servicio').onSnapshot(callback);

const deleteServicio = id => db.collection('servicio').doc(id).delete();

const updateServicio = (id, updatedTask) => db.collection('servicio').doc(id).update(updatedTask);

window.addEventListener('DOMContentLoaded', async (e) => {
    onGetServicio((querySnapshot) => {
        servicioContenedor.innerHTML = '';
        querySnapshot.forEach((doc) => {

            form.classList.add("hide");
            btnS.classList.remove("hide");
            btnH.classList.add("hide");

            const servicio = doc.data();
            servicio.id = doc.id;

            servicioContenedor.innerHTML += "";

            servicioContenedor.innerHTML +=
                `
                <div class="servicio">
                    <h3>${servicio.director}</h3>
                    <p class="dia">${servicio.dia}</p>
                    <p class="canciones">${servicio.canciones}</p>
                    <div class="btn_servicio">
                        <button class="btn_borrar btn" data-id="${servicio.id}">Borrar</button>
                        <button class="btn_editar btn" data-id="${servicio.id}">Editar</button>
                    </div>
                </div>
                `


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
                                deleteServicio(e.target.dataset.id)
                                swal("Está hecho, eliminaste tu servicio", {
                                    icon: "success",
                                });
                            } else {
                                swal("Tu servicio sigue en curso, ALÁBALE!!!");
                            }
                        });
                    // await deleteServicio(e.target.dataset.id)
                })
            })

            const btnsEdit = document.querySelectorAll('.btn_editar');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getServicio(e.target.dataset.id)
                    const servicio = doc.data();
                    
                    form.classList.remove("hide")

                    editStatus = true;
                    id = doc.id;

                    form['director'].value = servicio.director;
                    form['dia'].value = servicio.dia;
                    form['canciones'].value = servicio.canciones;
                    form['btn_enviar'].innerHTML = "Actualizar";
                })
            })

        });
    })
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const director = form['director'];
    const dia = form['dia'];
    const canciones = form['canciones'];

    if (!editStatus) {
        await saveServicio(director.value, dia.value, canciones.value);
    } else {
        await updateServicio(id, {
            director: director.value,
            dia: dia.value,
            canciones: canciones.value
        });

        editStatus = false;
        id = "";

        form.classList.add("hide")
        form['btn_enviar'].innerHTML = "Enviar";

    }

    await getServicios();

    form.reset();
    director.focus();

})


const btnLogout = document.querySelector(".log_out");

btnLogout.addEventListener("click", (e) => {
    e.preventDefault();

    firebase.auth().signOut().then(() => {

        location = 'index.html';
        // Sign-out successful.
        console.log("estas desconectado");
    }).catch((error) => {
        // An error happened.
        alert(error);
    });


})

