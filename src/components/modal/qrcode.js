import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons'

export function ModalQrCodeImagem({ onClose, baixarQrCode, compartilharQrCode, qrCodeImageUrl }){
    function handleOverlayPress(){
        onClose();
    }
    
    return(
        <View style={styles.container}>
          <Pressable style={styles.overlay} onPress={handleOverlayPress}>
            <View style={styles.content}>
              <View>
                <Text style={styles.text}>Compartimento cadastrado!</Text>

                <Image source={{ uri: qrCodeImageUrl }} style={styles.qrCodeImage} />

                <Pressable style={styles.button} onPress={() => { baixarQrCode();}}>
                  <Ionicons name="download-outline" size={30} color="white" />
                  <Text style={styles.buttonText}>DOWNLOAD</Text>
                </Pressable>
    
                <Pressable style={styles.button} onPress={() => { compartilharQrCode();}}>
                  <Ionicons name="share-social-outline" size={30} color="white" />
                  <Text style={styles.buttonText}>COMPARTILHAR</Text>
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
        margin: 5,
        borderRadius: 8,
        padding: 10
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
        marginBottom: 10
    },
    text:{
      fontSize: 16,
      fontWeight: 'bold'
    }
})