// Import necessary modules
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped new lines
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());


app.post('/send-notification', (req, res) => {
  const { fcmToken, title, body } = req.body;

  const message = {
    notification: {
      title: title || 'Hello!',
      body: body || 'This is a test notification',
    },
    token: fcmToken,
  };


  admin.messaging().send(message)
    .then((response) => {
      res.status(200).send({ message: 'Notification sent successfully', response });
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to send notification', details: error });
    });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
