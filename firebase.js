import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBeG96Ys5NeH59vseICc2Q8KY27h6TX38Y",
    authDomain: "meu-spotify-e5dec.firebaseapp.com",
    projectId: "meu-spotify-e5dec",
    storageBucket: "meu-spotify-e5dec.firebasestorage.app",
    messagingSenderId: "1038874509692",
    appId: "1:1038874509692:web:e7b5a6abcfe06442d064f9",
    measurementId: "G-Q0ZYJ70HK6",
    databaseURL: "https://meu-spotify-e5dec-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db };