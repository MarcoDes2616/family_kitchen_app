import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import backgroundImage from "../../../assets/bg_init.jpg";
import { initialMessages } from "../../utils/initialMessages";
import InitializationContext from "../../context/InitializationContext";
import useLocalStorage from "../../hooks/useLocalStorage";

const ChatComponent = ({ formData, setFormData }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentSaraIndex, setCurrentSaraIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const flatListRef = useRef(null);

  const { requestUserToken, setInitializationStep, setIsAppInitialized} = useContext(InitializationContext)
  const { saveLocal } = useLocalStorage();

  useEffect(() => {
    // Lanzamos el primer mensaje de Sara
    if (initialMessages.length > 0) {
      simulateSaraMessage(initialMessages[0]);
    }
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();

    // flujo según el índice de Sara
    if (currentSaraIndex === 1) {
      // nombre
      setFormData((prev) => ({ ...prev, username: inputText.trim() }));
      simulateSaraMessage(initialMessages[2]);
    } else if (currentSaraIndex === 2) {
      // correo
      setFormData((prev) => ({ ...prev, email: inputText.trim() }));
      await requestUserToken({formData}); // enviar correo
      simulateSaraMessage(initialMessages[3]);
    } else if (currentSaraIndex === 3) {
      // token ingresado por el usuario
      setIsVerifying(true);
      simulateSaraMessage(initialMessages[4]);

      // aquí deberías validar el token con el backend
      setTimeout(() => {
        setIsVerifying(false);
        simulateSaraMessage(initialMessages[6]);
        setTimeout(() => simulateSaraMessage(initialMessages[7]), 2000);
      }, 2000);
    }
    setInputText("")
  }

  const handleContinue = async () => {
    setInitializationStep('app_ready');
    setIsAppInitialized(true);
    await saveLocal('app_initialized', true);
  };

  const simulateSaraMessage = (message) => {
    let currentText = "";
    setIsTyping(true);

    const newMessage = {
      ...message,
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();

    let i = 0;
    const interval = setInterval(() => {
      if (i < message.content.length) {
        currentText += message.content[i];
        updateLastMessage(currentText);
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setCurrentSaraIndex((prev) => prev + 1);
      }
    }, 40);
  };

  const updateLastMessage = (newContent) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content: newContent,
      };
      return updated;
    });
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => {
    const isSara = item.role === "sara";

    return (
      <View
        style={[
          styles.messageContainer,
          isSara ? styles.saraMessage : styles.userMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isSara ? styles.saraBubble : styles.userBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSara ? styles.saraText : styles.userText,
            ]}
          >
            {item.content}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  const isFinalStep = currentSaraIndex >= 7;

  return (
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Fondo */}
      {backgroundImage && (
        <Image source={backgroundImage} style={styles.backgroundImage} resizeMode="contain" />
      )}

      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={[...messages]} // invertir datos
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        // inverted // mensajes de abajo hacia arriba
      />

      {/* Input o botón continuar */}
      {!isFinalStep ? (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={24}
                color={!inputText.trim() ? "#ccc" : "#007AFF"}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%"
    // backgroundColor: "#1F2937", // mismo fondo que tu input
  },
  container: {
    flex: 1,
    width: "100%",
    // alignItems: "center",
    justifyContent: "center"
  },
  backgroundImage: {
    position: "absolute",
    width: "60%",
    height: "60%",
    top: -30,
    opacity: 0.8,
    zIndex: 0,
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexGrow: 1,
    height: "88%",
    justifyContent: "flex-end",
  },
  messageContainer: { marginBottom: 16, maxWidth: "85%" },
  saraMessage: { alignSelf: "flex-start" },
  userMessage: { alignSelf: "flex-end" },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  saraBubble: {
    backgroundColor: "#374151",
    borderBottomLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 6,
  },
  messageText: { fontSize: 16, lineHeight: 22, letterSpacing: 0.2 },
  saraText: { color: "#F3F4F6" },
  userText: { color: "#FFFFFF" },
  timestamp: {
    fontSize: 11,
    color: "#9CA3AF",
    alignSelf: "flex-end",
    marginTop: 2,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#374151",
    padding: 8,
    backgroundColor: "#1F2937",
    borderRadius: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#374151",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 50,
  },
  textInput: {
    flex: 1,
    color: "#F3F4F6",
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 8,
    paddingRight: 12,
    textAlignVertical: "top",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: { opacity: 0.5 },
  continueButton: {
    backgroundColor: "#007AFF",
    margin: 16,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});


export default ChatComponent;
