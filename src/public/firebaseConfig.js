import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDa7N9IBIGCSsDHHWzF8OjDvy1YZ9LszbQ",
  authDomain: "webnovel-2fced.firebaseapp.com",
  projectId: "webnovel-2fced",
  storageBucket: "webnovel-2fced.appspot.com",
  messagingSenderId: "268198427687",
  appId: "1:268198427687:web:48678f494b6060cff02202",
  measurementId: "G-0MWXK0Q94K"
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase; // 소셜로그인
export const authService = firebase.auth(); // 로그인 모듈

