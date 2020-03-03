
//USER STATE
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        document.getElementById("notLoggedIn").style.display = "none";
        document.getElementById("loggedIn").style.display = "initial";
        //firebase.auth().signOut();
    } else {
        document.getElementById("notLoggedIn").style.display = "initial";
        document.getElementById("loggedIn").style.display = "none";
    }
});

//window.location.pathname = '/new'

function login() {

    let userEmail = document.getElementById("emailField").value
    let userPassword = document.getElementById("passwordField").value
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
    });
}