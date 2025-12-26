  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js" ;
  import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js" ;

  const firebaseConfig = {
    apiKey: "AIzaSyCW56P6O0OooDcC8282V0ZOUMvnYeNp6L4",
    authDomain: "authrization-page.firebaseapp.com",
    projectId: "authrization-page",
    storageBucket: "authrization-page.firebasestorage.app",
    messagingSenderId: "796390339142",
    appId: "1:796390339142:web:476cc494eaed08154c5047"
  };

  const app = initializeApp(firebaseConfig);

  function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000)
  }

  const signUp=document.getElementById('submitSignUp');
  signUp.addEventListener('click',async(event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName: lastName
        };
        showMessage('Account Created Successfully','signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='../landing/index.html';
        })
        .catch((error)=>{
            console.log("error writing document", error);
        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Email Address Already Exists !!', 'signUpMessage');
        }
        else{
            showMessage('Unable to create User', 'signUpMessage');
        }
    })
  });

  const signIn=document.getElementById('submitSignIn');
  signIn.addEventListener('click',(event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        showMessage('Login is successful', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId',user.uid);
        window.location.href = "../landing/index.html";

    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signInMessage');
        }
        else{
            showMessage('Account Does not Exist','signInMessage');
        }

    })

  })
   