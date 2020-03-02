
//get elements
const txtEmail = document.getElementById('txtEmail')
const txtPassword = document.getElementById('txtPassword')
const btnLogin = document.getElementById('btnLogin')
const btnSignUp = document.getElementById('btnSignUp')
const btnLogout = document.getElementById('btnLogout')


//add login event
btnLogin.addEventListener('click', e => {
    //get email and password
    const email = txtEmail.value;
    const pass = txtPassword.value;

    //sign in
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function (error) {
        console.log(err)
    })
})
