import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo:{
        width: 230,
        height: 230,
        resizeMode: "contain",
    },
    containerInput:{
        alignItems: 'center',
        width: "100%",
        marginTop: 30
    },
    input:{
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
    button:{
        backgroundColor: "#080326",
        padding: 8,
        borderRadius: 8,
        height: 40,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButton:{
        color: "white",
        fontSize: 16
    },
    containerTexto:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 5
    },
    textConta:{
        fontSize: 16
    },
    textLink:{
        fontSize: 16,
        color: "#42B0CB"
    },
    inputError: {
        borderColor: 'red',
    },

    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    }
})