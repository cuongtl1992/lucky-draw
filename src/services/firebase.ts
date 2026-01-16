import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import type { Participant, Winner, AppSettings } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Collections
const PARTICIPANTS_COLLECTION = 'participants';
const WINNERS_COLLECTION = 'winners';
const SETTINGS_COLLECTION = 'settings';

// Auth functions
export const loginAdmin = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = () => {
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get all used numbers
export const getUsedNumbers = async (): Promise<number[]> => {
  const snapshot = await getDocs(collection(db, PARTICIPANTS_COLLECTION));
  return snapshot.docs.map(doc => doc.data().number as number);
};

// Register participant with unique number (using transaction)
export const registerParticipant = async (
  name: string,
  email: string,
  minNumber: number = 1,
  maxNumber: number = 999
): Promise<Participant> => {
  return runTransaction(db, async (transaction) => {
    // Get all existing numbers
    const participantsSnapshot = await getDocs(collection(db, PARTICIPANTS_COLLECTION));
    const usedNumbers = new Set(participantsSnapshot.docs.map(doc => doc.data().number as number));

    // Check if email already registered
    const existingParticipant = participantsSnapshot.docs.find(
      doc => doc.data().email === email
    );

    if (existingParticipant) {
      const data = existingParticipant.data();
      return {
        id: existingParticipant.id,
        name: data.name,
        email: data.email,
        number: data.number,
        createdAt: (data.createdAt as Timestamp).toDate()
      } as Participant;
    }

    // Generate unique random number
    const availableNumbers: number[] = [];
    for (let i = minNumber; i <= maxNumber; i++) {
      if (!usedNumbers.has(i)) {
        availableNumbers.push(i);
      }
    }

    if (availableNumbers.length === 0) {
      throw new Error('Không còn số nào khả dụng!');
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];

    // Create new participant
    const participantRef = doc(collection(db, PARTICIPANTS_COLLECTION));
    const participantData = {
      name,
      email,
      number: newNumber,
      createdAt: serverTimestamp()
    };

    transaction.set(participantRef, participantData);

    return {
      id: participantRef.id,
      name,
      email,
      number: newNumber,
      createdAt: new Date()
    } as Participant;
  });
};

// Get all participants
export const getAllParticipants = async (): Promise<Participant[]> => {
  const snapshot = await getDocs(
    query(collection(db, PARTICIPANTS_COLLECTION), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      number: data.number,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date()
    } as Participant;
  });
};

// Get participant by number
export const getParticipantByNumber = async (number: number): Promise<Participant | null> => {
  const snapshot = await getDocs(
    query(collection(db, PARTICIPANTS_COLLECTION), where('number', '==', number))
  );
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    email: data.email,
    number: data.number,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date()
  } as Participant;
};

// Get all winners
export const getAllWinners = async (): Promise<Winner[]> => {
  const snapshot = await getDocs(
    query(collection(db, WINNERS_COLLECTION), orderBy('drawnAt', 'desc'))
  );
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      number: data.number,
      participantId: data.participantId,
      participantName: data.participantName,
      prize: data.prize,
      drawnAt: (data.drawnAt as Timestamp)?.toDate() || new Date()
    } as Winner;
  });
};

// Get winning numbers (numbers that have already won)
export const getWinningNumbers = async (): Promise<number[]> => {
  const winners = await getAllWinners();
  return winners.map(w => w.number);
};

// Save winner
export const saveWinner = async (
  number: number,
  participantId: string,
  participantName: string,
  prize: string
): Promise<Winner> => {
  const winnerRef = doc(collection(db, WINNERS_COLLECTION));
  const winnerData = {
    number,
    participantId,
    participantName,
    prize,
    drawnAt: serverTimestamp()
  };

  await setDoc(winnerRef, winnerData);

  return {
    id: winnerRef.id,
    number,
    participantId,
    participantName,
    prize,
    drawnAt: new Date()
  } as Winner;
};

// Get settings
export const getSettings = async (): Promise<AppSettings> => {
  const docRef = doc(db, SETTINGS_COLLECTION, 'config');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AppSettings;
  }

  // Default settings
  return {
    minNumber: 1,
    maxNumber: 999,
    eventName: 'Year End Party 2025'
  };
};

// Save settings
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  const docRef = doc(db, SETTINGS_COLLECTION, 'config');
  await setDoc(docRef, settings);
};

// Delete all winners (reset draw history)
export const deleteAllWinners = async (): Promise<void> => {
  const snapshot = await getDocs(collection(db, WINNERS_COLLECTION));
  const batch = writeBatch(db);
  snapshot.docs.forEach((document) => {
    batch.delete(document.ref);
  });
  await batch.commit();
};

// Delete all participants
export const deleteAllParticipants = async (): Promise<void> => {
  const snapshot = await getDocs(collection(db, PARTICIPANTS_COLLECTION));
  const batch = writeBatch(db);
  snapshot.docs.forEach((document) => {
    batch.delete(document.ref);
  });
  await batch.commit();
};

// Delete single winner
export const deleteWinner = async (winnerId: string): Promise<void> => {
  await deleteDoc(doc(db, WINNERS_COLLECTION, winnerId));
};
