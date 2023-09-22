// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDruj5Vbrsg0DD1fOnjCgGI2sx2ujh4VD8',
    authDomain: 'whatsapp-clone-75530.firebaseapp.com',
    projectId: 'whatsapp-clone-75530',
    storageBucket: 'whatsapp-clone-75530.appspot.com',
    messagingSenderId: '269687658349',
    appId: '1:269687658349:web:d98439dd4ade9b66caec64',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
