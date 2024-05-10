import { View, Text, StyleSheet, Pressable, Alert, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Perfil() {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            Alert.alert(
                'Confirmação',
                'Tem certeza de que deseja sair?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    },
                    {
                        text: 'Sair',
                        onPress: async () => {
                            await auth.signOut();
                            navigation.navigate('Login');
                        }
                    }
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };
    
    return (
            <View style={styles.container}>
                <Pressable style={styles.button} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={50} color="white" />
                    <Text style={styles.buttonText}>SAIR</Text>
                </Pressable>
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#080326'
    },
    button:{
        backgroundColor: '#F2911B',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8
    },
    buttonText:{
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
