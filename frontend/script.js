import {
  APP_ID,
  API_KEY,
  PROJECT_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID
} from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const sock = io("http://localhost:5000");

document.getElementById("messageForm").onsubmit = function(event) {
  event.preventDefault();
  const titleEl = document.getElementById("title");
  const bodyEl = document.getElementById("body");

  const msgTitle = titleEl.value;
  const msgBody = bodyEl.value;

  if (msgTitle) {
    sock.emit("form-title", msgTitle);
  }

  if (msgBody) {
    sock.emit("form-body", msgBody);
  }

  titleEl.value = "";
  bodyEl.value = "";
};
