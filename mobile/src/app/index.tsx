import { ensureUserHasKeys } from '@/utils/cryptoService';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import api from '../utils/axioss';
import ErrorModal from "../utils/errors";
import { saveToken, saveUserId } from '../utils/storage';
import stylesBackground from './styles/baseStyle';
import styles from './styles/formStyle';

export default function LoginScreen() {
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      console.log("Sending logging form...");
      const response = await api.post('/login', {
        username: username,
        password: password,
      });
      const authResponseDto = response.data;
      await saveUserId(authResponseDto.id.toString());
      const token = response.data.token;
      if (token) {
        await saveToken(token);
        router.replace('/mainPanel');
      }
      await ensureUserHasKeys();
    } catch (error: any) {
      if (error.response) {
        setIsModalVisible(true);
        const data = error.response?.data?.message || "Ups... something went wrong!";
        setErrorMessage(data);
      } else if (error.request) {
        setIsModalVisible(true);
        setErrorMessage("Cannot connect with server.");
      } else {
        setIsModalVisible(true);
        setErrorMessage("Ups... Something went wrong! ");
      }
    }
  }
  return (
    <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
      <SafeAreaView style={[stylesBackground.container]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorModal
          visible={isModalVisible}
          errorMessage={errorMessage}
          onClose={() => setIsModalVisible(false)}
        />
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