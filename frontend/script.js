import {
  APP_ID,
  API_KEY,
  PROJECT_ID,
  AUTH_DOMAIN,
  MEASUREMENT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  VAPID_KEY,
  BACKEND_URL
} from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getMessaging,
  onMessage,
  getToken
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js";

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
const messaging = getMessaging(app);
const sock = io(BACKEND_URL);

window.addEventListener("DOMContentLoaded", async () => {
  let token = "";
  const permission = await Notification.requestPermission();
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

  if (permission.toLowerCase() !== "granted") {
    alert("Please allow notifications");
    return;
  }

  try {
    token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });
  } catch (err) {
    console.error(`Failed to get token: ${err}`);
  }

  if (!token) {
    console.error("Token is empty");
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application"
      },
      body: JSON.stringify({token}),
    });

    if (response.status != 200) {
      console.error(`Failed to POST a request: ${await response.json()}`);
    }
  } catch (err) {
    console.error(`Failed to POST a request: ${err}`);
  }
});

document.getElementById("messageForm").onsubmit = function(event) {
  event.preventDefault();
  const titleEl = document.getElementById("title");
  const bodyEl = document.getElementById("body");

  const msgTitle = titleEl.value ?? "";
  const msgBody = bodyEl.value ?? "";

  sock.emit("form-message", {title: msgTitle, body: msgBody});

  titleEl.value = "";
  bodyEl.value = "";
};

onMessage(messaging, (payload) => {
  new Notification(payload.notification.title, {
    body: payload.notification.body,
  });
});
