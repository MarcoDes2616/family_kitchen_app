import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../services/axios';

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
  const [isLoading, setIsLoading] = useState(true);
  const [initialPromptSent, setInitialPromptSent] = useState(false);

  // Verificar si ya existe un token al iniciar la app
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('user_token');
      const storedUser = await AsyncStorage.getItem('user_data');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
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
      
      // Guardar en estado y async storage
      setUser(newUser);
      setToken(newToken);
      await AsyncStorage.setItem('user_token', newToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(newUser));
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
      const systemPrompt = {
        role: 'system',
        content: `Eres un asistente útil que genera recetas basadas en los ingredientes proporcionados por el usuario. 
        Debes comenzar saludando amablemente y presentándote como un asistente de recetas. 
        Luego, pregunta qué ingredientes tiene disponible el usuario en su hogar.
        
        Cuando el usuario te proporcione una lista de ingredientes, debes:
        1. Crear 2-3 recetas detalladas y sencillas
        2. Cada receta debe incluir un título atractivo
        3. Una lista clara de ingredientes necesarios
        4. Pasos de preparación fáciles de seguir
        5. Tiempo aproximado de preparación
        6. Dificultad (baja, media, alta)
        
        Sé creativo pero mantén las recetas realistas y fáciles de hacer en casa.`
      };

      await axiosInstance.post('/recipe/request', {
        messages: [systemPrompt]
      });
      
      setInitialPromptSent(true);
      await AsyncStorage.setItem('initial_prompt_sent', 'true');
    } catch (error) {
      console.error('Error sending initial prompt:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await axiosInstance.put(`/users/${user.id}`, userData);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Limpiar storage
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('user_data');
      
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
    generateTemporaryUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;