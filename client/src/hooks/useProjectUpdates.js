import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase/config';

export const useProjectUpdates = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const projectRef = ref(database, `projects/${projectId}`);

    const unsubscribe = onValue(projectRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          setProject({ id: snapshot.key, ...snapshot.val() });
        } else {
          setProject(null);
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      off(projectRef);
    };
  }, [projectId]);

  return { project, loading, error };
}; 