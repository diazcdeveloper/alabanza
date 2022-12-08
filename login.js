// CODIGO LOGIN

const formLogin = document.querySelector(".form_login");


formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in

            location = 'app.html'

            formLogin.reset();


        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            swal("Correo o contraseña no válidos", errorMessage);
            formLogin.reset();
        });

})

// CODIGO LOGOUT


