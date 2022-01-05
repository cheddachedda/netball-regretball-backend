const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

const { db } = require('../util/admin');
const firebaseConfig = require('../util/firebaseConfig');
const { validateSignUpData, validateLoginData } = require('../util/helpers');

initializeApp(firebaseConfig);
const auth = getAuth();

// POST '/signup'
// Creates a Firebase-authenticated user as well as a Firestore 'user' doc from the req.data
exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username
  };

  const { errors, valid } = validateSignUpData(newUser);

  // Returns error messages for rendering in UI
  if (!valid) return res.status(400).json(errors);

  const defaultImage = 'no-img.png';
  let userToken, userId;

  // Checks the 'users' Firestore collection to see if the request username already exists
  db.doc(`/users/${ newUser.username }`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ username: 'this username is already taken' });
      } else {
        // Creates a Firebase-authenticated user
        return createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      }
    })
    // Extract Firebase-generated id for db writing
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    // Creates a new 'user' doc to optimise database performance
    .then((token) => {
      userToken = token;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageURL: `https://firebasestorage.googleapis.com/v0/b/${ firebaseConfig.storageBucket }/o/${ defaultImage }?alt=media`,
        userId
      };

      return db.doc(`/users/${ newUser.username }`).set(userCredentials);
    })
    // Returns a Firebase-verified session token
    .then(() => {
      return res.status(201).json({ token: userToken });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'email is already in use' });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

// POST '/login'
// Logs-in a user with Firebase Authentication and returns a Firebase-verified session token
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  // Returns error messages for rendering in UI
  if (!valid) return res.status(400).json(errors);

  signInWithEmailAndPassword(auth, user.email, user.password)
    .then((data) => {
      return data.user.getIdToken()
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res.status(403).json({ general: 'Wrong credentials. Please try again.' });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};
