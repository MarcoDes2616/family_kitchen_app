import { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text
} from 'react-native';
import useLocalStorage from '../hooks/useLocalStorage';

const FloatingButton = () => {
  const [keys, setKeys] = useState([]);

  const {getAllkeys} = useLocalStorage();
  useEffect(() => {
    const fetchKeys = async () => {
      const keys = await getAllkeys();
      setKeys(keys);
    };
    fetchKeys();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.circle1}>
        <Text>...</Text>
      </View>
      <View style={styles.circle2}>
        <Text>...</Text>
      </View>
      <View style={styles.circle3}>
        <Text>...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    whidth: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#53808bff',
    borderWidth: 1,
    borderRadius: 50,
  },
  circle1: {
    backgroundColor: '#FF9500',
  },
  circle2: {
    backgroundColor: '#34C759',
  },
  circle3: {
    backgroundColor: '#FF3B30',
  },
});

export default FloatingButton;