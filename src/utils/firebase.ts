import { initializeApp } from "firebase/app";
// PKD
import { getAuth } from "firebase/auth";
import { getFirestore, QueryDocumentSnapshot } from "firebase/firestore";
import { RoomTyp, UserTyp } from "./types";
// PKD

const firebaseConfig = {
  apiKey: "AIzaSyC0JYiaQb1Uu2TfwtOh0ts4UDSaRtZVoqQ",
  authDomain: "slackclone-61348.firebaseapp.com",
  projectId: "slackclone-61348",
  storageBucket: "slackclone-61348.appspot.com",
  messagingSenderId: "695883918061",
  appId: "1:695883918061:web:e491389ee45a548e3bbae4",
};

export const FB = initializeApp(firebaseConfig);

// const PKD = "ここはただパックっただけでどこにあるか理解してない"
export const auth = getAuth(FB);
export const database = getFirestore(FB);
// PKD end
export const USER_DB = "users";
export const ROOM_DB = "rooms";

export const userConverter = {
  fromFirestore: (ss: QueryDocumentSnapshot<UserTyp>) => {
    return ss.data();
  },
  toFirestore: (model: UserTyp) => model,
};

export const roomConverter = {
  fromFirestore: (ss: QueryDocumentSnapshot<RoomTyp>) => {
    return ss.data();
  },
  toFirestore: (model: RoomTyp) => model,
};
