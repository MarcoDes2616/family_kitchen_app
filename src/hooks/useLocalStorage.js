import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos al inicializar
  useEffect(() => {
    loadStoredValue();
  }, [key]);

  // Cargar valor desde AsyncStorage
  const loadStoredValue = useCallback(async () => {
    try {
      setLoading(true);
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      } else {
        // Si no existe, inicializar con el valor proporcionado
        await AsyncStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue);
      }
    } catch (err) {
      console.error(`Error loading data for key ${key}:`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  // Guardar valor en AsyncStorage
  const setValue = useCallback(async (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(`Error saving data for key ${key}:`, err);
      setError(err);
    }
  }, [key, storedValue]);

  // Actualizar parcialmente un valor (ideal para objetos)
  const updateValue = useCallback(async (updates) => {
    try {
      const updatedValue = { ...storedValue, ...updates };
      setStoredValue(updatedValue);
      await AsyncStorage.setItem(key, JSON.stringify(updatedValue));
    } catch (err) {
      console.error(`Error updating data for key ${key}:`, err);
      setError(err);
    }
  }, [key, storedValue]);

  // Eliminar un valor específico
  const removeValue = useCallback(async () => {
    try {
      setStoredValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing data for key ${key}:`, err);
      setError(err);
    }
  }, [key, initialValue]);

  // Limpiar todos los datos (útil para logout)
  const clearAll = useCallback(async () => {
    try {
      setStoredValue(initialValue);
      await AsyncStorage.clear();
    } catch (err) {
      console.error('Error clearing all data:', err);
      setError(err);
    }
  }, [initialValue]);

  // Obtener todas las keys almacenadas
  const getAllKeys = useCallback(async () => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (err) {
      console.error('Error getting all keys:', err);
      setError(err);
      return [];
    }
  }, []);

  // Obtener múltiples valores
  const getMultiple = useCallback(async (keys) => {
    try {
      const values = await AsyncStorage.multiGet(keys);
      return values.map(([key, value]) => [key, value ? JSON.parse(value) : null]);
    } catch (err) {
      console.error('Error getting multiple values:', err);
      setError(err);
      return [];
    }
  }, []);

  return {
    storedValue,
    setValue,
    updateValue,
    removeValue,
    clearAll,
    getAllKeys,
    getMultiple,
    loading,
    error
  };
};

export default useLocalStorage;