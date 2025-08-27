import { View, ActivityIndicator, Text } from 'react-native';
import { useApp } from '../context/AppContext';

const AppInitializer = ({ children }) => {
  const { isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Configurando tu experiencia con IA...</Text>
      </View>
    );
  }

  return children;
};

export default AppInitializer;