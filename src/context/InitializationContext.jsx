import { createContext, useState, useEffect } from 'react';
import { useDeviceId } from '../hooks/useDeviceId';

const InitializationContext = createContext();

export const InitializationProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationStep, setInitializationStep] = useState('checking_device');
  const [deviceId, setDeviceId] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [error, setError] = useState(null);
  
  // Obtener el deviceId del hook
  const hookDeviceId = useDeviceId();

  // Efecto para inicializar el deviceId y información del dispositivo
  useEffect(() => {

    initializeDevice();
  }, [hookDeviceId]);


   const initializeDevice = async () => {
      try {
        setIsInitializing(true);
        setInitializationStep('checking_device');
        
        if (hookDeviceId) {
          setDeviceId(hookDeviceId);
          setDeviceInfo({
            id: hookDeviceId,
            platform: Platform.OS,
            timestamp: new Date().toISOString()
          });
          setInitializationStep('device_ready');
        }
        
      } catch (err) {
        setError('Error al inicializar el dispositivo');
        console.error('Initialization error:', err);
      } finally {
        setIsInitializing(false);
      }
    };

  // Función para reiniciar la inicialización
  const restartInitialization = async () => {
    setError(null);
    setIsInitializing(true);
    setInitializationStep('checking_device');
    // Aquí puedes agregar lógica adicional de reinicio si es necesario
  };

  const value = {
    isInitializing,
    initializationStep,
    deviceId,
    deviceInfo,
    error,
    restartInitialization
  };

  return (
    <InitializationContext.Provider value={value}>
      {children}
    </InitializationContext.Provider>
  );
};

export default InitializationContext;