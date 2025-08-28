// components/InitialSetup.js
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import axiosInstance from "../services/axios";
import bg from "../../assets/bg_1.jpg";

const InitialSetup = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    language: "en",
    accessToken: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Verifica tu identidad</Text>
            <Text style={styles.subtitle}>
              Hemos enviado un token de acceso a {formData.email}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Token de acceso"
              value={formData.accessToken}
              onChangeText={(text) =>
                setFormData({ ...formData, accessToken: text })
              }
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleNext}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Verificando..." : "Verificar Token"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep(1)}>
              <Text style={styles.linkText}>Cambiar correo</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <ImageBackground source={bg} style={styles.container} resizeMode="cover">
      {renderStep()}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
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
