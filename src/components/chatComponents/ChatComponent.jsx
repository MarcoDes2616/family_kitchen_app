import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import backgroundImage from '../../../assets/bg_init.png'; // Asegúrate de tener una imagen de fondo adecuada

const ChatComponent = ({ 
  messages, 
  onSendMessage, 
  isTyping = false 
}) => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const renderMessage = ({ item }) => {
    const isSara = item.role === 'sara';
    
    return (
      <View style={[
        styles.messageContainer,
        isSara ? styles.saraMessage : styles.userMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isSara ? styles.saraBubble : styles.userBubble
        ]}>
          <Text style={[
            styles.messageText,
            isSara ? styles.saraText : styles.userText
          ]}>
            {item.content}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Fondo de Sara */}
      {backgroundImage && (
        <Image 
          source={backgroundImage} 
          style={styles.backgroundImage} 
          resizeMode="contain"
        />
      )}
      
      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Indicador de typing */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>Sara está escribiendo...</Text>
        </View>
      )}

      {/* Input de mensaje */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe tu respuesta..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            !inputText.trim() && styles.sendButtonDisabled
          ]} 
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
    zIndex: -1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  saraMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 4,
  },
  saraBubble: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#34C759',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  saraText: {
    color: 'white',
  },
  userText: {
    color: 'white',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
  },
  typingContainer: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  typingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ChatComponent;