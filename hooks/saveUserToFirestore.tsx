import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
type User = {
  uid: string;
  email: string | null;
  name?: string;
  displayName?: string | null;
};
// Save user to Firestore
export const saveUserToFirestore = async (user: User) => {
  console.log("user", user);
  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName || user.name || "",
    email: user.email,
    userId: user.uid,
  });
};
