const functions = require('firebase-functions');
const app = require('express')();

const { signUp, login } = require('./handlers/users');

// Users routes
app.post('/signup', signUp);
app.post('/login', login);

exports.api = functions.region('australia-southeast1').https.onRequest(app);
