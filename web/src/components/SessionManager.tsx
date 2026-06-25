import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AUTO_LOGOUT_TIME = 10 * 60 * 1000; // 10 minutes of inactivity

export const SessionManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      toast('Session expired for security', { icon: '⏳' });
      window.location.href = '/login';
    } catch (error) {
      window.location.href = '/login';
    }
  };

  const resetTimer = () => {
    lastActivityRef.current = Date.now();
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    timerRef.current = setInterval(() => {
      if (Date.now() - lastActivityRef.current > AUTO_LOGOUT_TIME) {
        logout();
      }
    }, 10000); // Check every 10 seconds

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return <>{children}</>;
};
