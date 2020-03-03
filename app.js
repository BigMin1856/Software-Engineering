
//get elements
const txtEmail = document.getElementById('txtEmail')
const txtPassword = document.getElementById('txtPassword')
const btnLogin = document.getElementById('btnLogin')
const btnSignUp = document.getElementById('btnSignUp')
const logout = document.getElementById('logout')

////////////////////////////////////
// button Login - EVENT LISTENER
// add login event
////////////////////////////////////
btnLogin.addEventListener('click', e => {
    //get email and password
    const email = txtEmail.value;
    const pass = txtPassword.value;
    //sign in
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function (error) {
        window.alert("error")
    })
})

/////////////////////////////////////
// If user clicks sign up button
// authenticate them and then sign
// them in
////////////////////////////////////
btnSignUp.addEventListener('click', event => {
    const email = txtEmail.value;
    const pass = txtPassword.value

    firebase.auth().createUserWithEmailAndPassword(email, pass).then(() => {
        window.alert("Thank you for signing up!")
    }).catch(function (error) {
        // Handle Errors here.

    });
})

function logout() {
    alert("clicked")
    firebase.auth().signOut()
}