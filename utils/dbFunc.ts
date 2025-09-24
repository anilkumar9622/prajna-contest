import db from '@/utils/firebase';
const admin = require('firebase-admin');

export default {
    add: async (collection: string, documentID: string, data: {}) => {
        return await db.collection(collection).doc(documentID).set(data);
    },
    updateByDocumentID: async (collection: string, documentID: string, data: {}) => {
        return await db.collection(collection).doc(documentID).update(data);
    },
    findAllDocs: async (collection: string) => {
        try {
            const docRef = db.collection(collection);
            const docSnapshot = await docRef.get();

            if (docSnapshot.empty) throw "No Record Found!";

            // Map over each document in the snapshot to extract data
            let data = docSnapshot.docs.map(doc => ({
                id: doc.id, // Include document ID
                ...doc.data() // Spread document data
            }));

            return data;
        } catch (error) {
            throw error;
        }
    },
    findViaDocumentID: async (collection: string, documentID: string) => {
        try {
            const docRef = db.collection(collection).doc(documentID);
            const docSnapshot = await docRef.get();

            if (!docSnapshot.exists) throw "No Record Found!";

            let data = { id: docSnapshot.id, ...docSnapshot.data() }; // Include document ID
            return data;
        } catch (error) {
            throw error;
        }
    }
};
