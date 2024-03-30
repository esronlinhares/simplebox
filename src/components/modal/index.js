import {View, Text, StyleSheet, Pressable} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ModalImage({ onClose, onCameraPick, onImagePick }) {
    function handleOverlayPress(){
        onClose();
    }

    return (
        <View style={styles.container}>
          <Pressable style={styles.overlay} onPress={handleOverlayPress}>
            <View style={styles.content}>
              <View>
                <Pressable style={styles.button} onPress={() => { onCameraPick(); onClose(); }}>
                  <Ionicons name="camera" size={30} color="white" />
                  <Text style={styles.buttonText}>Abrir câmera</Text>
                </Pressable>
    
                <Pressable style={styles.button} onPress={() => { onImagePick(); onClose(); }}>
                  <Ionicons name="image" size={30} color="white" />
                  <Text style={styles.buttonText}>Abrir galeria</Text>
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
        padding: 10,
    },
    buttonText:{
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
        color: 'white',
        paddingLeft: 5
    }
})