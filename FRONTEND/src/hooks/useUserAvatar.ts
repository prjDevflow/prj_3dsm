import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AVATAR_CHANGED_EVENT = 'avatarChanged';

export const useUserAvatar = () => {
  const { user } = useAuth();
  const key = `user_avatar_${user?.id ?? 'guest'}`;
  const [avatar, setAvatar] = useState<string | null>(() => localStorage.getItem(key));

  useEffect(() => {
    setAvatar(localStorage.getItem(key));
    const sync = () => setAvatar(localStorage.getItem(key));
    window.addEventListener(AVATAR_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AVATAR_CHANGED_EVENT, sync);
  }, [key]);

  return avatar;
};
