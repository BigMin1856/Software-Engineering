'use strict';


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////                                                               ///////////////////////
////////////////////////////                 SECTION MAIN                                  ///////////////////////
////////////////////////////                                                               ///////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
render_log_in_screen();
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

    // if not logged in, then show log in screen
    if (!user) { 
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
    } // end ifs
    
    else { //if there is no user signed in
        // redirect to login screen
        console.log("made it");
        window.location.href = "http://127.0.0.1:5500/login2.html";
        onsole.log("other");
        // document.getElementById("loggedOut").style.display = "initial"; //show login screen
        // document.getElementById("loggedIn").style.display = "none"; //hide logged in screen
        // document.getElementById("firechat-wrapper").style.display = "none"; //hide firechat
    }
});
// end MAIN !SECTION

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////                                                               ///////////////////////
////////////////////////////             SECTION FIREBASE FUNCTIONS                        ///////////////////////
////////////////////////////                                                               ///////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*-------------------------------------------------------------
// Function: render_log_in_screen
// Desc: adds elements to the doc for the login screen
// Format: right and left empty; main contents below
//   <div id="main_login_contents" class="main_login_contents">
//       <div>
//           <img id="logo" class="logo" src="assets/images/logo.png"  alt="logo">
//       </div>
//       <div>
//           <img id="logoWord" class="logoWord" src="assets/images/logo_word.PNG" alt="Safely Sent">
//       </div>
//       <div id="login_div" class="login_div">
//           <div id="email_input_div" class="input_box"> 
//                <input id="emailField" type="email" placeholder="Email"> 
//           </div>
//           <div id="password_input_div" class="input_box"> 
//                <input id="passwordField" type="password" placeholder="Password"> 
//           </div>
//           <div id="login_button_div" class="login_button_div">
//               <div id="button_for_login_submit" class="button_for_login_submit" onclick="login()"></div>
//           </div>
//       </div>
//       <div id="have_account_div" class="have_account_div">
//           Don't have an account? 
//           <a onclick="divChange_signup_to_login()" style="cursor: pointer;">
//           Sign up
//           </a>
//       </div>
//       <div class="bottom_div">
//           <div class="links"><a href="login2.html">ABOUT</a></div>
//           <div class="links"><a href="login2.html">JOBS</a></div>
//           <div class="links"><a href="login2.html">HELP</a></div>
//           <div class="links"><a href="login2.html">PRIVACY</a></div>
//           <div class="links"><a href="https://github.com/BigMin1856/Software-Engineering">GITHUB</a></div>
//       </div>
//   </div>
-------------------------------------------------------------*/
function render_log_in_screen() {
    //---MAIN LOGIN SECTION---//
    // clear main application stuff
    removeElementById('leftside');
    removeElementById('rightside');
    removeElementById('main');
    removeElementById('grid_container');

    // create main_login_contents div
    var centerContainer = createElementByClassId('div', 'center_container', 'center_container');
    document.body.appendChild(centerContainer);

    var mainLoginContentsDiv = createElementByClassId('div', 'main_login_contents', "main_login_contents");

    //---LOGO---//
    // create div for logo
    var logoDiv = document.createElement('div');
    // create img for logo
    var logoImg = createElementByClassId('img', 'logo', "logo");
    logoImg.src = "assets/images/logo.png"
    logoImg.alt = "logo"
    // add logo image to the div
    logoDiv.appendChild(logoImg);  
    
    //---LOGO-WORD---//
    // create div for logo word
    var logoWordDiv = document.createElement('div');
    // create img for logo
    var logoWord = createElementByClassId('img', 'logo_word', "logo_word");
    logoWord.src = "assets/images/logo_word.png"
    logoWord.alt = "Safely Sent"
    // add logo word image to the div
    logoWordDiv.appendChild(logoWord);

    //---LOGIN INPUTS---//
    // create div for email, password and submit button
    var loginDiv = createElementByClassId('div', 'login_div', "login_div");
    // Email Section - create email div and email input
    var emailInputDiv = createElementByClassId('div', 'email_input_div', "input_box");
    var emailInput = createElementByClassId('input', 'emailField', "emailField");
    emailInput.type = "email";
    emailInput.placeholder = "Email";
    // add input to div
    emailInputDiv.appendChild(emailInput);
    // Password Section - create password div and password input
    var passwordInputDiv = createElementByClassId('div', 'password_input_div', "input_box");
    var passwordInput = createElementByClassId('input', 'passwordField', "passwordField");
    passwordInput.type = "password";
    passwordInput.placeholder = "Password";
    // add input to input div
    passwordInputDiv.appendChild(passwordInput);
    // Submit Button Section - create button div and button (also a div)
    var loginButtonDiv = createElementByClassId('div', 'login_button_div', "login_button_div");
    var loginButton = createElementByClassId('div', 'button_for_login_submit', "button_for_login_submit");
    loginButton.appendChild(document.createTextNode("LOGIN"));
    loginButton.onclick = function() { login() };
    // add button to div
    loginButtonDiv.appendChild(loginButton);

    // //---SIGN UP AREA---//
    // create div
    var haveAccountDiv = createElementByClassId('div', 'have_account_div', 'have_account_div');
    // create div contents
    haveAccountDiv.appendChild(document.createTextNode("Don't have an account? "));
    haveAccountDiv.appendChild(createFunctionLinkElement('Sign up', 'Sign up', convertFromLoginToSignUp));

    //---FOOTER LINKS---// 
    // container for links
    var footerLinksDiv = createElementByClassId('div', 'footer_links_div', 'footer_links_div');
    // div for link
    var linkDiv = createElementByClassId('div', '', 'links');
    // create link
    var link = createFunctionLinkElement('ABOUT', 'More Information', convertScreenToAboutScreen); //TODO make convert function
    // ass link to link div
    linkDiv.appendChild(link)
    // add link div to footer links container
    footerLinksDiv.appendChild(linkDiv);
    // do the same as above for the other links in the footer
    link = createFunctionLinkElement('HELP', 'Questions', convertScreenToHelpScreen);//TODO make convert function
    linkDiv = createElementByClassId('div', '', 'links');
    linkDiv.appendChild(link);
    footerLinksDiv.appendChild(linkDiv);
    link = createFunctionLinkElement('JOBS', 'There are none', convertScreenToJobsScreen);//TODO make convert function
    linkDiv = createElementByClassId('div', '', 'links');
    linkDiv.appendChild(link);
    footerLinksDiv.appendChild(linkDiv);
    link = createFunctionLinkElement('PRIVACY', 'There is none', convertScreenToPrivacyScreen);//TODO make convert function
    linkDiv = createElementByClassId('div', '', 'links');
    linkDiv.appendChild(link);
    footerLinksDiv.appendChild(linkDiv);
    link = createLinkElement('GITHUB', 'https://github.com/BigMin1856/Software-Engineering', 'View code');
    linkDiv = createElementByClassId('div', '', 'links');
    linkDiv.appendChild(link);
    footerLinksDiv.appendChild(linkDiv);
 

    document.getElementById("center_container").appendChild(mainLoginContentsDiv); 
    document.getElementById("main_login_contents").appendChild(logoDiv);
    document.getElementById("main_login_contents").appendChild(logoWordDiv);
    document.getElementById("main_login_contents").appendChild(loginDiv);
    document.getElementById("login_div").appendChild(emailInputDiv);
    document.getElementById("login_div").appendChild(passwordInputDiv);
    document.getElementById("login_div").appendChild(loginButtonDiv);
    document.getElementById("main_login_contents").appendChild(haveAccountDiv);
    document.getElementById("center_container").appendChild(footerLinksDiv);
}//end render_log_in_screen()

