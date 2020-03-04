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

        document.getElementById("loggedOut").style.display = "none";

        //settimeout here and diplays intro ??

        document.getElementById("loggedIn").style.display = "initial";

        //UNCOMMENT TO FORCE LOGGOUT
        //firebase.auth().signOut();
        let user = firebase.auth().currentUser;
        let username = user.email.split('@')

        //if user exists -> display welcome message
        if (user != null) {
            document.getElementById("user").innerHTML = `welcome ${user.email} ${`${user.displayName == null ? ` ` : `or should i call you ${user.displayName} ;)`}`}`
            console.log(user.displayName)
        }

        //set username to email
        if (user.displayName == null) {
            user.updateProfile({
                displayName: username[0]
            }).catch(function (error) {
                window.alert(err)
            });
        }

        //Display User Contact List
        let ref = firebase.database().ref('users/' + username[0]).once('value').then((snapshot) => {
            //gets contact list as an object
            let contactObj = snapshot.child('contacts').val()
            //markup for html
            let contactList = "<br>"
            for (var contactKey in contactObj) {
                console.log(contactKey)
                contactList += `<li>${contactKey}</li>`
            }
            contactList += "<br>"
            document.getElementById("contactList").innerHTML = contactList
        })





        /**************************************************************************/
    } else { //if there is no user signed in
        document.getElementById("loggedOut").style.display = "initial";
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
//
//Err:  If an error occurs it diplays the message to the screen
//-------------------------------------------------------------
function signUp() {

    let userEmail = document.getElementById("emailField").value
    let userPassword = document.getElementById("passwordField").value

    //Create user auth -> then add them to the database
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(() => {
        //START USER DATABASE
        //current user
        let user = firebase.auth().currentUser;
        let userID = user.uid;
        let email = user.email;
        let username = email.split('@')
        startUserData(userID, username[0], email)


    }).catch(function (error) {
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
function logOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}



/******************************
 * Manage Account Section
 * Current Methods:
 *  changeEmail()
 *  changePassword()
 *  changeUsername()
 ******************************/


//-------------------------------------------------------------
//Function: changeEmail
//Desc: grabs current users details then changes email if
//      promise is successful
//Err:  output error message
//-------------------------------------------------------------
function changeEmail() {
    var currentUser = firebase.auth().currentUser;

    let newEmail = document.getElementById("updateEmail").value

    currentUser.updateEmail(newEmail).then(() => {
        window.alert("Success! Your new email login is: " + newEmail)
        location.reload();
    }).catch((err) => {
        //error occured
        window.alert(err)
    })
}

//-------------------------------------------------------------
//Function: changePassword
//Desc: grabs current users details then changes password if
//      promise is successful
//Err:  output error message
//-------------------------------------------------------------
function changePassword() {
    var currentUser = firebase.auth().currentUser;

    let newPassword = document.getElementById("updatePassword").value

    currentUser.updatePassword(newPassword).then(() => {
        window.alert("Success! Your password has been updated!")
        location.reload();
    }).catch((err) => {
        //error occured
        window.alert(err)
    })
}

//-------------------------------------------------------------
//Function: changeUsername
//Desc: grabs current users details then changes username if
//      promise is successful
//Err:  output error message
//-------------------------------------------------------------
function changeUsername() {
    var currentUser = firebase.auth().currentUser;

    let newUsername = document.getElementById("updateUsername").value

    currentUser.updateProfile({
        displayName: newUsername
    }).then(function () {
        window.alert("Success! Your username has been updated!")
        location.reload();
    }).catch(function (error) {
        window.alert(err)
    });
}




/**************************************************
 * get database:
 *      var database = firebase.database();
 * Realtime Database Section
 * See Firebase Documentation for more details
 **************************************************/


//-------------------------------------------------------------
//Function: startUserData
//Desc: Used in signUp to load user info into database
//Err:  output error message
//-------------------------------------------------------------
function startUserData(userID, username, email) {
    firebase.database().ref('users/' + username).set({
        uid: userID,
        userEmail: email,
        contacts: null
    });
}


//-------------------------------------------------------------
//Function: addContact
//Desc: Adds contact to user's database yes
//      checks if user actually exists
//Err:  output error message
//-------------------------------------------------------------
function addContact() {
    var currentUser = firebase.auth().currentUser;
    let email = currentUser.email;
    let username = email.split('@')
    let newContact = document.getElementById("addContact").value


    //grab users
    let usersRef = firebase.database().ref().once("value").then(function (snapshot) {
        let userObj = snapshot.child('users/').val()
        userList = Object.keys(userObj)
        if (userList.includes(newContact)) {

            //add that contact
            firebase.database().ref('users/' + username[0] + '/contacts').update({
                [newContact]: newContact
            }).then(() => {
                location.reload();
            }).catch((err) => {
                window.alert(err)
            });
        } else {
            window.alert("User Does Not Exist")
        }
    })
}



//-------------------------------------------------------------
//Function: removeContact
//Desc: removes contact if that contact exists in users contact
//      list
//Err:  output error message
//-------------------------------------------------------------
function removeContact() {
    //same as above but in 2 lines
    let username = firebase.auth().currentUser.email.split('@');
    let removeUser = document.getElementById("removeContact").value

    let usersRef = firebase.database().ref('users/' + username[0]).once("value").then(function (snapshot) {
        let userObj = snapshot.child('contacts/').val()
        userList = Object.keys(userObj)
        if (userList.includes(removeUser)) {
            //remove that user
            var ref = firebase.database().ref('users/' + username[0] + '/contacts/' + removeUser)
            ref.remove().then(() => {
                window.alert(removeUser + " has been removed")
                location.reload();
            }).catch(() => {
                window.alert("? You are not friend with this person ?")
            })

        } else {
            window.alert("This person is not on your friends list")
        }

    })
}