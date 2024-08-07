import { useNavigation } from '@react-navigation/native'
import {View, Text, TextInput, Image, Pressable} from 'react-native'
import { auth, db } from '../../services/firebaseConfig';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { styles } from './styles';

export default function Register(){
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

    function handleRegister() {
        setEmailError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);

        if (!email || !password || !confirmPassword) {
            alert("Preencha todos os campos.");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("As senhas não coincidem.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                const userDocRef = doc(db, "usuarios", user.uid);

                setDoc(userDocRef, {
                    id: user.uid,
                    email: email,
                    senha: password
                });

                console.log("Usuário registrado:", user.email);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === 'auth/email-already-in-use') {
                    setEmailError("Este e-mail já está sendo utilizado.");
                } else if (errorCode === 'auth/invalid-email') {
                    setEmailError("E-mail inválido.");
                } else if (errorCode === 'auth/weak-password') {
                    setPasswordError("Senha fraca. Tente uma senha mais forte.");
                }

                console.log(errorCode, errorMessage);
            });
    }

    return (
        <View style={styles.container}>
            <Image
                source={require("../../images/logo.png")}
                style={styles.logo}
            />

            <View style={styles.containerInput}>
                <TextInput
                    style={[styles.input, emailError && styles.inputError]}
                    placeholder='Email'
                    onChangeText={text => {
                        setEmail(text);
                        setEmailError(null);
                    }}
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                <TextInput
                    style={[styles.input, passwordError && styles.inputError]}
                    placeholder='Senha'
                    secureTextEntry
                    onChangeText={text => {
                        setPassword(text);
                        setPasswordError(null);
                    }}
                />
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                <TextInput
                    style={[styles.input, confirmPasswordError && styles.inputError]}
                    secureTextEntry
                    placeholder='Confirmar senha'
                    onChangeText={text => {
                        setConfirmPassword(text);
                        setConfirmPasswordError(null);
                    }}
                />
                {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}

                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.textButton}>Registrar</Text>
                </Pressable>

                <View style={styles.containerTexto}>
                    <Text style={styles.textConta}>Já possui uma conta? </Text>
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.textLink} >Fazer login</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}