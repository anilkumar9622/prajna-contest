import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG || "")),
    databaseURL: "https://bace-delhi-cms-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

// export default admin.firestore();


const db = admin.firestore();

// Health-check helper
export async function checkFirestoreConnection() {
  try {
    await db.listCollections(); // lightweight connectivity check
    return true;
  } catch (err) {
    console.error("❌ Firestore connection failed:", err);
    return false;
  }
}

export default db;