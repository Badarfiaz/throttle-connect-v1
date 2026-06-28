import { firebaseAuth } from "@/firebase";
import { User, getIdToken, onAuthStateChanged } from "firebase/auth";

/**
 * Returns a resolved Firebase ID token and uid.
 *
 * Firebase restores the auth session asynchronously on page load.
 * `firebaseAuth.currentUser` is null until that hydration is done, so
 * calling it synchronously right after mount gives a false "not logged in".
 *
 * This helper waits up to 5 s for the auth state to settle before resolving.
 */
const getFirebaseToken = async (defaultUser?: User | null) => {
  // If a user object was explicitly passed in, use it directly.
  if (defaultUser) {
    return { token: await getIdToken(defaultUser), uid: defaultUser.uid };
  }

  // If currentUser is already available (session already restored), use it.
  if (firebaseAuth.currentUser) {
    const user = firebaseAuth.currentUser;
    return { token: await getIdToken(user), uid: user.uid };
  }

  // Otherwise wait for Firebase to finish restoring the session.
  // onAuthStateChanged fires exactly once with the restored user (or null).
  const user = await new Promise<User | null>((resolve) => {
    const timeout = setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, 5000); // 5 second safety timeout

    const unsubscribe = onAuthStateChanged(firebaseAuth, (resolvedUser) => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(resolvedUser);
    });
  });

  if (!user) return { token: null, user: null, uid: null };
  return { token: await getIdToken(user), uid: user.uid };
};

export default getFirebaseToken;
