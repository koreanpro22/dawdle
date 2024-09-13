import { firestore } from "@/lib/firebase/config";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

export const addEmail = async (email: string) => {
  const collectionRef = collection(firestore, "emails");

  const q = query(collectionRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) return "Email already exists"; // Email exists

  const newEmailRef = await addDoc(collectionRef, {
    email: email,
  });

  return newEmailRef;
};

export const getAllEmails = async (): Promise<any[]> => {
  const emailsRef = query(collection(firestore, "emails"));
  const emails = await getDocs(emailsRef);

  const emailList: any = [];

  emails.forEach((email: any) => {
    emailList.push(email.data());
  });

  return emailList;
};
