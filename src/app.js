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

        //Display User Contact List
        let contactList = ''
        let ref = firebase.database().ref('users/' + user.uid + '/contacts/').orderByChild('userName').on("child_added", function (snapshot) {
            //gets contact list as an object

            let contactObj = snapshot.val().userName
            console.log(contactObj)
            //markup for html
            //console.log(contactKey)
            contactList += `<li>${contactObj}</li>`
            document.getElementById("contactList").innerHTML = contactList
            console.log(contactObj)
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

        user.updateProfile({
            displayName: username[0]
        }).then(function () {
        }).catch(function (err) {
            window.alert(err)
        });

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

    //Change in authentication 
    currentUser.updateProfile({
        displayName: newUsername
    }).then(function () {
        window.alert("Success! Your username has been updated!")
        location.reload();
    }).catch(function (error) {
        window.alert(err)
    });

    //chnage in database
    let username = firebase.auth().currentUser.email.split('@');
    firebase.database().ref('users/' + username[0]).set({})
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
    firebase.database().ref('users/' + userID).set({
        userName: username,
        userEmail: email,
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
    let newContact = document.getElementById("addContact").value
    //grab users
    let usersRef = firebase.database().ref('users');
    usersRef.orderByChild('userName').on("child_added", function (snapshot) {
        if (snapshot.val().userName == newContact) {
            //add that contact
            firebase.database().ref('users/' + currentUser.uid + '/contacts/' + [snapshot.key]).update({
                userName: newContact
            }).then(() => {
                location.reload();
            }).catch((err) => {
                window.alert(err)
            });
        } else {
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
    var currentUser = firebase.auth().currentUser;
    let removeUser = document.getElementById("removeContact").value

    let usersRef = firebase.database().ref('users');
    usersRef.orderByChild('userName').on("child_added", function (snapshot) {
        if (snapshot.val().userName == removeUser) {
            //remove that user
            var ref = firebase.database().ref('users/' + currentUser.uid + '/contacts/' + [snapshot.key])
            ref.remove().then(() => {
                window.alert(removeUser + " has been removed")
                location.reload();
            }).catch(() => {
                window.alert("? You are not friend with this person ?")
            })

        } else {
        }

    })
}