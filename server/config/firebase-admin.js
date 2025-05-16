const admin = require('firebase-admin');

// Initialize Firebase Admin with service account
// Note: Make sure to set FIREBASE_SERVICE_ACCOUNT environment variable in your deployment environment
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (!serviceAccount.project_id) {
  console.error('Firebase service account not properly configured');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin; 