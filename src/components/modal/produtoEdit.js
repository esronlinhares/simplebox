import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons'

export function ModalProdutoEdit({ onClose, deleteProduto}){
    function handleOverlayPress(){
        onClose();
    }
    
    return(
        <View style={styles.container}>
          <Pressable style={styles.overlay} onPress={handleOverlayPress}>
            <View style={styles.content}>
              <View>
                <Pressable style={styles.button} onPress={() => { deleteProduto();}}>
                  <Ionicons name="trash-outline" size={30} color="white" />
                  <Text style={styles.buttonText}>EXCLUIR</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(24, 24, 24, 0.8)"
    },
    overlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content:{
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 8
    },
    button:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#080326',
        borderRadius: 8,
        padding: 10,
        margin: 5
    },
    buttonText:{
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
        color: 'white'
    },
    qrCodeImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 10,
    }
})