import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#080326'
    },
    button: {
      backgroundColor: '#F2911B',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20
    },
    textButton: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    },
    altButton: {
      backgroundColor: '#080326',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: 150,
      marginTop: 650
    },
    select: {
      borderRadius: 8,
      height: 40,
      width: '80%',
      marginTop: 20,
      fontSize: 16,
      color: 'black',
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center'
    },
    containerProduto: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    },
    imagemProduto: {
      height: 300,
      width: 300,
      borderRadius: 8,
      marginTop: 20
    },
    inputQuantidade: {
      borderRadius: 8,
      height: 40,
      paddingHorizontal: 15,
      fontSize: 16,
      backgroundColor: 'white'
    },
    inputNota: {
      marginTop: 10,
      borderRadius: 8,
      height: 130,
      width: '80%',
      paddingHorizontal: 15,
      fontSize: 16,
      backgroundColor: 'white'
    },
    text: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white'
    },
    containerQuantidade: {
      flexDirection: 'row',
      width: '80%',
      justifyContent: 'space-between',
      marginTop: 10,
      alignItems: 'center'
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F26716'
    }
});