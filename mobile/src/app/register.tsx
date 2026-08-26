import OkModal from '@/utils/okResponse';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import api from "../utils/axioss";
import ErrorModal from "../utils/errors";
import stylesBackground from './styles/baseStyle';
import styles from './styles/formStyle';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isOkModalVisable, setIsOkModalVisable] = useState(false);
  const [okMessage, setOkMessage] = useState('');


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
  const [isUsernameNonValid, setIsUserNameNonValid] = useState<boolean>(false);
  const [isPasswordNonValid, setIsPasswordNonValid] = useState<boolean>(false);
  const [isEmailNonValid, setIsEmailNonValid] = useState<boolean>(false);

  const usernameInputStyle = isUsernameNonValid ? styles.loginInputInvalid : styles.loginUsernameInput;
  const emailInputStyle = isEmailNonValid ? styles.loginInputInvalid : styles.loginEmailInput;
  const passwordInputStyle = isPasswordNonValid ? styles.loginInputInvalid : styles.loginPasswordInput;
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  function goToActivation() {
    router.replace({ pathname: '/confirmAccount', params: { username: username } });
  }

  function containsSpecialChars(str: string): boolean {
    return str.split('').some(char => {
      const code = char.charCodeAt(0);

      const isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
      const isDigit = code >= 48 && code <= 57;
      const isSpace = code === 32;


      return !isLetter && !isDigit && !isSpace;
    });
  }
  function containsNumbers(str: string): boolean {
    return str.split('').some(char => {
      const code = char.charCodeAt(0);
      return code >= 48 && code <= 57;
    });
  }

  const handleRegistration = async () => {
    if (isUsernameNonValid || isEmailNonValid || isPasswordNonValid) return;
    try {
      console.log("Sending register form...");
      const response = await api.post('/register', {
        username: username,
        email: email,
        password: password
      });
      setOkMessage("Account has been created!");
      setIsOkModalVisable(true);
      await sleep(8500);
      goToActivation();

    } catch (error: any) {
      if (error.response) {
        const data = error.response?.data?.message || "Ups... something went wrong!";
        setErrorMessage(data);
        setIsModalVisible(true);
      } else if (error.request) {
        setErrorMessage("Cannot connect with server.");
        setIsModalVisible(true);
      } else {
        setErrorMessage("Ups... Something went wrong! ");
        setIsModalVisible(true);
      }
    }
  };
  function validateUsername(username: string) {
    setUsername(username);

    if (username.length > 0 && (username.length < 4 || username.length > 50 || containsSpecialChars(username))) {
      setIsUserNameNonValid(true);
    } else {
      setIsUserNameNonValid(false);
    }
  }

  function validatePassword(password: string) {
    setPassword(password);

    if (password.length > 0 && (password.length < 8 || !containsSpecialChars(password) || !containsNumbers(password))) {
      setIsPasswordNonValid(true);
    } else {
      setIsPasswordNonValid(false);
    }
  }

  function validateEmail(email: string) {
    setEmail(email);

    const emailParts = email.split('@');

    if (emailParts.length === 2) {
      const localPart = emailParts[0];
      const domainPart = emailParts[1];

      const domainParts = domainPart.split('.');

      if (domainParts.length === 2) {
        const domainName = domainParts[0];
        const tld = domainParts[1];

        if (localPart.length >= 1 && domainName.length >= 1 && tld.length >= 2) {
          setIsEmailNonValid(false);
          return;
        }
      }
    }

    setIsEmailNonValid(true);
  }

  return (
    <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
      <SafeAreaView style={stylesBackground.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <OkModal
          visible={isOkModalVisable}
          okMessage={okMessage}
          onClose={() => setIsOkModalVisable(false)}
        />
        <ErrorModal
          visible={isModalVisible}
          errorMessage={errorMessage}
          onClose={() => setIsModalVisible(false)}
        />
        <View style={[styles.formBox, formBoxTheme]}>


          <Text style={[styles.loginText, loginTextTheme]}>Signup</Text>


          <TextInput style={[loginInputTheme, usernameInputStyle]}
            placeholder='Enter your username...'
            placeholderTextColor={isDarkMode ? '#fff' : '#fff'}
            value={username}
            onChangeText={validateUsername}
          />
          {isUsernameNonValid && <Text style={styles.invalidUsername}>{"The username must be (4-50) characters long,\n and have no special characters."}</Text>}
          <TextInput style={[loginInputTheme, emailInputStyle]}
            placeholder='Enter your email...'
            placeholderTextColor={isDarkMode ? '#fff' : '#fff'}
            value={email}
            onChangeText={validateEmail}
          />
          {isEmailNonValid && <Text style={styles.invalidEmail}>The email is not valid.</Text>}
          <TextInput style={[loginInputTheme, passwordInputStyle]}
            secureTextEntry placeholder='Enter your password...'
            placeholderTextColor={isDarkMode ? '#fff' : '#fff'}
            value={password}
            onChangeText={validatePassword}
          />
          {isPasswordNonValid && <Text style={styles.invalidPassword}>{"The password needs to be at least 8 characters long,\n have at least one number, and one special sign."}</Text>}

          <Text style={[styles.registerText, registerTextTheme]}>You have an account? Log in <Text style={[styles.registerText, registerTextTheme]} onPress={() => router.push('/')}>here.</Text></Text>

          <TouchableOpacity style={[styles.loginButton, loginButtonTheme]} onPress={() => { handleRegistration() }}>
            <Text style={[styles.loginButtonText, loginButtonTheme]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
