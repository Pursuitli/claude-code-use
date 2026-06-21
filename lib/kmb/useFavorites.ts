'use client';

/**
 * React hook over the favorites store. Keeps every mounted component in sync by
 * listening for a custom `kmb:favorites` event (dispatched on every mutation)
 * and the cross-tab `storage` event.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  type Favorite,
  getFavorites,
  isFavorite,
  toggleFavorite as toggleStore,
  removeFavorite as removeStore,
} from './favorites';

const EVENT = 'kmb:favorites';

function emit() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENT));
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const sync = () => setFavorites(getFavorites());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((fav: Omit<Favorite, 'id' | 'addedAt'>) => {
    setFavorites(toggleStore(fav));
    emit();
  }, []);

  const remove = useCallback((id: string) => {
    setFavorites(removeStore(id));
    emit();
  }, []);

  const has = useCallback((id: string) => isFavorite(id), [favorites]);

  return { favorites, toggle, remove, has };
}
