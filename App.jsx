import AppInitializer from "./src/components/AppInitializer";
import { AppProvider } from "./src/context/AppContext";
import AppContent from "./src/screens/AppContent";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  return (
    <AppProvider>
      <AppInitializer>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </AppInitializer>
    </AppProvider>
  );
};

export default App;
