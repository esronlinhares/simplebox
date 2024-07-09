import { useEffect, useState } from 'react';
import { auth } from '../services/firebaseConfig';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return { user };
}