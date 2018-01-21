import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyD0j1qX5nSlrBm8dxcF9LWJbNZTUVw3-IE",
    authDomain: "to-do-pawel.firebaseapp.com",
    databaseURL: "https://to-do-pawel.firebaseio.com",
    projectId: "to-do-pawel",
    storageBucket: "to-do-pawel.appspot.com",
    messagingSenderId: "829850970433"
}

firebase.initializeApp(config)

export const database = firebase.database()