var firebase = require('firebase/app');


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAF-1vDsV-NU7ihvojiw7uLYhbico8pA6g',
  authDomain: 'trackingandmonitoringsystem.firebaseapp.com',
  projectId: 'trackingandmonitoringsystem',
  storageBucket: 'trackingandmonitoringsystem.appspot.com',
  messagingSenderId: '896495303491',
  appId: '1:896495303491:web:c085781b02c5c5968bcdf6',
};

const app = firebase.initializeApp(firebaseConfig);
var auth = require('firebase/auth');
const sign = auth.getAuth();
auth
  .signInWithEmailAndPassword(sign, 'game47you@gmail.com', 'test1234')
  .then(async (userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('user', await user.getIdToken());
    
    //send emailveification
    /*await auth.sendEmailVerification(auth.getAuth().currentUser)
    .then(() => {
      console.log('send successful');
    })*/
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

