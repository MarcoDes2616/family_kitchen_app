import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const getDeviceIdentifier = async () => {
      
      try {
        let identifier;
        
        // Para Android
        if (Platform.OS === 'android') {
          identifier = await Application.getAndroidId();
        } 
        // Para iOS
        else if (Platform.OS === 'ios') {
          identifier = Device.osBuildId;
        }
        // Para web
        else {
          // Usar una combinación de características del navegador
          identifier = await getWebFingerprint();
        }

        // Si no podemos obtener un ID nativo, crear uno persistente
        if (!identifier) {
          identifier = await createPersistentDeviceId();
        }

        setDeviceId(identifier);
      } catch (error) {
        setDeviceId(await createPersistentDeviceId());
      }
    };

    getDeviceIdentifier();
  }, []);  

  const getWebFingerprint = async () => {
    // Implementar fingerprinting para web
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset()
    ].join('|');
    
    return await hashString(components);
  };

  const createPersistentDeviceId = async () => {
    // Crear un ID único y persistente
    const storageKey = 'device_unique_id';
    
    try {
      // Intentar obtener ID existente
      const existingId = await AsyncStorage.getItem(storageKey);
      if (existingId) return existingId;

      // Crear nuevo ID
      const newId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem(storageKey, newId);
      return newId;
    } catch (error) {
      // Fallback: ID basado en timestamp
      return `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    }
  };

  const hashString = async (str) => {
    // Hash simple para strings
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash.toString();
  };

  return deviceId;
};

// export default useDeviceId;