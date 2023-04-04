import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import firebase from "firebase/compat/app";
import Constants from "expo-constants";
// Firebase config
export const firebaseConfig = {
  // apiKey: Constants.manifest.extra.apiKey,
  // authDomain: Constants.manifest.extra.authDomain,
  // projectId: Constants.manifest.extra.projectId,
  // storageBucket: Constants.manifest.extra.storageBucket,
  // messagingSenderId: Constants.manifest.extra.messagingSenderId,
  // appId: Constants.manifest.extra.appId,
  // databaseURL: Constants.manifest.extra.databaseURL,

  // apiKey: "AIzaSyDJaCMAD7fAm8hIANwfQq8K5FsrrkM3mAY",
  // authDomain: "moccasintelegraph-559a4.firebaseapp.com",
  // projectId: "moccasintelegraph-559a4",
  // storageBucket: "moccasintelegraph-559a4.appspot.com",
  // messagingSenderId: "730040094863",
  // appId: "1:730040094863:web:181e782704670435a7a0fa",
  // databaseURL: " G-20M9D2Q34M",

  apiKey: "AIzaSyDhvqufAGLwv5mQUH5fuUbAHrudn_1_jHk",
  authDomain: "pizzaapp-5ce59.firebaseapp.com",
  databaseURL: "https://pizzaapp-5ce59-default-rtdb.firebaseio.com",
  projectId: "pizzaapp-5ce59",
  storageBucket: "pizzaapp-5ce59.appspot.com",
  messagingSenderId: "367489521355",
  appId: "1:367489521355:web:e8ae0b3bd48db0d0af2d4e",
  measurementId: "G-S3M8M0MXL3",
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
export const storage = getStorage();
export { firebase };