/*-------------------------------------------------------------
// Function: convertFromLoginToSignUp
// Desc: remove login elements and replaces them with sign up
//      elements
// Parameters: N/A
// Return:  N/A
-------------------------------------------------------------*/
function convertFromLoginToSignUp() {
    // replace login for sign up on the button
    var buttonDiv = document.getElementById("button_for_login_submit");
    buttonDiv.removeChild(buttonDiv.childNodes[0]);
    buttonDiv.appendChild(document.createTextNode("SIGN UP"));
    buttonDiv.onclick = function() { signUp() };

    // replace prompt from "dont have account? sign up" to
    // "have an account? log in"
    var promptDiv = document.getElementById("have_account_div");
    promptDiv.removeChild(promptDiv.childNodes[0]); // text
    promptDiv.removeChild(promptDiv.childNodes[0]); // link
    promptDiv.appendChild(document.createTextNode("Have an account? "));
    var a = document.createElement('a');  
    var link = document.createTextNode("Log in");  //text for link
    a.appendChild(link);
    a.title = "Log in";
    a.onclick = function() { location.reload() };
    promptDiv.appendChild(a);
}

/*-------------------------------------------------------------
// Function: convertScreenToAboutScreen
// Desc: remove screen elements and replce them with an about
//      screen
// Parameters: N/A
// Return: N/A
-------------------------------------------------------------*/
function convertScreenToAboutScreen() {
    console.log('called convertScreenToAboutScreen')
    // remove previous contents of the page
    removeElementById('center_container');
    
    // HEADER //
    // create header
    var header = createElementByClassId('div', 'header', 'header');
    // create logo
    var logoDiv = createElementByClassId('div','header_logo_div', 'header_logo_div');
    var logo = createElementByClassId("img", 'header_logo', 'header_logo');
    logo.src = "assets/images/logo.png";
    logoDiv.appendChild(logo);
    // add logo to header
    header.appendChild(logoDiv);
    // create word logo
    var wordLogoDiv = createElementByClassId('div','header_word_logo_div', 'header_word_logo_div');
    var wordLogo = createElementByClassId("img", 'header_word_logo', 'header_word_logo');
    wordLogo.src = "assets/images/logo_word.png";
    wordLogoDiv.appendChild(wordLogo);
    // add word logo to header
    header.appendChild(wordLogoDiv);

    // add header to the document
    document.body.appendChild(header);

    // CONTENT //
    // create title, contents
    var decorationContainer = createElementByClassId('div', 'decoration_container', 'decoration_container');
    var contentContainer = createElementByClassId('div', 'content_container', 'content_container');
    var title = createElementByClassId('h1', 'about_title', 'about_title');
    title.appendChild(document.createTextNode('About Safely Sent'));
     // add title to container
    contentContainer.appendChild(title);
    var content = createElementByClassId('p', 'content_1', 'content');
    content.appendChild(document.createTextNode(
        'The creators of this project, Marc Minnick, Joshua Moran, and Galen Shirey,\
        are all CSC-355 Software Engineering II students eager to make our first large scale project.\
        Our goal is to provide a customer the peace of mind that should be had when speaking to someone\
        over text or voice. We plan to achieve these goals by implementing high-level encryption\
        methods into our private and group messaging modules of the application.'));
    contentContainer.appendChild(content);
    
    // add title and content into the container
    decorationContainer.appendChild(contentContainer);
   
    // add everything to the body
    document.body.appendChild(decorationContainer);

    // // create about content
    // var contentContainer = createElementByClassId('div', 'content_container', 'content_container');
    // var content = createElementByClassId('p', 'content_1', 'content');
    // content.appendChild(document.createTextNode(
    //     'The creators of this project, Marc Minnick, Joshua Moran, and Galen Shirey,\
    //     are all CSC-355 Software Engineering II students eager to make our first large scale project'));
    // contentContainer.appendChild(content);


    



}

