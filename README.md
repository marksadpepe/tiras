# Test Assignment Description
The objective of this test task is to implement the following:
1. Create a project in Firebase Console: set up a Firebase project, along with the necessary keys for accessing Firebase services.
2. Develop a Web Application: create a web application with a form that sends messages containing a title and text. The message should be sent to Node.js Service #1 using Socket.io.
3. Node.js Service #1: implement a Node.js service that receives messages from the web application via Socket.io. This service should then forward the message to Node.js Service #2 using UDP.
4. Node.js Service #2: develop another Node.js service that receives the message from Node.js Service #1 via UDP, formats it as an FCM (Firebase Cloud Message), and sends it back to the original web application using FCM.

As a result, the web application should receive the message through FCM.

# Important
To run the application, you first need to create a Firebase project and connect your web application to it. You can find instructions on how to do this <a href="https://chatgpt.com/share/67311667-63c8-8009-984f-31d94a603ffc" target="_blank">here</a> (clickable).

Next, in the ```backend``` folder, create a ```.env``` file and fill it with environment variables. Refer to the ```env.example``` file in the same folder.

Then, in your Firebase project, go to the **Project Settings -> Service Accounts** and click the ```Generate new private key``` button. Save this key as ```serviceAccountKey.json``` in the ```backend``` folder.

Next, in the ```frontend``` folder, you need to create a ```config.js``` file and fill it with data from the Firebase config (which can be found in the Firebase console of your project). For an example, see the ```configExample.js``` file in the same folder.

The final step is to create a ```firebase-messaging-sw.js``` file in the ```frontend``` folder. For an example, see the ```firebase-messaging-sw-example.js``` file in the same folder.

# Running
Starting backend servers:
```bash
cd backend
npm i
npm run server_1
npm run server_2
```
Starting the frontend:
```bash
cd frontend
npm i
npm run server
```

The website is available at the following link: http://localhost:4000. If you want to change the port, open the ```package.json``` file and modify the port in the ```scripts``` section:
```
"server": "npx http-server -p your_port"
```

Also, make sure to enable notifications, and after the browser prompts you to reload, press the keyboard combination **Ctrl + Shift + R**:
![send_message_firebase](https://github.com/user-attachments/assets/a970c926-9da9-4177-b12c-dc232fdea144)
