import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

export default function useAuthListener() {
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const auth = getAuth();
  const history = useHistory();
  useEffect(() => {
    const authListener = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebas.google.com/docs/reference/js/firebase.User

        setUser(authUser);
      } else {
      }
      setLoading(false);
    });
    return () => authListener();
  }, []);
  useEffect(() => {
    if (!loading && !user) {
      history.push('/login');
    }
  }, [user, loading]);

  return { user, loading };
}
