import { Text, View, StatusBar, Platform, useWindowDimensions, StyleSheet, Image, ImageBackground } from "react-native";
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
  <View>
    <Text>
      App Content
    </Text>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppContent;