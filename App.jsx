import AppInitializer from "./src/components/AppInitializer";
import { AppProvider } from "./src/context/AppContext";
import { InitializationProvider } from "./src/context/InitializationContext";
import AppContent from "./src/screens/AppContent";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  return (
    <InitializationProvider>
      <SafeAreaProvider>
        <AppProvider>
          <AppInitializer >
            <AppContent />
          </AppInitializer>
        </AppProvider>
      </SafeAreaProvider>
    </InitializationProvider>
  );
};

export default App;
