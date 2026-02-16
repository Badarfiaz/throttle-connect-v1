import { firebaseAuth } from '@/firebase';
import { User, getIdToken } from 'firebase/auth';

const getFirebaseToken = async (defaultUser?: User | null) => {
  const user = defaultUser || firebaseAuth.currentUser;

  if (!user) return { token: null, user: null, uid: null };
  return { token: await getIdToken(user), uid: user.uid };
};

export default getFirebaseToken;
