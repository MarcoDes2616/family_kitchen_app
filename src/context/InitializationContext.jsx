import { createContext, useState, useEffect } from "react";
import { lan } from "../utils/lenguages";
import { defaultsContent } from "../utils/defaultsContent";
const { storageKeys, language: defaultLan } = defaultsContent;
import { useDeviceId } from "../hooks/useDeviceId";
import useLocalStorage from "../hooks/useLocalStorage";
import axiosInstance from "../services/axios";

const InitializationContext = createContext();

export const InitializationProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [initializationStep, setInitializationStep] = useState("checking_device");
  const [deviceId, setDeviceId] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(defaultLan);
  const [userFound, setUserFound] = useState({});

  const hookDeviceId = useDeviceId();
  const { saveLocal, getStorage, deleteLocal } = useLocalStorage();

  useEffect(() => {
    initializeApp();
    // deleteStorage();
  }, []);

  const deleteStorage = async () => {
    try {
      await deleteLocal(storageKeys.appInitialized);
      await deleteLocal(storageKeys.deviceId);
      await deleteLocal(storageKeys.language);
    } catch (err) {
      console.error("Error deleting storage key:", err);
    }
  };

  const initializeApp = async () => {
    try {
      setIsLoading(true);

      const storage = await getStorage();
      console.log("Storage on init:", storage);
      
      if (storage && storage.app_initialized && !!storage.device_id) {
        setIsAppInitialized(true);
        setInitializationStep("app_ready");
        return;
      }
      
      if (storage.device_id) {
        setInitializationStep('device_ready');
        await fetchDeviceId(storage.device_id);
        return;
      } else {
        await initializeDevice();
      }

    } catch (err) {
      setInitializationStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeviceId = async (id) => {
    try {
      const {data} = await axiosInstance.get(`/system/check_device/${id}`);
      if(data.success){
        setInitializationStep("app_ready");
        setUserFound(data.user || {});
        return;
      }
    } catch (err) {
      console.error("Error fetching device ID:", err);
      setInitializationStep("error");
    }
  }

  const initializeDevice = async () => {
    try {
      if (hookDeviceId) {
        setDeviceId(hookDeviceId);
        await saveLocal(storageKeys.deviceId, hookDeviceId);
        setInitializationStep("device_ready");
        await completeInitialization();
        return;
      }

    } catch (err) {
      setInitializationStep("error");
    }
  };

  const completeInitialization = async () => {
    try {
      const savedLanguage = await getKey(storageKeys.language);
      if (savedLanguage) {
        setLanguage(savedLanguage);
      } else {
        setLanguage(defaultLan);
        await saveLocal(storageKeys.language, defaultLan);
      }
      
    } catch (err) {
      setInitializationStep("error");
    }
  };

  const handleChangeLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
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