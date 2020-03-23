/////////////////////////////////////////
// Author: Galen Shirey
// Edited By: 
// Creation Date: 3.1.2020
// app.js - main javascript source file
// Version: 0.4.5
//      (major.minor.update)
/////////////////////////////////////////

// Get a Firebase Database ref
let chatRef = firebase.database().ref("chat");
// Create a Firechat instance
// handles sending and receiving messages
let chatui = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));

//-------------------------------------------------------------
//Desc: USER STATE METHOD
//      If a user is currently logged in, the correct HTML will
//      will display
//-------------------------------------------------------------

firebase.auth().onAuthStateChanged(function (user) {

    if (user) { //if user is currently signed in
        // document.getElementById("loggedOut").style.display = "none";
        // //settimeout here and diplays intro ??
        // document.getElementById("loggedIn").style.display = "initial";
        // document.getElementById("firechat-wrapper").style.display = "intial";

        //UNCOMMENT TO FORCE LOGGOUT
        //firebase.auth().signOut();
        let user = firebase.auth().currentUser;
        let username = user.email.split('@')
        // Set the Firechat user
        chatui.setUser(user.uid, user.displayName);

        //Welcome Message (temp)
        document.getElementById("user").innerHTML = `welcome ${user.email} ${`${user.displayName == null ? ` ` : `or should i call you ${user.displayName} ;)`}`}`
        console.log(user.displayName);

        //Display User Contact List
        let contactList = ''
        let ref = firebase.database().ref('users/' + user.uid + '/contacts/').orderByChild('userName').on("child_added", function (snapshot) {
            //gets contact list as str
            let contactObj = snapshot.val().userName
            console.log(contactObj)
            //markup for html
            contactList += `<li>${contactObj}</li>`
            document.getElementById("contactList").innerHTML = contactList
        })
    } // end if
    
    else { //if there is no user signed in
        // redirect to login screen
        window.location.href = "http://127.0.0.1:5500/login2.html";
        // document.getElementById("loggedOut").style.display = "initial"; //show login screen
        // document.getElementById("loggedIn").style.display = "none"; //hide logged in screen
        // document.getElementById("firechat-wrapper").style.display = "none"; //hide firechat
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
        let errorCode = error.code;
        let errorMessage = error.message;
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
        let errorCode = error.code;
        let errorMessage = error.message;
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
        location.replace("../index.html");
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
    let currentUser = firebase.auth().currentUser;
    let newEmail = document.getElementById("updateEmail").value

    currentUser.updateEmail(newEmail).then(() => {
        window.alert("Success! Your new email login is: " + newEmail)
        location.reload();
    }).catch((err) => {
        window.alert(err)
    })


    //chnage in database
    firebase.database().ref('users/' + currentUser.uid).update({ userEmail: newEmail })
}

//-------------------------------------------------------------
//Function: changePassword
//Desc: grabs current users details then changes password if
//      promise is successful
//Err:  output error message
//-------------------------------------------------------------
function changePassword() {
    let currentUser = firebase.auth().currentUser;
    let newPassword = document.getElementById("updatePassword").value

    currentUser.updatePassword(newPassword).then(() => {
        window.alert("Success! Your password has been updated!")
        location.reload();
    }).catch((err) => {
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
    let currentUser = firebase.auth().currentUser;

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
    firebase.database().ref('users/' + currentUser.uid).update({ userName: newUsername })

}

/**************************************************
 * get database:
 *      let database = firebase.database();
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
    let currentUser = firebase.auth().currentUser;
    let newContact = document.getElementById("addContact").value
    let chat = chatui._chat;
    //grab users
    let usersRef = firebase.database().ref('users');
    usersRef.orderByChild('userName').on("child_added", function (snapshot) {
        if (snapshot.val().userName == newContact) {
            //add that contact

            //TODO - Here is where we want to init a chat room with a user
            chat.setUser(currentUser.uid, currentUser.displayName, () => {

                console.log(snapshot.key)
                chat.createRoom(newContact + ' and ' + currentUser.displayName, "private", (roomId) => {
                    chat.inviteUser(snapshot.key, roomId)
                })
            })
            let promise = firebase.database().ref('users/' + currentUser.uid + '/contacts/' + [snapshot.key]).update({
                userName: newContact
            }).then(function () {
                //location.reload(); this breaks chat invite
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
    let currentUser = firebase.auth().currentUser;
    let removeUser = document.getElementById("removeContact").value
    let chat = chatui._chat;

    let usersRef = firebase.database().ref('users');
    usersRef.orderByChild('userName').on("child_added", function (snapshot) {
        if (snapshot.val().userName == removeUser) {
            //remove that user
            chat.setUser(currentUser.uid, currentUser.displayName, () => {

                let roomRef = firebase.database().ref('chat/users/' + currentUser.uid + '/rooms/');
                roomRef.orderByChild(removeUser).on("child_added", (snap) => {
                    console.log(snap.val().name)
                    removeUser += ` and ${currentUser.displayName}`

                    if (snap.val().name == removeUser) {
                        chat.leaveRoom(snap.key)
                        console.log("room left")
                    }
                })
            })
            let ref = firebase.database().ref('users/' + currentUser.uid + '/contacts/' + [snapshot.key])
            ref.remove().then(() => {
                window.alert(removeUser + " has been removed")
                //location.reload();
            }).catch(() => {
                window.alert("? You are not friend with this person ?")
            })

        } else {
        }

    })
}

//-------------------------------------------------------------
//Function: initChat(user)
//Desc: Method for creating chat rooms
//Err:  Unknown
//-------------------------------------------------------------
//Firebase messaging object
function initChat(user) {
    // Get a Firebase Database ref
    let chatRef = firebase.database().ref("chat");
    // Create a Firechat instance
    let chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
    // Set the Firechat user
    chat.setUser(user.uid, user.displayName);
}

// Helpful Links
//  Firebase Docs
//      https://firebase.google.com/docs/web/setup
//  Firebase Reference (More Detailed)
//      https://firebase.google.com/docs/reference/js
//  For User Status (Later Implementation)
//      https://firebase.google.com/docs/database/web/offline-capabilities
//  some sample code if you get REALLY stuck
//      https://firebase.google.com/docs/samples
//