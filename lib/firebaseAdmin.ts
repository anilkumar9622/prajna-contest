// import admin from 'firebase-admin';

// declare global {
//     // Extend the NodeJS.Global interface to include _firebaseAdminInitialized
//     // This avoids the implicit 'any' type error
//     // eslint-disable-next-line no-var
//     var _firebaseAdminInitialized: boolean | undefined;
// }

// let firebaseApp;

// if (!global._firebaseAdminInitialized) {
//     try {
//         if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
//             const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
//             firebaseApp = admin.initializeApp({
//                 credential: admin.credential.cert(serviceAccount),
//             });
//         } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
//             // Let firebase-admin pick up GOOGLE_APPLICATION_CREDENTIALS
//             firebaseApp = admin.initializeApp();
//         } else {
//             // Try default (useful in some server environments)
//             firebaseApp = admin.initializeApp();
//         }
//         global._firebaseAdminInitialized = true;
//     } catch (err) {
//         // If already initialized, reuse it
//         if (!admin.apps.length) throw err;
//     }
// } else {
//     firebaseApp = admin.app();
// }

// export default admin;

import admin from 'firebase-admin';
   
declare global {
  // Prevent multiple initializations
  var _firebaseAdminInitialized: boolean | undefined;
}

let firebaseApp: admin.app.App;

if (!global._firebaseAdminInitialized) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Parse the JSON service account and fix newlines in private_key
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      serviceAccount.private_key = serviceAccount.private_key?.replace(/\\n/g, '\n');

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Fallback to GOOGLE_APPLICATION_CREDENTIALS or default
      firebaseApp = admin.initializeApp();
    }

    global._firebaseAdminInitialized = true;
  } catch (err) {
    if (!admin.apps.length) throw err;
    firebaseApp = admin.app();
  }
} else {
  firebaseApp = admin.app();
}

export default admin;
