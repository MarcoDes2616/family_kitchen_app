import { View, ActivityIndicator, Text } from 'react-native';
import InitialSetup from '../components/InitialSetup';
import InitializationContext from '../context/InitializationContext';
import { useContext } from 'react';

const AppInitializer = ({ children }) => {
  const {isLoading, initializationStep, lan, language, deviceId, isAppInitialized} = useContext(InitializationContext);

  if (isLoading || initializationStep === 'checking_device') {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>{lan[language].init['checking_device']}</Text>
      </View>
    );
  }

  if (initializationStep === 'error') {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff'
      }}>
        <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>
          {lan[language].init['error']}
        </Text>
      </View>
    );
  }

  if (initializationStep === 'device_ready') {
    return <InitialSetup deviceId={deviceId} />;
  }

  if (isAppInitialized && initializationStep === 'app_ready') {
    return children;
  }
};

export default AppInitializer;