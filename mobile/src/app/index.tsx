import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { saveToken } from '../utils/storage';
import api from './axioss';
import stylesBackground from './baseStyle';
import styles from './formStyle';

export default function LoginScreen() {
  const router = useRouter();

  const colorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const lightGradient = ['#2ba4f5', '#9eeff5'] as const;
  const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
  const gradientK = isDarkMode ? darkGradient : lightGradient;

  const theme = isDarkMode ? stylesBackground.darkTheme : stylesBackground.lightTheme;
  const loginTextTheme = isDarkMode ? styles.darkLoginText : styles.lightLoginText;
  const formBoxTheme = isDarkMode ? styles.formBoxDark : styles.formBoxLight;
  const loginInputTheme = isDarkMode ? styles.loginInputDark : styles.loginInputLight;
  const loginButtonTheme = isDarkMode ? styles.darkLoginButton : styles.lightLoginButton;
  const registerTextTheme = isDarkMode ? styles.darkRegisterText : styles.lightRegisterText;

  // login in with server
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      console.log("Sending logging form...");
      const response = await api.post('/login', {
        username: username,
        password: password,
      });
      console.log("Server response: ", response.data);
      const token = response.data.token;
      if (token) {
        await saveToken(token);
        router.replace('/contacts');
      } else {
        console.log('No token in response!');
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        alert("To be implemented!");
      } else if (error.request) {
        alert("Cannot connect with server.");
      } else {
        console.log("Ups... Something went wrong! ", error.message);
      }
    }
  }
  return (
    <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
      <SafeAreaView style={[stylesBackground.container]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.formBox, formBoxTheme]}>

          <Text style={[styles.loginText, loginTextTheme]}>Login</Text>

          <TextInput style={[styles.loginInput, loginInputTheme]}
            placeholder='Enter your username...'
            placeholderTextColor={isDarkMode ? '#fff' : '#fff'}
            value={username}
            onChangeText={setUsername} />
          <TextInput style={[styles.loginInput, loginInputTheme]}
            secureTextEntry placeholder='Enter your password...'
            placeholderTextColor={isDarkMode ? '#fff' : '#fff'}
            value={password}
            onChangeText={setPassword}
          />

          <Text style={[styles.registerText, registerTextTheme]}>You don't have an account? Create one <Text style={[styles.registerText, registerTextTheme]} onPress={() => router.push('/register')}>here.</Text></Text>

          <TouchableOpacity style={[styles.loginButton, loginButtonTheme]} onPress={() => handleLogin()}>
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}