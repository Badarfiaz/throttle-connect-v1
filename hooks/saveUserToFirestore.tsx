import { db } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

type User = {
  uid: string;
  email: string | null;
  name?: string;
  displayName?: string | null;
  phone?: string;
};

export const saveUserToFirestore = async (user: User) => {
  const docRef = doc(db, "users", user.uid);
  const existing = await getDoc(docRef);

  await setDoc(
    docRef,
    {
      name: user.displayName || user.name || "",
      email: user.email,
      userId: user.uid,
      clubId: null,
      membershipStatus: "none",
      ...(user.phone ? { phone: user.phone } : {}),
      // Only set createdAt on brand-new accounts
      ...(!existing.exists() ? { createdAt: serverTimestamp() } : {}),
    },
    { merge: true },
  );
};
