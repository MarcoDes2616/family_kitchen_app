import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RecipeApp = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [householdCode, setHouseholdCode] = useState('');

  const handleSearchRecipes = async () => {
    // Aquí integrarás con tu backend y Gemini AI
    Alert.alert('Buscando recetas', `Con ingredientes: ${ingredients}`);
    
    // Simulación temporal de respuesta
    const mockRecipes = [
      { id: '1', name: 'Tortilla de patatas', votes: 3, ingredients: 'patatas, huevos, cebolla' },
      { id: '2', name: 'Ensalada mixta', votes: 2, ingredients: 'lechuga, tomate, atún' },
      { id: '3', name: 'Pasta con tomate', votes: 5, ingredients: 'pasta, tomate, ajo' },
    ];
    setRecipes(mockRecipes);
  };

  const handleVote = (recipeId) => {
    // Lógica para votar por una receta
    Alert.alert('Votar', `Votaste por la receta ${recipeId}`);
  };

  const joinHousehold = () => {
    // Lógica para unirse a un hogar
    Alert.alert('Unirse a hogar', `Código: ${householdCode}`);
  };

  const renderRecipe = ({ item }) => (
    <View style={styles.recipeCard}>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeIngredients}>{item.ingredients}</Text>
        <Text style={styles.voteCount}>{item.votes} votos</Text>
      </View>
      <TouchableOpacity onPress={() => handleVote(item.id)} style={styles.voteButton}>
        <Icon name="thumb-up" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué comemos hoy?</Text>
      
      <View style={styles.householdSection}>
        <TextInput
          style={styles.input}
          placeholder="Código del hogar"
          value={householdCode}
          onChangeText={setHouseholdCode}
        />
        <TouchableOpacity style={styles.joinButton} onPress={joinHousehold}>
          <Text style={styles.buttonText}>Unirse</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa los ingredientes que tienes (separados por comas)"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchRecipes}>
          <Text style={styles.buttonText}>Buscar recetas</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={item => item.id}
        style={styles.recipesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  householdSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchSection: {
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recipesList: {
    flex: 1,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeIngredients: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  voteCount: {
    fontSize: 12,
    color: '#888',
  },
  voteButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 20,
  },
});

export default RecipeApp;