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
        localStorage.setItem(clave, JSON.stringify(valor));
      } else {
        await AsyncStorage.setItem(clave, JSON.stringify(valor));
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

  const getAllKeys = useCallback(async () => {
    try {
      if (plataforma === 'web') {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          keys.push(localStorage.key(i));
        }
        return keys;
      } else {
        return await AsyncStorage.getAllKeys();
      }
    } catch (error) {
      console.error('Error obteniendo keys:', error);
      return [];
    }
  }, [plataforma]);

   const getKey = useCallback(async (clave) => {
    try {
      if (plataforma === 'web') {
        const valor = localStorage.getItem(clave);
        return valor ? JSON.parse(valor) : null;
      } else {
        const valor = await AsyncStorage.getItem(clave);
        return valor ? JSON.parse(valor) : null;
      }
    } catch (error) {
      console.error('Error obteniendo key:', error);
      return null;
    }
  }, [plataforma]);

  return {
    saveLocal,
    deleteLocal,
    getAllKeys,
    getKey
  };
};

export default useLocalStorage;