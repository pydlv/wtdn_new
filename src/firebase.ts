import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {authModule} from "@/store";

const firebaseConfig = {
    apiKey: "AIzaSyCPtLV7u_a0Pq3JN2BtQTediPiSTWh2-SA",
    authDomain: "wtdn-dd7cb.firebaseapp.com",
    projectId: "wtdn-dd7cb",
    storageBucket: "wtdn-dd7cb.appspot.com",
    messagingSenderId: "516131600773",
    appId: "1:516131600773:web:d46cfb68f30d1e2d282cec",
    measurementId: "G-KE6JXQHYTX"
};

firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
// const firestore = firebase.firestore();
// const storage = firebase.storage();

auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log("Got sign in");
    } else {
        // No user is signed in.
        console.log("Not signed in")
    }
    authModule.setUser(user);
});

export {firebase, auth};
