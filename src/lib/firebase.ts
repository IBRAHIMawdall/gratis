// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, writeBatch } from "firebase/firestore";
import { FreeItem } from "./types";
import { mockFreeItems } from "./data";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const ITEMS_COLLECTION = 'free-items';

export async function getFreeItems(): Promise<FreeItem[]> {
  try {
    const itemsCollection = collection(db, ITEMS_COLLECTION);
    const snapshot = await getDocs(itemsCollection);
    if (snapshot.empty) {
        console.log("No items found in Firestore. Consider seeding the database.");
        return [];
    }
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FreeItem));
    return items;
  } catch (error) {
    console.error("Error fetching items from Firestore:", error);
    throw new Error("Could not fetch items from the database.");
  }
}

export async function seedDatabase(): Promise<number> {
    try {
        const itemsCollection = collection(db, ITEMS_COLLECTION);
        const snapshot = await getDocs(itemsCollection);

        if (!snapshot.empty) {
            throw new Error("Database is not empty. Seeding aborted to prevent duplicate data.");
        }

        const batch = writeBatch(db);
        mockFreeItems.forEach(item => {
            const { id, ...data } = item;
            const docRef = collection(db, ITEMS_COLLECTION).doc(id);
            batch.set(docRef, data);
        });

        await batch.commit();
        console.log(`Successfully seeded ${mockFreeItems.length} items.`);
        return mockFreeItems.length;

    } catch(error) {
        console.error("Error seeding database:", error);
        throw error;
    }
}
