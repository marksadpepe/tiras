importScripts("fb/firebase-app-compat.js");
importScripts("fb/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "firebase_api_key",
  authDomain: "firebase_auth_domain",
  projectId: "firebase_project_id",
  storageBucket: "firebase_storage_bucket",
  messagingSenderId: "firebase_messaging_sender_id",
  appId: "firebase_app_id",
  measurementId: "firebase_measurement_id",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
