import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Prevents accessing a page via browser back/forward buttons 
 * if it contains sensitive data that should be re-verified.
 */
export const useHistorySecurity = (isSensitive: boolean, isUnlocked: boolean) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSensitive && !isUnlocked) {
      // If we are on a sensitive page but it's not unlocked (e.g. via back button)
      // Redirect to a safe state or the dashboard
      navigate('/dashboard', { replace: true });
    }

    // Push a dummy state to history to make it harder to just "back" into it
    // if the app was just closed/reopened.
    if (isSensitive && isUnlocked) {
      window.history.pushState(null, '', window.location.href);
      
      const handlePopState = () => {
        // If they click back, we force a reload or a lock
        window.location.reload();
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isSensitive, isUnlocked, navigate, location]);
};
