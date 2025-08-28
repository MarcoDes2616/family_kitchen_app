import { StyleSheet } from "react-native";
import AppInitializer from "./src/components/AppInitializer";
import { AppProvider } from "./src/context/AppContext";
import { InitializationProvider } from "./src/context/InitializationContext";
import AppContent from "./src/screens/AppContent";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <InitializationProvider>
          <AppProvider>
            <AppInitializer>
              <AppContent />
            </AppInitializer>
          </AppProvider>
        </InitializationProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
