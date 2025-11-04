import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence, 
  GoogleAuthProvider, 
  signInWithCredential 
} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB1HNSdw0bPAnQgC7S6rCsZhYY7NyOOF1w",
  authDomain: "kitchen-aid-21749.firebaseapp.com",
  projectId: "kitchen-aid-21749",
  storageBucket: "kitchen-aid-21749.firebasestorage.app",
  messagingSenderId: "693208407811",
  appId: "1:693208407811:web:b340e1ff3854215219d336"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Función corregida para Google SignIn
async function googleSignIn() {
  try {
    const redirectUri = Linking.createURL('auth/google', {
      scheme: 'familykitchen'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=693208407811-g3k4qlt6rjgmf2s191e4ktdoovammjj3.apps.googleusercontent.com` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=openid%20profile%20email`;

    // USAR WebBrowser.openAuthSessionAsync EN LUGAR DE AuthSession.startAsync
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === 'success') {
      // Extraer el token de la URL de retorno
      const url = new URL(result.url);
      const idToken = url.searchParams.get('id_token');
      
      if (!idToken) {
        throw new Error('No se recibió el token de Google');
      }
      
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    } else if (result.type === 'cancel') {
      throw new Error('El usuario canceló el inicio de sesión');
    } else {
      throw new Error(`Error en autenticación: ${result.type}`);
    }
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
}

// Función alternativa más simple
async function simpleGoogleSignIn() {
  try {
    const provider = new GoogleAuthProvider();
    
    // Para web - esto abrirá el flujo de Google en el navegador
    if (Platform.OS === 'web') {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    }
    
    // Para móvil - usar redirect
    await signInWithRedirect(auth, provider);
    
  } catch (error) {
    console.error("Error simple Google SignIn:", error);
    throw error;
  }
}

// Función para manejar el redirect después del login
async function handleGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error manejando redirect:", error);
    throw error;
  }
}

export { auth, googleSignIn, simpleGoogleSignIn, handleGoogleRedirect };
