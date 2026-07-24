import api from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import stylesBackground from './baseStyle';
import styles from './formStyle';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const theme = isDarkMode ? stylesBackground.darkTheme : stylesBackground.lightTheme;

  const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
  const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
  const gradientK = isDarkMode ? darkGradient : lightGradient;

  const loginTextTheme = isDarkMode ? styles.darkLoginText : styles.lightLoginText;
  const formBoxTheme = isDarkMode ? styles.formBoxDark : styles.formBoxLight;
  const loginInputTheme = isDarkMode ? styles.loginInputDark : styles.loginInputLight;
  const loginButtonTheme = isDarkMode ? styles.darkLoginButton : styles.lightLoginButton;
  const registerTextTheme = isDarkMode ? styles.darkRegisterText : styles.lightRegisterText;

  // registering
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      console.log("Sending register form...");
      const response = await api.post('/register', {
        username: username,
        email: email,
        password: password
      });
      console.log("Server response: ", response.data);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else if (error.request) {
        alert("Cannot connect with server.");
      } else {
        console.log("Ups... Something went wrong! ", error.message);
      }
    }
  };

  return (
    <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
      <SafeAreaView style={[stylesBackground.container]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.formBox, formBoxTheme]}>


          <Text style={[styles.loginText, loginTextTheme]}>Register</Text>


          <TextInput style={[styles.loginInput, loginInputTheme]}
            placeholder='Enter your username...'
            placeholderTextColor={isDarkMode ? '#fff' : '#fff'}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput style={[styles.loginInput, loginInputTheme]}
            placeholder='Enter your email...'
            placeholderTextColor={isDarkMode ? '#fff' : '#fff'}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput style={[styles.loginInput, loginInputTheme]}
            secureTextEntry placeholder='Enter your password...'
            placeholderTextColor={isDarkMode ? '#fff' : '#fff'}
            value={password}
            onChangeText={setPassword}
          />

          <Text style={[styles.registerText, registerTextTheme]}>You have an account? Log in <Text style={[styles.registerText, registerTextTheme]} onPress={() => router.push('/')}>here.</Text></Text>

          <TouchableOpacity style={[styles.loginButton, loginButtonTheme]} onPress={() => {
            console.log("Registering user...");
            console.log("Username: ", username);
            console.log("Email: ", email);
            console.log("Password: ", password);
          }}>
            <Text style={[styles.loginButtonText, loginButtonTheme]}>Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
