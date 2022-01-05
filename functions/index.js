const functions = require('firebase-functions');
const app = require('express')();

const FirebaseAuth = require('./util/firebaseAuth');
const { signUp, login, updateUserDetails } = require('./handlers/users');

// Users routes
app.post('/signup', signUp);
app.post('/login', login);
app.post('/user', FirebaseAuth, updateUserDetails);

exports.api = functions.region('australia-southeast1').https.onRequest(app);
