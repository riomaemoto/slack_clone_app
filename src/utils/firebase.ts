import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, QueryDocumentSnapshot } from "firebase/firestore";
import { ChannelType, UserType } from "./constants";

const firebaseConfig = {
  apiKey: "AIzaSyC0JYiaQb1Uu2TfwtOh0ts4UDSaRtZVoqQ",
  authDomain: "slackclone-61348.firebaseapp.com",
  projectId: "slackclone-61348",
  storageBucket: "slackclone-61348.appspot.com",
  messagingSenderId: "695883918061",
  appId: "1:695883918061:web:e491389ee45a548e3bbae4",
};

export const FB = initializeApp(firebaseConfig);
export const FA = getAuth(FB);
export const FS = getFirestore(FB);

export const userConverter = {
  fromFirestore: (ss: QueryDocumentSnapshot<UserType>) => {
    return ss.data();
  },
  toFirestore: (model: UserType) => model,
};

export const channelConverter = {
  fromFirestore: (ss: QueryDocumentSnapshot<ChannelType>) => {
    return ss.data();
  },
  toFirestore: (model: ChannelType) => model,
};
