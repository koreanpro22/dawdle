// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3kzF6enTwLBPtCLFHlWzeQSBXehql9KE",
  authDomain: "dawdle-d6226.firebaseapp.com",
  projectId: "dawdle-d6226",
  storageBucket: "dawdle-d6226.appspot.com",
  messagingSenderId: "1062681872650",
  appId: "1:1062681872650:web:cfe248a6bb5176311152f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }