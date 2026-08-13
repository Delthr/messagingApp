import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  formBox: {
    width: "80%",
    maxWidth: 350,
    alignSelf: "center",
    borderWidth: 1.5,
    borderRadius: 20,
    alignItems: 'center',
  },
  formBoxLight: {
    borderColor: '#fff',
  },
  formBoxDark: {
    borderColor: '#fff',
  },


  loginText: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
  },
  lightLoginText: {
    color: '#fff'
  },
  darkLoginText: {
    color: '#fff'
  },


  loginInputDark: {
    borderColor: '#fff',
    color: '#fff',
  },
  loginInputLight: {
    borderColor: '#fff',
    color: '#fff',
  },


  loginButton: {
    width: '20%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff27',
    color: '#fff',
    marginBottom: 30,
    borderColor: '#ffffff65',

    borderWidth: 1,
    borderTopWidth: 2,
    borderLeftWidth: 2,

    // IOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 5,

    // Android 
    elevation: 10,
  },
  darkLoginButton: {

  },
  lightLoginButton: {

  },
  loginButtonText: {
    margin: 5,
    color: '#fff',
  },
  darkLoginButtonText: {

  },
  lightLoginButtonText: {

  },

  registerText: {
    color: '#fff',
    fontSize: 10,
    paddingBottom: 20,
  },
  darkRegisterText: {

  },
  lightRegisterText: {

  },
  loginInput: {
    textShadowColor: '#000875',
    textShadowRadius: 10,
    elevation: 0.1,
    textAlign: 'center',
    fontSize: 17,
    width: '70%',
    alignSelf: 'center',
    marginBottom: 30,
    borderWidth: 1.5,
    borderRadius: 100,
  },
  invalidEmail: {
    color: "#f31b1b",
    fontWeight: '300',
    fontSize: 10,
    marginBottom: 16,
  },
  invalidPassword: {
    color: "#f31b1b",
    fontWeight: '300',
    fontSize: 10,
    marginBottom: 4,

  },
  invalidUsername: {
    color: "#f31b1b",
    fontWeight: '300',
    fontSize: 10,
    marginBottom: 4,
  },
  loginUsernameInput: {
    height: 28,
    textShadowColor: '#000875',
    textShadowRadius: 10,
    elevation: 0.1,
    textAlign: 'center',
    fontSize: 17,
    width: '70%',
    alignSelf: 'center',
    marginBottom: 34,
    borderWidth: 1.5,
    borderRadius: 100,
  },
  loginEmailInput: {
    height: 28,
    textShadowColor: '#000875',
    textShadowRadius: 10,
    elevation: 0.1,
    textAlign: 'center',
    fontSize: 17,
    width: '70%',
    alignSelf: 'center',
    marginBottom: 34,
    borderWidth: 1.5,
    borderRadius: 100,
  },
  loginPasswordInput: {
    height: 28,
    textShadowColor: '#000875',
    textShadowRadius: 10,
    elevation: 0.1,
    textAlign: 'center',
    fontSize: 17,
    width: '70%',
    alignSelf: 'center',
    marginBottom: 34,
    borderWidth: 1.5,
    borderRadius: 100,
  },
  loginInputInvalid: {
    height: 28,
    borderColor: '#dd1212',
    textShadowColor: '#000875',
    textShadowRadius: 10,
    elevation: 0.1,
    textAlign: 'center',
    fontSize: 17,
    width: '70%',
    alignSelf: 'center',
    marginBottom: 5,
    borderWidth: 1.5,
    borderRadius: 100,
  },
});
export default styles;