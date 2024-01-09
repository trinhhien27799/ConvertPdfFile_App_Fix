// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAvQxWsYLuqZuMhXZNrp2bQ6Dv0fT9v8S8",
    authDomain: "my-convert-pdf-file-app.firebaseapp.com",
    projectId: "my-convert-pdf-file-app",
    storageBucket: "my-convert-pdf-file-app.appspot.com",
    messagingSenderId: "513926991615",
    appId: "1:513926991615:web:c5a726d868d35f0a53c6ca",
    measurementId: "G-J7D01JCWK9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);