/////////////////////////////////////////
// Author: Galen Shirey
// Edited By: 
// Creation Date: 3.1.2020
// app.js - main javascript source file
/////////////////////////////////////////



//-------------------------------------------------------------
//function: User State
//Desc: USER STATE METHOD
//      If a user is currently logged in, the correct HTML will
//      will display
//-------------------------------------------------------------
firebase.auth().onAuthStateChanged(function (user) {
    if (user) { //if user is currently signed in

        document.getElementById("notLoggedIn").style.display = "none";

        //settimeout here and diplays intro ??

        document.getElementById("loggedIn").style.display = "initial";

        //UNCOMMENT TO FORCE LOGGOUT
        //firebase.auth().signOut();
        let user = firebase.auth().currentUser;
        
        //if user exists -> display welcome message
        if(user != null){
         document.getElementById("user").innerHTML = `welcome ${user.email}`   
        }
        
    } else { //if there is no user signed in
        document.getElementById("notLoggedIn").style.display = "initial";
        document.getElementById("loggedIn").style.display = "none";
    }
});

//-------------------------------------------------------------
//Function: login
//Desc: Grabs users email and password from field
//      and uses firebases authentication to log them in
//Err:  If an error occurs it diplays the message to the screen
//-------------------------------------------------------------
function login() {
    let userEmail = document.getElementById("emailField").value
    let userPassword = document.getElementById("passwordField").value
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        window.alert(errorMessage)
    });
}

//-------------------------------------------------------------
//Function: signUp
//Desc: Grabs users email and password from field
//      and uses firebases authentication to sign them up
//Err:  If an error occurs it diplays the message to the screen
//-------------------------------------------------------------
function signUp(){

    let userEmail = document.getElementById("emailField").value
    let userPassword = document.getElementById("passwordField").value

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage);
      });
}

//-------------------------------------------------------------
//Function: logOut
//Desc: Uses firebase authentication to sign out the user
//Err:  If an error occurs --- TODO
//-------------------------------------------------------------
function logOut(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
}