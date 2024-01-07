// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import { getFireStore } from 'firebase/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { getAnalytics, initializeAnalytics } from "firebase/analytics";

import { collection, getDocs, getFirestore, DocumentReference, deleteDoc } from "firebase/firestore";
import {
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  getDoc,
  FieldValue
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
const firestore = firebase.firestore()
const analytics = initializeAnalytics(firebaseApp, { measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID });




export const getAllData = async () => {
  const snapshot = await getDocs(collection(db, "url"));
  let result = []
  snapshot.docs.map((doc) => (
    result.push({ id: doc.id, ...doc.data() })
  ));
  console.log("result all url data ", result)
  return result
};
export const getSingleUrlData = async (id) => {
  let result = []
  const snapshot = await getDocs(collection(db, "url"));
  snapshot.docs.map((doc) => {
    console.log(doc.data())
    if (doc.id === id) {

      console.log(doc.id)
      result.push({ id: doc.id, ...doc.data() });
    }
  })
  console.log("single url firebase", result)
  return result


}
export const deleteDocumentById = async (documentId) => {
  try {
    const docRef = doc(db, "url", documentId); // Create a reference to the document
    await deleteDoc(docRef); // Delete the document
    console.log(`Document with ID ${documentId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting document: ${error}`);
  }
};
export const updateDocumentById = async (documentId, updatedData) => {
  try {
    const docRef = doc(db, "url", documentId); // Create a reference to the document
    await updateDoc(docRef, updatedData); // Update the document with the new data
    console.log(`Document with ID ${documentId} updated successfully.`);
  } catch (error) {
    console.error(`Error updating document: ${error}`);
  }
};
export { auth, provider, storage, firestore, analytics };
export default db;
