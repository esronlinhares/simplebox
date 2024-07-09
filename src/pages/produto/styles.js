import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#080326'
    },
    image:{
        height: 320,
        width: 320,
        borderRadius: 8,
        backgroundColor: 'white'
    },
    buttonImage:{
        marginTop: 20,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#F2911B'
    },
    containerNome:{
        flexDirection: 'row',
        marginTop: 20,
        width: '80%',
        justifyContent: 'space-between'
    },
    inputNome:{
        borderRadius: 8,
        height: 40,
        width: 200,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: 'white'
    },
    inputQuantidade:{
        borderRadius: 8,
        height: 40,
        width: 100,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: 'white'
    },
    inputDescricao:{
        marginTop: 10,
        borderRadius: 8,
        height: 100,
        width: '80%',
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: 'white'
    },
    containerSelect:{
        width: '80%'
    },
    select:{
        borderRadius: 8,
        height: 40,
        width: '100%',
        marginTop: 20,
        fontSize: 16,
        color: 'black',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerButton:{
        flexDirection: 'row',
        marginTop: 20
    },
    button:{
        backgroundColor: '#F2911B',
        borderRadius: 8,
        marginHorizontal: 20,
        padding: 10,
        width: 100,
        alignItems: 'center'
    },
    buttonText:{
        color: 'white',
        fontWeight: 'bold'
    },
    spinnerText: {
        color: '#F26716',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})