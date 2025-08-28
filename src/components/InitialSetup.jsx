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

const InitialSetup = () => {
  const { handleChangeLanguage, deviceId, language, lan } = useContext(InitializationContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    language: "en",
    accessToken: "",
    device_id: deviceId || null,
  });

  const handleNext = async () => {
    if (step === 1) {
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

  const renderStep = () => {
  switch (step) {
    case 1:
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Bienvenido a Sara</Text>
          <Text style={styles.subtitle}>Elige tu idioma preferido</Text>

          <TouchableOpacity 
            style={[
              styles.languageButton, 
              formData.language === 'es' && styles.languageButtonSelected
            ]} 
            onPress={() => {
              setFormData({ ...formData, language: 'es' });
              handleChangeLanguage('es');
            }}
          >
            <Text style={styles.languageButtonText}>Español</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.languageButton, 
              formData.language === 'en' && styles.languageButtonSelected
            ]} 
            onPress={() => {
              setFormData({ ...formData, language: 'en' });
              handleChangeLanguage('en');
            }}
          >
            <Text style={styles.languageButtonText}>English</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.languageButton, 
              formData.language === 'pt' && styles.languageButtonSelected
            ]} 
            onPress={() => {
              setFormData({ ...formData, language: 'pt' });
              handleChangeLanguage('pt');
            }}
          >
            <Text style={styles.languageButtonText}>Português</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.button, 
              !formData.language && styles.buttonDisabled
            ]} 
            onPress={handleNext}
            disabled={!formData.language}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      );

    case 2:
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Bienvenido a Sara</Text>
          <Text style={styles.subtitle}>Configura tu experiencia</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={formData.username}
            onChangeText={(text) =>
              setFormData({ ...formData, username: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          <TouchableOpacity 
            style={[
              styles.button, 
              (!formData.username || !formData.email) && styles.buttonDisabled
            ]} 
            onPress={handleNext}
            disabled={!formData.username || !formData.email}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
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
    padding: 20,
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
});

export default InitialSetup;
