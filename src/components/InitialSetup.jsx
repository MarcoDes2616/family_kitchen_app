import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axiosInstance from "../services/axios";
import InitializationContext from "../context/InitializationContext";
import ChatComponent from "./chatComponents/ChatComponent";

const InitialSetup = () => {
  const { handleChangeLanguage, deviceId, language, lan } = useContext(InitializationContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    language: language || "en",
    user_token: "",
    device_id: deviceId || null,
  });

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      // Validar username y email
      if (!formData.username || !formData.email) {
        Alert.alert("Error", "Por favor completa todos los campos");
        return;
      }
      setStep(2);
      await sendAccessToken();
    } else if (step === 2) {
      // Validar token
      if (!formData.accessToken) {
        Alert.alert("Error", "Por favor ingresa el token de acceso");
        return;
      }
      await verifyAccessToken();
    }
  };

  const sendAccessToken = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/send-token", {
        email: formData.email,
        username: formData.username,
      });
      Alert.alert("Éxito", "Token enviado a tu correo electrónico");
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el token. Intenta nuevamente.");
    }
    setIsLoading(false);
  };

  const verifyAccessToken = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-token", {
        email: formData.email,
        token: formData.accessToken,
      });

      if (response.data.success) {
        // Token verificado exitosamente
        await completeSetup();
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Token inválido. Por favor verifica e intenta nuevamente."
      );
    }
    setIsLoading(false);
  };

  const completeSetup = async () => {
    try {
      // Aquí actualizarías el usuario con los datos completos
      // y agregarías los 1000 tokens de regalo
      const response = await axiosInstance.post("/auth/complete-setup", {
        email: formData.email,
        language: formData.language,
        giftTokens: 1000,
      });

      onComplete(response.data.user);
    } catch (error) {
      Alert.alert("Error", "No se pudo completar la configuración");
    }
  };

  const languagesOptions = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "pt", label: "Português" },
    { code: "fr", label: "Français" },
  ];

  const renderStep = () => {
  switch (step) {
    case 1:
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>{lan[language].init[step][0]}</Text>
          <Text style={styles.subtitle}>{lan[language].init[step][1]}</Text>
          {languagesOptions.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  formData.language === lang.code && styles.languageButtonSelected,
                ]}
                onPress={() => {
                  setFormData({ ...formData, language: lang.code });
                  handleChangeLanguage(lang.code);
                }}
              >
                <Text style={styles.languageButtonText}>{lang.label}</Text>
              </TouchableOpacity>
            ))
          }

          <TouchableOpacity 
            style={[
              styles.button, 
              !formData.language && styles.buttonDisabled
            ]} 
            onPress={handleNext}
            disabled={!formData.language}
          >
            <Text style={styles.buttonText}>{lan[language].init[step][2]}</Text>
          </TouchableOpacity>
        </View>
      );

    case 2:
      return (
        <View style={styles.chatContainer}>
          <ChatComponent
            messages={[]}
            onSendMessage={() => {}}
            language={formData.language}
            lan={lan}
          />
        </View>
      );
  }
};

  return <View style={styles.container}>{renderStep()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    width: "50%",
    height: "50%",
    top: 0,
    left: 0,
    opacity: 0.3,
  },

  stepContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chatContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 15,
  },
  languageButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  languageButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  languageButtonText: {
    fontSize: 16,
    color: '#333',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default InitialSetup;
