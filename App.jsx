import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  StatusBar,
} from "react-native";
import AppInitializer from "./src/components/AppInitializer";
import { AppProvider } from "./src/context/AppContext";
import { InitializationProvider } from "./src/context/InitializationContext";
import AppContent from "./src/screens/AppContent";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  const scheme = useColorScheme(); // puede ser 'light' o 'dark'

  const isDarkMode = scheme === "dark";

  return (
    <InitializationProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: isDarkMode ? "#121212" : "#ffffffff" },
          ]}
        >
          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={isDarkMode ? "#000" : "#ffffffff"}
          />
          <AppInitializer>
            <AppProvider>
              <AppContent />
            </AppProvider>
          </AppInitializer>
        </SafeAreaView>
      </SafeAreaProvider>
    </InitializationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
});

export default App;
