const functions = require('firebase-functions');
const app = require('express')();

const { signUp } = require('./handlers/users');

// Users routes
app.post('/signup', signUp);

exports.api = functions.region('australia-southeast1').https.onRequest(app);
