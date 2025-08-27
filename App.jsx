import AppInitializer from './src/components/AppInitializer';
import { AppProvider } from './src/context/AppContext';


const App = () => {
  return (
    <AppProvider>
      <AppInitializer>
        {/* <AppContent /> */}
      </AppInitializer>
    </AppProvider>
  );
};

export default App;