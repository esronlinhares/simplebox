import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#080326'
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 60,
      width: '80%',
      borderWidth: 2,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: 'white',
      borderColor: '#F2911B'
    },
    input: {
      flex: 1,
      height: 40,
      fontSize: 16,
    },
    searchIcon: {
      marginRight: 10,
    },
    itemContainer: {
      flexDirection: 'row',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      marginHorizontal: 10,
      alignItems: 'center',
      backgroundColor: "rgba(255, 255, 255, 0.8)"
    },
    imagem: {
      width: 80,
      height: 80,
      resizeMode: 'cover',
      borderRadius: 8,
      marginRight: 5
    },
    lista: {
      marginTop: 20,
      width: "100%",
      height: "85%"
    },
    textContainer: {
      fontSize: 16,
      flex: 1,
      fontWeight: 'bold'
    },
    textContainer2: {
      fontSize: 16,
      flex: 1
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });