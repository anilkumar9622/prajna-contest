import admin from 'firebase-admin';

let firebaseApp;

if (!global._firebaseAdminInitialized) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            // Let firebase-admin pick up GOOGLE_APPLICATION_CREDENTIALS
            firebaseApp = admin.initializeApp();
        } else {
            // Try default (useful in some server environments)
            firebaseApp = admin.initializeApp();
        }
        global._firebaseAdminInitialized = true;
    } catch (err) {
        // If already initialized, reuse it
        if (!admin.apps.length) throw err;
    }
} else {
    firebaseApp = admin.app();
}

export default admin;
