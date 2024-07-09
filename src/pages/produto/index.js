import { View, Text, TextInput, Pressable, Image, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker'
import { ModalImage } from '../../components/modal';
import RNPickerSelect from 'react-native-picker-select';
import { auth, db, storage } from '../../services/firebaseConfig';
import { getDocs, query, collection, setDoc, doc, serverTimestamp, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';

export default function Produto(){
    const [image, setImage] = useState(require('../../../assets/image-icon.png'));
    const [modalVisible, setModalVisible] = useState(false);
    const [ruas, setRuas] = useState([]);
    const [ruaSelecionada, setRuaSelecionada] = useState('');
    const [compartimentos, setCompartimentos] = useState([]);
    const [compartimentoSelecionado, setCompartimentoSelecionado] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);

    // Verifica se o usuário está autenticado
    const user = auth.currentUser;
    if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return null;
    }

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                if (user) await getRuas();
            };
            fetchData();
        }, [ruaSelecionada])
    );

    useEffect(() => {
        const fetchData = async () => {
          await getRuas();
        };
        fetchData();
    }, [ruaSelecionada]);

    function escolherImagem(){
        setModalVisible(true);
    }

    async function getRuas() {
        try {
            const q = query(collection(db, 'usuarios', user.uid, 'ruas'));
            const ruasSnapshot = await getDocs(q);
            const listaRuas = ruasSnapshot.docs.map(doc => ({
                id: doc.id,
                nome: doc.data().nome,
            }));
            setRuas(listaRuas);
        } catch (error) {
            console.error("Erro ao obter ruas:", error);
            Alert.alert("Erro", "Falha ao buscar ruas.");
        }
    }
    
    async function getCompartimentos(ruaId) {
        try {
          if (ruaId) {
            const q = query(collection(db, 'usuarios', user.uid, 'ruas', ruaId, 'compartimentos'));
            const compartimentosSnapshot = await getDocs(q);
    
            const listaCompartimentos = compartimentosSnapshot.docs.map(doc => ({
              id: doc.id,
              nome: doc.data().nome,
            }));
    
            setCompartimentos(listaCompartimentos);
          } else {
            setCompartimentos([]);
          }
        } catch (error) {
          console.error("Erro ao obter compartimentos:", error);
        }
    }

    async function handleImagePicker(){
        const result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4,4],
            allowsEditing: true,
            base64: true,
            quality: 1
        });

        if (!result.canceled){
            setImage(result.assets[0].uri);
        }
    }

    async function handleCameraPicker(){
        const result = await ImagePicker.launchCameraAsync({
            aspect: [4,4],
            allowsEditing: true,
            base64: true,
            quality: 1
        });

        if (!result.canceled){
            setImage(result.assets[0].uri);
        }
    }

    // Upload de imagem com verificação de tipo e tamanho
    async function uploadImageAndGetLink() {
        try {
            const imageUri = image;
            const fileExtension = imageUri.split('.').pop().toLowerCase();
            const validExtensions = ['jpg', 'png', 'jpeg'];
            if (!validExtensions.includes(fileExtension)) {
                throw new Error('Formato de arquivo não suportado.');
            }

            const imageName = `${nome}.${fileExtension}`;
            const storageRef = ref(storage, `imagens/${user.uid}/${imageName}`);

            const response = await fetch(imageUri);
            const blob = await response.blob();

            if (blob.size > 5000000) { // Limitar tamanho do arquivo a 5MB
                throw new Error('Arquivo muito grande.');
            }

            const uploadTask = uploadBytesResumable(storageRef, blob);
            await uploadTask;
            const downloadUrl = await getDownloadURL(storageRef);
            return downloadUrl;
        } catch (error) {
            console.error("Erro ao fazer upload da imagem:", error);
            Alert.alert("Erro", "Falha ao fazer upload da imagem.");
            throw error;
        }
    }

    async function cadastrarProduto(){
        try {
            setLoading(true);

            if (nome.trim() === "" || quantidade.trim() === "") {
                Alert.alert("Erro", "Por favor, insira o nome e a quantidade do produto");
                return;
            }
        
            if (!ruaSelecionada) {
                Alert.alert("Erro", "Por favor, selecione uma rua.");
                return;
            }

            if (!compartimentoSelecionado) {
                Alert.alert("Erro", "Por favor, selecione um compartimento.");
                return;
            }

            const produtosRef = collection(db, 'usuarios', user.uid, 'ruas', ruaSelecionada, 'compartimentos', compartimentoSelecionado, 'produtos');

            const existingProductQuery = query(produtosRef, where('nome', '==', nome));
            const existingProductSnapshot = await getDocs(existingProductQuery);
    
            if (!existingProductSnapshot.empty) {
                Alert.alert("Erro", "Já existe um produto com o mesmo nome neste compartimento.");
                return;
            }

            const timestamp = serverTimestamp();

            const imagemUrl = await uploadImageAndGetLink();

            await setDoc(doc(produtosRef, nome), {
            imagem: imagemUrl, 
            nome: nome, 
            quantidade: quantidade, 
            descricao: descricao,
            rua: ruaSelecionada, 
            compartimento: compartimentoSelecionado,
            dataHora: timestamp });

            setImage(image);

            Alert.alert("Sucesso", "Produto salvo com sucesso.");
        } catch (error) {
            console.error("Erro ao cadastrar o produto:", error);
        } finally {
            setLoading(false);
        }
    }

    async function limpar() {
        setImage(image);
    }

    return(
            <View style={styles.container}>
                <Pressable style={styles.buttonImage} onPress={escolherImagem}>
                    <Image
                    source={image}
                    style={styles.image}
                    />
                </Pressable>

                <Modal visible={modalVisible} animationType='fade' transparent={true}>
                    <ModalImage
                    onClose={() => setModalVisible(false)}
                    onCameraPick={handleCameraPicker}
                    onImagePick={handleImagePicker}
                    />
                </Modal>

                <View style={styles.containerNome}>
                    <TextInput
                    style={styles.inputNome}
                    placeholder='Nome do produto'
                    onChangeText={(text) => setNome(text)}
                    />

                    <TextInput
                    style={styles.inputQuantidade}
                    placeholder='Qntd.'
                    onChangeText={(text) => setQuantidade(text)}
                    />
                </View>

                <TextInput
                style={styles.inputDescricao}
                placeholder='Descrição'
                onChangeText={(text) => setDescricao(text)}
                multiline={true}
                numberOfLines={4}
                />

                <View style={styles.containerSelect}>

                    <View style={styles.select}>
                        <RNPickerSelect
                        placeholder={{ label: 'Selecionar rua', value: null }}
                        onValueChange={(value) => {
                            setRuaSelecionada(value);
                            getCompartimentos(value);
                        }}
                        items={ruas.map((rua) => ({
                            label: rua.nome,
                            value: rua.id,
                        }))}
                        />
                    </View>

                    <View style={styles.select}>
                        <RNPickerSelect
                        placeholder={{ label: 'Selecionar compartimento', value: null }}
                        onValueChange={(value) => {
                            setCompartimentoSelecionado(value);
                        }}
                        items={compartimentos.map((compartimento) => ({
                            label: compartimento.nome,
                            value: compartimento.id,
                        }))}
                        />
                    </View>
                </View>

                <Spinner
                    visible={loading}
                    textContent={'Salvando...'}
                    textStyle={styles.spinnerText}
                />

                <View style={styles.containerButton}>
                    <Pressable style={styles.button} onPress={cadastrarProduto} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'SALVANDO...' : 'SALVAR'}</Text>
                    </Pressable>

                    <Pressable style={styles.button} onPress={limpar}>
                        <Text style={styles.buttonText}>LIMPAR</Text>
                    </Pressable>
                </View>
            </View>
    
    )
}