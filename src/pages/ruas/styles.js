import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#080326'
      
    },
    select:{
      borderRadius: 8,
      height: 40,
      width: '80%',
      marginTop: 60,
      fontSize: 16,
      color: 'black',
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center'
    },
    button:{
      backgroundColor: '#F2911B',
      borderRadius: 8,
      marginHorizontal: 20,
      padding: 10,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20
    },
    buttonText:{
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    },
    input:{
      borderRadius: 8,
      height: 40,
      width: '80%',
      paddingHorizontal: 15,
      fontSize: 16,
      backgroundColor: 'white',
      marginTop: 10
    },
    lista:{
      borderWidth: 2,
      borderRadius: 8,
      width: '80%',
      marginBottom: 20,
      backgroundColor: 'white',
      borderColor: '#F2911B'
    },
    containerList:{
      flexDirection: 'row',
      borderBottomWidth: 2,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: '#F2911B'
    },
    textList:{
      fontSize: 16
    },
    imageList:{
      height: 30,
      width: 30,
      marginLeft: 10
    },
    qrcode:{
      borderRadius: 8,
      padding: 10,
      backgroundColor: 'white'
    },
    spinnerText: {
        color: '#F26716',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});