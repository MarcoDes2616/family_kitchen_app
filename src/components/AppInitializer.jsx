// AppInitializer.js
import { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useApp } from '../context/AppContext';
import InitialSetup from '../components/InitialSetup';
// import WelcomeScreen from '../components/WelcomeScreen';
import deviceVerification from '../services/deviceVerification';

const AppInitializer = ({ children }) => {
  const { isLoading, user, updateUser } = useApp();
  const [showSetup, setShowSetup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [deviceChecked, setDeviceChecked] = useState(false);

  useEffect(() => {
    const initializeDeviceCheck = async () => {
      await deviceVerification.initialize();
      setDeviceChecked(true);
    };
    
    initializeDeviceCheck();
  }, []);

  useEffect(() => {
    // if (!isLoading && user && deviceChecked) {
    //   if (!user.email || !user.language) {
    //     setShowSetup(true);
    //   } else if (user.hasReceivedWelcomeGift === false && 
    //              await deviceVerification.canReceiveWelcomeGift()) {
    //     setShowWelcome(true);
    //   }
    // }
  }, [isLoading, user, deviceChecked]);

  const handleSetupComplete = async (updatedUser) => {
    updateUser(updatedUser);
    setShowSetup(false);
    
    // Verificar si puede recibir el regalo
    if (await deviceVerification.canReceiveWelcomeGift()) {
      setShowWelcome(true);
    }
  };

  const handleWelcomeComplete = async () => {
    // Marcar en el dispositivo y servidor que ya recibió el regalo
    await deviceVerification.markWelcomeGiftReceived();
    
    // Actualizar usuario
    await updateUser({ 
      hasReceivedWelcomeGift: true,
      tokens: (user.tokens || 0) + 1000 // Agregar los tokens
    });
    
    setShowWelcome(false);
  };

  if (isLoading || !deviceChecked) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Verificando dispositivo...</Text>
      </View>
    );
  }

  if (showSetup) {
    return <InitialSetup onComplete={handleSetupComplete} />;
  }

  // if (showWelcome) {
  //   return <WelcomeScreen onStart={handleWelcomeComplete} />;
  // }

  return children;
};

export default AppInitializer;