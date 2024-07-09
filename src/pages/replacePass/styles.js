import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    formTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#F2911B',
      margin: 10,
    },
    formInput: {
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
    subContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      margin: 10,
      padding: 10,
    },
    sendButton: {
        backgroundColor: '#F2911B',
        borderRadius: 8,
        marginHorizontal: 20,
        padding: 10,
        width: 100,
        alignItems: 'center'
    },
    textButton: {
      color: 'white',
        fontWeight: 'bold'
    },
});