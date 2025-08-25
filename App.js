import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Función para parsear el texto con saltos de línea y negritas
const parseText = (text) => {
  // Dividir por saltos de línea y filtrar líneas vacías
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  return lines.map((line, index) => {
    // Procesar negritas (**texto**)
    const parts = [];
    let currentIndex = 0;
    let boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(line)) !== null) {
      // Texto normal antes de la negrita
      if (match.index > currentIndex) {
        parts.push(
          <Text key={`${index}-${currentIndex}`} style={styles.normalText}>
            {line.substring(currentIndex, match.index)}
          </Text>
        );
      }
      
      // Texto en negrita
      parts.push(
        <Text key={`${index}-bold-${match.index}`} style={styles.boldText}>
          {match[1]}
        </Text>
      );
      
      currentIndex = match.index + match[0].length;
    }
    
    // Texto normal después de la última negrita
    if (currentIndex < line.length) {
      parts.push(
        <Text key={`${index}-end`} style={styles.normalText}>
          {line.substring(currentIndex)}
        </Text>
      );
    }
    
    // Si no hay negritas en esta línea
    if (parts.length === 0) {
      parts.push(
        <Text key={`${index}-plain`} style={styles.normalText}>
          {line}
        </Text>
      );
    }
    
    return (
      <Text key={index} style={styles.line}>
        {parts}
        {/* Agregar salto de línea al final de cada línea */}
        {index < lines.length - 1 && '\n'}
      </Text>
    );
  });
};

export default function App() {
  const recipeText = "¡Claro! Aquí tienes una receta deliciosa y fácil de preparar utilizando pollo, arroz, zanahoria, cebolla y salsa de soya. Esta receta es ideal para una comida casera llena de sabor.\n\n---\n\n### **Arroz Frito con Pollo y Verduras**\n\n#### **Ingredientes:**\n- 2 tazas de arroz cocido (preferiblemente frío o del día anterior)\n- 1 pechuga de pollo (aproximadamente 250 g), cortada en trozos pequeños\n- 1 zanahoria mediana, rallada o cortada en cubos pequeños\n- 1 cebolla mediana, picada finamente\n- 3 cucharadas de salsa de soya\n- 2 cucharadas de aceite vegetal (como aceite de girasol o de sésamo)\n- 1 diente de ajo, picado (opcional, para más sabor)\n- 1 cucharadita de jengibre rallado (opcional)\n- Sal y pimienta al gusto\n- Cebollín o perejil fresco para decorar (opcional)\n\n---\n\n#### **Preparación:**\n\n1. **Preparar los ingredientes:**\n   - Si el arroz no está cocido, cocínalo según las instrucciones del paquete y déjalo enfriar. El arroz frío funciona mejor para el arroz frito, ya que queda más suelto.\n   - Corta el pollo en trozos pequeños, pica la cebolla y ralla o corta la zanahoria en cubos pequeños. Si usas ajo y jengibre, pícalos finamente.\n\n2. **Saltear el pollo:**\n   - Calienta 1 cucharada de aceite en un wok o sartén grande a fuego medio-alto.\n   - Agrega el pollo, sazona con un poco de sal y pimienta, y cocina hasta que esté dorado y completamente cocido (unos 5-7 minutos). Retira el pollo de la sartén y resérvalo.\n\n3. **Saltear las verduras:**\n   - En la misma sartén, agrega la otra cucharada de aceite si es necesario.\n   - Añade la cebolla y la zanahoria, y saltea durante 3-4 minutos hasta que estén tiernas pero aún crujientes.\n   - Si usas ajo y jengibre, agrégalos en este paso y saltea por 1 minuto más hasta que estén fragantes.\n\n4. **Incorporar el arroz y los ingredientes restantes:**\n   - Agrega el arroz cocido y frío a la sartén, mezclando bien con las verduras.\n   - Vierte la salsa de soya sobre el arroz y revuelve para que se distribuya uniformemente.\n   - Regresa el pollo cocido a la sartén y mezcla todo junto. Cocina por 2-3 minutos más, revolviendo constantemente para que todos los sabores se integren.\n\n5. **Servir:**\n   - Prueba y ajusta el sazón si es necesario (más salsa de soya, sal o pimienta).\n   - Sirve caliente, decorado con cebollín o perejil fresco si lo deseas.\n\n---\n\n¡Disfruta de este plato reconfortante y lleno de sabor! Es perfecto para una comida rápida y nutritiva.";

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {parseText(recipeText)}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  textContainer: {
    width: '100%',
  },
  line: {
    marginBottom: 4,
    lineHeight: 20,
  },
  normalText: {
    fontSize: 16,
    color: '#333',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});