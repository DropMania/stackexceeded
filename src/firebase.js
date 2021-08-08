import firebaseSDK from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyBSN3wim_faEiKx8eS6XGOoWOKR_o5p3A4',
    authDomain: 'stackexceeded.firebaseapp.com',
    projectId: 'stackexceeded',
    storageBucket: 'stackexceeded.appspot.com',
    messagingSenderId: '187887244365',
    appId: '1:187887244365:web:32f5719890ba81c404f804',
    measurementId: 'G-F7YGFKMLQZ',
}

firebaseSDK.initializeApp(firebaseConfig)

export const firebase = firebaseSDK
export const db = firebaseSDK.firestore()
