import { createContext, useState, useEffect } from "react";
import { lan } from "../utils/lenguages";
import { defaultsContent } from "../utils/defaultsContent";
const { storageKeys, language: defaultLan } = defaultsContent;
import { useDeviceId } from "../hooks/useDeviceId";
import useLocalStorage from "../hooks/useLocalStorage";

const InitializationContext = createContext();

export const InitializationProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppInitialized, setIsAppInitialized] = useState(true);
  const [initializationStep, setInitializationStep] = useState("app_ready");
  const [deviceId, setDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(defaultLan);

  const hookDeviceId = useDeviceId();
  const { saveLocal, getStorage } = useLocalStorage();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      setInitializationStep("checking_device");

      const storage = await getStorage();
      
      if (storage && storage.app_initialized) {
        setIsAppInitialized(true);
        setInitializationStep("app_ready");
        setIsLoading(false);
        return;
      }
      
      // if (storage) {
      //   setIsAppInitialized(true);
      //   setInitializationStep('device_ready');
      //   setIsLoading(false);
      //   return;
      // }

      // await initializeDevice();
    } catch (err) {
      setError("Error initializing app: " + err.message);
      setInitializationStep("error");
      setIsLoading(false);
    }
  };

  const initializeDevice = async () => {
    try {
      setInitializationStep("checking_device");

      // Verificar si ya existe un device_id en el storage
      const storedDeviceId = await getKey(storageKeys.deviceId);
      
      if (storedDeviceId) {
        setDeviceId(storedDeviceId);
        setInitializationStep("device_ready");
        await completeInitialization();
        return;
      }

      // Si no existe device_id, usar el hook
      if (hookDeviceId) {
        setDeviceId(hookDeviceId);
        // Guardar el device_id en el storage
        await saveLocal(storageKeys.deviceId, hookDeviceId);
        setInitializationStep("device_ready");
        await completeInitialization();
        return;
      }

      // Si no se puede obtener device_id de ninguna forma
      setError("No se pudo obtener un identificador del dispositivo");
      setInitializationStep("error");

    } catch (err) {
      setError("Error initializing device: " + err.message);
      setInitializationStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const completeInitialization = async () => {
    try {
      setInitializationStep("completing_initialization");
      
      // Marcar la app como inicializada en el storage
      await saveLocal(storageKeys.appInitialized, true);
      
      // Cargar lenguaje guardado si existe, sino usar el default
      const savedLanguage = await getKey(storageKeys.language);
      if (savedLanguage) {
        setLanguage(savedLanguage);
      } else {
        setLanguage(defaultLan);
        await saveLocal(storageKeys.language, defaultLan);
      }
      
      setIsAppInitialized(true);
      setInitializationStep("app_ready");
      
    } catch (err) {
      setError("Error completing initialization: " + err.message);
      setInitializationStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      // Guardar el lenguaje en el storage
      await saveLocal(storageKeys.language, newLanguage);
    } catch (err) {
      console.error("Error saving language:", err);
    }
  };

  const restartInitialization = async () => {
    try {
      setError(null);
      setIsLoading(true);
      setInitializationStep("checking_device");
      
      // Limpiar el estado de inicialización
      await saveLocal(storageKeys.appInitialized, false);
      setIsAppInitialized(false);
      
      // Reiniciar el proceso
      await initializeDevice();
      
    } catch (err) {
      setError("Error restarting initialization: " + err.message);
      setInitializationStep("error");
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    isAppInitialized,
    initializationStep,
    deviceId,
    error,
    restartInitialization,
    lan,
    language,
    handleChangeLanguage,
  };

  return (
    <InitializationContext.Provider value={value}>
      {children}
    </InitializationContext.Provider>
  );
};

export default InitializationContext;