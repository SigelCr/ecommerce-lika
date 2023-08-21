import { initializeApp } from "firebase/app";
import {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCuvFQOE9PI7jqKGbGdhyxNOH7QDRBqbU",
  authDomain: "ecommerce-lika.firebaseapp.com",
  projectId: "ecommerce-lika",
  storageBucket: "ecommerce-lika.appspot.com",
  messagingSenderId: "816086411401",
  appId: "1:816086411401:web:00fe6d0a4d37c53829be58",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

//SERVICIOS

//AUTH

//login

export const onSigIn = async ({ email, password }) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.log(error);
  }
};
//logout

export const logout = () => {
  signOut(auth);
  console.log("se cerro sesion");
};
//login con google
let googleProvider = new GoogleAuthProvider();

export const loginGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res;
  } catch (error) {
    console.log(error);
  }
};

//registro

export const signUp = async ({ email, password }) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.log(error);
  }
};
//olvide contraseña
export const forgotPassword = async (email) => {
  try {
    let res = await sendPasswordResetEmail(auth, email);
    return res;
  } catch (error) {
    console.log("este es el error", error);
  }
};
//BASE DE DATOS

//STORAGE