/*-------------------------------------------------------------
// Function: convertScreenToJobsScreen
// Desc: remove screen elements and replce them with an jobs
//      screen
// Parameters: N/A
// Return: N/A
-------------------------------------------------------------*/
function convertScreenToJobsScreen() {
    console.log('called convert to JOBS');
}

/*-------------------------------------------------------------
// Function: convertScreenToHelpScreen
// Desc: remove screen elements and replce them with an help
//      screen
// Parameters: N/A
// Return: N/A
-------------------------------------------------------------*/
function convertScreenToHelpScreen() {
    console.log('called convert to HELP');
}

/*-------------------------------------------------------------
// Function: convertScreenToPrivacyScreen
// Desc: remove screen elements and replce them with an privacy
//      screen
// Parameters: N/A
// Return: N/A
-------------------------------------------------------------*/
function convertScreenToPrivacyScreen() {
    console.log('called convert to PRIVACY');
}

/*-------------------------------------------------------------
// Function: createLinkElement
// Desc: creates a link based on parameters
// Parameters:  text - link text
//              dest - link destinat
//              title - hover text
// Return:  link element 
-------------------------------------------------------------*/
function createLinkElement(text, dest, title) {
    var a = document.createElement('a');
    var link = document.createTextNode(text);
    a.appendChild(link);
    a.title = title;
    a.href = dest;
    return a;
}

/*-------------------------------------------------------------
// Function: createFunctionLinkElement
// Desc: creates a link based on parameters
// Parameters:  text - link text
//              title - hover text
//              f - function for link to perform
// Return:  link element
-------------------------------------------------------------*/
function createFunctionLinkElement(text, title, f) {
    var a = document.createElement('a');  
    var link = document.createTextNode(text);  //text for link
    a.appendChild(link);
    a.onclick = function() { f() };
    a.title = title
    return a;
}

/*-------------------------------------------------------------
// Function: createElementByClassId
// Desc: creates an element base on parameters
// Parameters:  tag - element to create
//              id - id for element
//              cName - class name for element
// Return:  element with id and class
-------------------------------------------------------------*/
function createElementByClassId(tag, id, cName) {
    var el = document.createElement(tag);
    el.id = id;
    el.className = cName;
    return el;
}

/*-------------------------------------------------------------
// Function: createElementByClassId TODO proper doc
// Desc: creates an element base on parameters
// Parameters:  tag - element to create
//              id - id for element
//              cName - class name for element
// Return:  element with id and class
-------------------------------------------------------------*/
function removeElementById(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
    
}

// end !SECTION AUTHENTICATION SCREEN

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////                                                               ///////////////////////
////////////////////////////                 SECTION FIREBASE FUNCTIONS                    ///////////////////////
////////////////////////////                                                               ///////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//Err:  If an error occurs --- TODO logout error handling
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

// end !SECTION FIREBASE FUNCTIONS 