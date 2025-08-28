import { Text, View, StatusBar, Platform, useWindowDimensions, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import FloatingButton from "../components/FloatingButton";
import bg from '../../assets/bg_1.jpg';

const AppContent = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // Configurar la barra de estado
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
    StatusBar.setBarStyle('dark-content');
  }, []);

  // Calcular alturas seguras considerando las barras del sistema
  const getSafeAreaStyles = () => {
    if (Platform.OS === 'ios') {
      return {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1
      };
    } else {
      // Para Android, considerar la altura de la barra de estado
      const statusBarHeight = StatusBar.currentHeight || 0;
      return {
        paddingTop: statusBarHeight,
        flex: 1
      };
    }
  };

  return (
    <View style={[getSafeAreaStyles(), styles.container]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <FloatingButton />
      {/* <Image source={bg} style={{ position: 'absolute', width: '100%', height: '100%' }} /> */}
      {/* Contenido principal de tu aplicación */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>App Content</Text>
        <Text style={{ marginTop: 10 }}>Pantalla protegida para todas las plataformas</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bg})`,
    // backgroundColor: "#000"
  },
});

export default AppContent;