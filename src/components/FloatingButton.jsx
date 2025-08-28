import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import useLocalStorage from "../hooks/useLocalStorage";

const FloatingButton = () => {
  const [keys, setKeys] = useState([]);

  const { getStorage } = useLocalStorage();

  useEffect(() => {
    const fetchKeys = async () => {
      const keys = await getStorage();
      setKeys(keys);
    };
    fetchKeys();
  }, []);

  return (
    <View style={styles.container}>
      {keys.user_token && (
        <View style={styles.circle1}>
          <Text style={styles.textCircle}>To</Text>
        </View>
      )}
      {keys.user_data && (
        <View style={styles.circle2}>
          <Text style={styles.textCircle}>Da</Text>
        </View>
      )}
      {keys.initial_prompt_sent && (
        <View style={styles.circle3}>
          <Text style={styles.textCircle}>Pr</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 30,
    whidth: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#53808bff",
    borderWidth: 1,
    borderRadius: 50,
  },
  circle1: {
    backgroundColor: "#FF9500",
    width: 20,
  },
  circle2: {
    backgroundColor: "#34C759",
    width: 20,
  },
  circle3: {
    backgroundColor: "#FF3B30",
    width: 20,
  },
  textCircle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 20,
  },
});

export default FloatingButton;
