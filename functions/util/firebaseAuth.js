const { admin, db } = require('./admin');

// Middleware to check for a Firebase-authenticated user
module.exports = (req, res, next) => {
  let userToken;

  // Checks that the request has an auth token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    userToken = req.headers.authorization.split('Bearer ').join('');
  } else {
    console.error('No auth token found');
    return res.status(403).json({ error: 'Unauthorised' });
  }

  // Verifies that token is a valid Firebase token
  admin.auth().verifyIdToken(userToken)
    .then((decodedToken) => {
      req.user = decodedToken; // adds token to the request
      return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
       // adds user info to any authenticated requests
      req.user.username = data.docs[0].data().username;
      req.user.imageURL = data.docs[0].data().imageURL;

      return next();
    })
    .catch((err) => {
      console.error('Error while verifying token', err);
      return res.status(403).json(err);
    });
};
