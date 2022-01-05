const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// db: provides access to the Firebase Cloud Firestore database for read and write requests
// admin: provides access to other Firebase methods, namely, auth() and storage()
module.exports = { admin, db };
