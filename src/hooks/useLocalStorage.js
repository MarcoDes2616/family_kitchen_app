import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const useChatStorage = () => {
  const {
    storedValue: chatHistory,
    setValue: setChatHistory,
    updateValue: updateChatHistory,
    loading,
    error
  } = useLocalStorage('ai_chat_history', []);

  // Añadir un nuevo mensaje al historial
  const addMessage = useCallback(async (message) => {
    const newMessage = {
      ...message,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9) // ID único
    };

    const updatedHistory = [...chatHistory, newMessage];
    await setChatHistory(updatedHistory);
    return newMessage;
  }, [chatHistory, setChatHistory]);

  // Añadir un mensaje del usuario
  const addUserMessage = useCallback(async (content) => {
    return addMessage({
      role: 'user',
      content
    });
  }, [addMessage]);

  // Añadir un mensaje de la IA
  const addAssistantMessage = useCallback(async (content) => {
    return addMessage({
      role: 'assistant',
      content
    });
  }, [addMessage]);

  // Limpiar el historial de chat
  const clearChat = useCallback(async () => {
    await setChatHistory([]);
  }, [setChatHistory]);

  // Obtener el último mensaje
  const getLastMessage = useCallback(() => {
    if (chatHistory.length === 0) return null;
    return chatHistory[chatHistory.length - 1];
  }, [chatHistory]);

  // Obtener mensajes desde una fecha específica
  const getMessagesSince = useCallback((timestamp) => {
    return chatHistory.filter(message => message.timestamp >= timestamp);
  }, [chatHistory]);

  return {
    chatHistory,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    clearChat,
    getLastMessage,
    getMessagesSince,
    loading,
    error
  };
};

export default useChatStorage;