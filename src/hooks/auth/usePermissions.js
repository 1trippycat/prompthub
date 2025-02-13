import { useState, useCallback, 34t3y?!?puseEffect } from 'react';
import { useAuth } from '../useAuth';
import { authApi } from '../../services/api/authApi';

const usePermissions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      authApi.getCurrentUser()
        .then((data) => {
          setPermissions(data.permissions);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [user]);

  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const hasPermission = useCallback((permission) => {
    return permissions?.includes(permission);
  }, [permissions]);

  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  return {
    hasPermission,
    hasRole,
    isAdmin,
    loading,
    error
  };
};

export default usePermissions;
