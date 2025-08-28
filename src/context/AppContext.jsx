import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { defaultsContent } from '../utils/defaultsContent';
import useLocalStorage from '../hooks/useLocalStorage';
import { lan } from '../utils/lenguages';

const { storageKeys, language : defaultLan } = defaultsContent;

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialPromptSent, setInitialPromptSent] = useState(false);
  const [language, setLanguage] = useState(defaultLan);
  
  // Usar el hook de almacenamiento local
  const { saveLocal, deleteLocal, getKey, getStorage } = useLocalStorage();

  // Verificar si ya existe un token al iniciar la app
  useEffect(() => {
    // checkExistingAuth();
  }, []);

  const handleChangeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };


  const checkExistingAuth = async () => {
    try {
      const storedToken = await getKey(storageKeys.userToken);
      const storedUser = await getKey(storageKeys.userData);
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        await generateTemporaryUser();
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
      await generateTemporaryUser();
    } finally {
      setIsLoading(false);
    }
  };

  const generateTemporaryUser = async () => {
    try {
      setIsLoading(true);
      const username = `user_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await axiosInstance.post('/users', {
        username,
      });

      const { user: newUser, token: newToken } = response.data;
      
      // Guardar en estado y almacenamiento local
      setUser(newUser);
      setToken(newToken);
      await saveLocal(storageKeys.userToken, newToken);
      await saveLocal(storageKeys.userData, newUser);
      await sendInitialPrompt();
    } catch (error) {
      console.error('Error generating temporary user:', error);
      // Podríamos implementar un reintento o manejo de errores aquí
    } finally {
      setIsLoading(false);
    }
  };

  const sendInitialPrompt = async () => {
    try {
      const prompt = {
        role: 'system',
        content: lan[language]?.systemPrompt
      };

      await axiosInstance.post('/recipe/request', {
        messages: [prompt]
      });
      
      setInitialPromptSent(true);
      await saveLocal(storageKeys.initialPromptSent, true);
    } catch (error) {
      console.error('Error sending initial prompt:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await axiosInstance.put(`/users/${user.id}`, userData);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      await saveLocal(storageKeys.userData, updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Limpiar almacenamiento local usando las keys específicas
      await deleteLocal(storageKeys.userToken);
      await deleteLocal(storageKeys.userData);
      await deleteLocal(storageKeys.initialPromptSent);
      
      // Limpiar estado
      setUser(null);
      setToken(null);
      setInitialPromptSent(false);
      
      // Generar nuevo usuario temporal
      await generateTemporaryUser();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    initialPromptSent,
    updateUser,
    logout,
    generateTemporaryUser,
    handleChangeLanguage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;