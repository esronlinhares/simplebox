import { Pressable, Text, TextInput, View } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { styles } from "./styles";

export default function ReplacePass() {
    const [userMail, setUserMail] = useState('');
    const navigation = useNavigation();

    function replacePass() {
        if(userMail !== '') {
            sendPasswordResetEmail(auth, userMail)
            .then(() => {
                alert("Foi enviado um email para: " + userMail + ". Verifique a sua caixa de email.");
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert("Ops! Alguma cois não deu certo. " + errorMessage + ". Tente novamente ou pressione voltar");
                return;
            });
        } else {
            alert("É preciso informar um e-mail válido para efetuar a redefinição de senha");
            return;
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.formTitle}>Redefinição de Senha</Text>
            <TextInput 
                style={styles.formInput}
                placeholder="Informe o email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={userMail}
                onChangeText={setUserMail}
            />
            <Pressable
                style={styles.sendButton}
                onPress={replacePass}
            >
                <Text style={styles.textButton}>Enviar</Text>
            </Pressable>

            <View style={styles.subContainer}>
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text>Voltar</Text>
                </Pressable>
            </View>
        </View>
    );
}