const functions = require('firebase-functions');
const app = require('express')();

exports.api = functions.region('australia-southeast1').https.onRequest(app);
