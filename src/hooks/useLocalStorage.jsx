import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLocalStorage = () => {
  const [plataforma, setPlataforma] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setPlataforma('web');
    } else {
      setPlataforma('native');
    }
  }, []);

  const saveLocal = useCallback(async (clave, valor) => {
    try {
      if (plataforma === 'web') {
        localStorage.setItem(clave, valor);
      } else {
        await AsyncStorage.setItem(clave, valor);
      }
      return true;
    } catch (error) {
      console.error('Error guardando:', error);
      return false;
    }
  }, [plataforma]);

  const deleteLocal = useCallback(async (clave) => {
    try {
      if (plataforma === 'web') {
        localStorage.removeItem(clave);
      } else {
        await AsyncStorage.removeItem(clave);
      }
      return true;
    } catch (error) {
      console.error('Error borrando:', error);
      return false;
    }
  }, [plataforma]);

  const getKey = useCallback(async (clave) => {
    try {
      if (plataforma === 'web') {
        const valor = localStorage.getItem(clave);
        return valor || null;
      } else {
        const valor = await AsyncStorage.getItem(clave);
        return valor || null;
      }
    } catch (error) {
      console.error('Error obteniendo key:', error);
      return null;
    }
  }, [plataforma]);

const getStorage = useCallback(async () => {
  try {
    if (plataforma === 'web') {
      const allData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          allData[key] = value || null;
        }
      }
      return allData;
    } else {
      const keys = await AsyncStorage.getAllKeys();
      const allData = {};
      
      for (const key of keys) {
        const value = await getKey(key);
        allData[key] = value || null;
      }
      return allData;
    }
  } catch (error) {
    console.error('Error obteniendo storage completo:', error);
    return {};
  }
}, [plataforma]);

   

  return {
    saveLocal,
    deleteLocal,
    getStorage,
    getKey
  };
};

export default useLocalStorage;