import { useNavigation } from '@react-navigation/native'
import { useState } from 'react';
import { auth } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {View, Text, TextInput, StyleSheet, Image, Pressable} from 'react-native'

export default function Login(){
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    function handleSignIn() {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuário logado:", user.email);
            // Resetar os erros se o login for bem-sucedido
            setEmailError(null);
            setPasswordError(null);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Erro ao fazer login:", errorCode, errorMessage);
    
            // Configurar os estados de erro com base no código de erro retornado
            if (errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found') {
              setEmailError("E-mail incorreto ou não cadastrado");
            } else if (errorCode === 'auth/wrong-password') {
              setPasswordError("Senha incorreta");
            } else {
              // Lidar com outros tipos de erros
              console.error("Erro não tratado:", errorCode, errorMessage);
              setEmailError("Erro ao fazer login. Por favor, tente novamente.");
            }
          });
      }


    return(
        <View style={styles.container}>
            <Image
            source={require("../../images/logo.png")}
            style={styles.logo}
            />

            <View style={styles.containerInput}>
                <TextInput
                    style={[styles.input, emailError && styles.inputError]}  // Aplicar estilo de erro se houver um erro no e-mail
                    placeholder='Email'
                    onChangeText={text => {
                        setEmail(text);
                        // Limpar o erro quando o usuário começa a digitar novamente
                        setEmailError(null);
                    }}
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                <TextInput
                    style={[styles.input, passwordError && styles.inputError]}  // Aplicar estilo de erro se houver um erro na senha
                    placeholder='Senha'
                    secureTextEntry
                    onChangeText={text => {
                        setPassword(text);
                        // Limpar o erro quando o usuário começa a digitar novamente
                        setPasswordError(null);
                    }}
                />
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                <Pressable style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.textButton}>Entrar</Text>
                </Pressable>

                <View style={styles.containerTexto}>
                    <Text style={styles.textConta}>Ainda não possui uma conta? </Text>
                    <Pressable onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.textLink}>Criar conta</Text>
                    </Pressable>
                </View>

                <Text style={styles.textLink}>Esqueci minha senha</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo:{
        width: 230,
        height: 230,
        resizeMode: 'contain',
    },
    containerInput:{
        alignItems: 'center',
        width: "100%",
        marginTop: 30
    },
    input:{
        width: "80%",
        height: 40,
        paddingHorizontal: 15,
        borderWidth: 2,
        borderRadius: 8,
        alignItems: 'center',
        flexShrink: 0,
        borderRadius: 8,
        marginBottom: 20
    },
    button:{
        backgroundColor: "#080326",
        padding: 8,
        borderRadius: 8,
        height: 40,
        width: 80,
        alignItems: 'center'
    },
    textButton:{
        color: 'white',
        fontSize: 16
    },
    containerTexto:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 5
    },
    textConta:{
        fontSize: 16
    },
    textLink:{
        fontSize: 16,
        color: "#42B0CB"
    },
    inputError: {
        borderColor: 'red',  // Cor da borda quando há um erro
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
})