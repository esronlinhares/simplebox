import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, Alert, Modal, Image, ImageBackground } from "react-native";
import { getDocs, query, collection, setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db, storage } from "../../services/firebaseConfig";
import RNPickerSelect from 'react-native-picker-select';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";
import { ModalQrCodeImagem } from '../../components/modal/qrcode';
import { ModalQrCodeEdit } from "../../components/modal/qrcodeEdit";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Spinner from 'react-native-loading-spinner-overlay';

//alteração do Ismael
//alterando mais
//mais um
//esron
// alteração do Esron agr foi?

export default function Ruas() {
  const [ruas, setRuas] = useState([]);
  const [ruaSelecionada, setRuaSelecionada] = useState(null);
  const [compartimentos, setCompartimentos] = useState([]);
  const [novaRua, setNovaRua] = useState("");
  const [novoCompartimento, setNovoCompartimento] = useState("");
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [selectedCompartimento, setSelectedCompartimento] = useState({ nome: "", qrCode: "" });
  const [loading, setLoading] = useState(false);
  const viewShotRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      await getRuas();
      await getCompartimentos();
    };
  
    fetchData();
  }, [ruaSelecionada]);

  async function getRuas() {
    try {
      const user = auth.currentUser;
      const q = query(collection(db, 'usuarios', user.uid, 'ruas'));
      const ruasSnapshot = await getDocs(q);

      const listaRuas = ruasSnapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome,
      }));

      setRuas(listaRuas);
    } catch (error) {
      console.error("Erro ao obter ruas:", error);
    }
  }

  async function getCompartimentos() {
    try {
      if (ruaSelecionada) {
        const user = auth.currentUser;
        const q = query(collection(db, 'usuarios', user.uid, 'ruas', ruaSelecionada, 'compartimentos'));
        const compartimentosSnapshot = await getDocs(q);

        const listaCompartimentos = compartimentosSnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
          qrCode: doc.data().qrCode,
        }));

        setCompartimentos(listaCompartimentos);
      } else {
        setCompartimentos([]);
      }
    } catch (error) {
      console.error("Erro ao obter compartimentos:", error);
    }
  }

  async function inserirNovaRua() {
    try {
      setLoading(true);

      if (novaRua.trim() === "") {
        Alert.alert("Erro", "Por favor, insira o nome da nova rua.");
        return;
      }

      const user = auth.currentUser;
      const ruasRef = collection(db, 'usuarios', user.uid, 'ruas');

      // Converte temporariamente para minúsculas para verificar duplicatas
      const nomeRuaMinusculo = novaRua.toLowerCase();

      // Busca a coleção de ruas do usuário
      const ruasSnapshot = await getDocs(ruasRef);

      // Verifica se já existe uma rua com o mesmo nome
      const ruaExistente = ruasSnapshot.docs.some(
        (ruaDoc) => ruaDoc.data().nome.toLowerCase() === nomeRuaMinusculo
      );

      if (ruaExistente) {
        Alert.alert("Erro", "Já existe uma rua com o mesmo nome.");
        return;
      }

      await setDoc(doc(ruasRef, novaRua), { nome: novaRua });

      Alert.alert("Sucesso", "Rua inserida com sucesso.");
      setNovaRua("");
      getRuas();
    } catch (error) {
      console.error("Erro ao inserir nova rua:", error);
    } finally {
      setLoading(false);
    }
  }

  async function inserirNovoCompartimento() {
    try {
      setLoading(true);

      if (novoCompartimento.trim() === "") {
        Alert.alert("Erro", "Por favor, insira o nome do novo compartimento.");
        return;
      }

      if (!ruaSelecionada) {
        Alert.alert("Erro", "Por favor, selecione uma rua antes de adicionar um compartimento.");
        return;
      }

      // Converte temporariamente para minúsculas para verificar duplicatas
      const nomeCompartimentoMinusculo = (ruaSelecionada + ' - ' + novoCompartimento).toLowerCase();

      // Busca a coleção de compartimentos na rua selecionada
      const compartimentosRef = collection(db, 'usuarios', auth.currentUser.uid, 'ruas', ruaSelecionada, 'compartimentos');

      // Busca todos os compartimentos da rua selecionada
      const compartimentosSnapshot = await getDocs(compartimentosRef);

      // Verifica se já existe um compartimento com o mesmo nome (considerando a forma original de capitalização)
      const compartimentoExistente = compartimentosSnapshot.docs.some(
        (compDoc) => compDoc.data().nome.toLowerCase() === nomeCompartimentoMinusculo
      );

      if (compartimentoExistente) {
        Alert.alert("Erro", "Já existe um compartimento com o mesmo nome nesta rua.");
        return;
      }

      // Captura a visualização do QRCode como uma imagem
      const uri = await viewShotRef.current.capture();
      
      // Faz o upload da imagem para o Firebase Storage
      const imageName = `${ruaSelecionada}-${novoCompartimento}`;
      const storageRef = ref(storage, `qrcodes/${auth.currentUser.uid}/${imageName}.png`);

      const response = await fetch(uri);
      const blob = await response.blob();

      const uploadTask = uploadBytesResumable(storageRef, blob);

      // Acompanha o progresso do upload
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Você pode acompanhar o progresso aqui, se necessário
        },
        async (error) => {
          console.error("Erro durante o upload da imagem:", error);
          Alert.alert("Erro", "Erro durante o upload da imagem.");
        },
        async () => {
          try {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Imagem enviada com sucesso para o Firebase Storage:", imageUrl);

            const compartimentosRef = collection(db, 'usuarios', auth.currentUser.uid, 'ruas', ruaSelecionada, 'compartimentos');
            await setDoc(doc(compartimentosRef, ruaSelecionada + ' - ' + novoCompartimento), {
              nome: `${ruaSelecionada} - ${novoCompartimento}`,
              qrCode: imageUrl,
            });

            getCompartimentos();

            setQrCodeImageUrl(imageUrl);

            setModalVisible(true);
          } catch (error) {
            console.error("Erro ao adicionar compartimento:", error);
            Alert.alert("Erro", "Erro ao adicionar compartimento.");
          }
        }
      );
    } catch (error) {
      console.error("Erro ao inserir novo compartimento:", error);
    } finally {
      setLoading(false);
    }
  }

  const baixarQrCode = async () => {
    try {
      if (!qrCodeImageUrl) {
        Alert.alert("Erro", "URL do QR Code não disponível.");
        return;
      }
  
      // Cria um diretório para armazenar os arquivos baixados
      const directory = `${FileSystem.cacheDirectory}qrcodes/`;
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  
      // Gera um nome único para o arquivo
      const fileName = `${ruaSelecionada}-${novoCompartimento}.png`;
  
      // Cria o caminho completo do arquivo
      const filePath = `${directory}${fileName}`;
  
      // Baixa o QR Code
      const { uri } = await FileSystem.downloadAsync(qrCodeImageUrl, filePath);
  
      // Salva o arquivo na galeria
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
  
      Alert.alert("Download Concluído", "A imagem foi baixada e salva na galeria com sucesso.");
    } catch (error) {
      console.error("Erro ao baixar ou salvar QR Code:", error);
      Alert.alert("Erro", "Erro ao baixar ou salvar QR Code.");
    }
  };

  const compartilharQrCode = async () => {
    try {
      if (!qrCodeImageUrl) {
        Alert.alert("Erro", "URL do QR Code não disponível.");
        return;
      }
  
      // Baixa a imagem e obtém o caminho local
      const localUri = await baixarImagemLocalmente(qrCodeImageUrl);
  
      // Compartilha o URI local da imagem
      await Sharing.shareAsync(localUri);

    } catch (error) {
      console.error("Erro ao realizar ação:", error);
      Alert.alert("Erro", "Erro ao realizar ação.");
    }
  };
  
  const baixarImagemLocalmente = async (imageUrl) => {
    // Cria um diretório para armazenar os arquivos baixados
    const directory = `${FileSystem.cacheDirectory}qrcodes/`;
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  
    // Gera um nome único para o arquivo
    const fileName = `${ruaSelecionada}-${novoCompartimento}.png`;
  
    // Cria o caminho completo do arquivo
    const filePath = `${directory}${fileName}`;
  
    // Baixa o arquivo
    const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
  
    return uri;
  };

  async function baixarQrCodeCompartimentoSelecionado() {
  try {
    if (!selectedCompartimento || !selectedCompartimento.qrCode) {
      Alert.alert("Erro", "URL do QR Code não disponível.");
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão Negada", "A permissão para acessar a biblioteca de mídia é necessária para baixar o QR Code.");
      return;
    }

    const directory = `${FileSystem.cacheDirectory}qrcodes/`;
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

    const fileName = `${selectedCompartimento.nome}.png`;
    const filePath = `${directory}${fileName}`;

    const { uri } = await FileSystem.downloadAsync(selectedCompartimento.qrCode, filePath);

    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);

    Alert.alert("Download Concluído", "A imagem foi baixada e salva na galeria com sucesso.");
  } catch (error) {
    console.error("Erro ao baixar ou salvar QR Code do compartimento:", error);
    Alert.alert("Erro", "Erro ao baixar ou salvar QR Code do compartimento.");
  }
}

  
  async function compartilharQrCodeCompartimentoSelecionado() {
    try {
      if (!selectedCompartimento || !selectedCompartimento.qrCode) {
        Alert.alert("Erro", "URL do QR Code não disponível.");
        return;
      }
  
      const localUri = await baixarImagemLocalmente(selectedCompartimento.qrCode);

      await Sharing.shareAsync(localUri);

    } catch (error) {
      console.error("Erro ao realizar ação:", error);
      Alert.alert("Erro", "Erro ao realizar ação.");
    }
  }
  

  async function deleteCompartimento() {
    try {
      if (!selectedCompartimento || !selectedCompartimento.nome) {
        Alert.alert("Erro", "Nenhum compartimento selecionado para exclusão.");
        return;
      }
  
      const user = auth.currentUser;
      const compartimentoRef = doc(db, 'usuarios', user.uid, 'ruas', ruaSelecionada, 'compartimentos', selectedCompartimento.nome);
  
      await deleteDoc(compartimentoRef);
  
      Alert.alert("Sucesso", "Compartimento excluído com sucesso.");
  
      getCompartimentos();
  
      setModalEditVisible(false);
    } catch (error) {
      console.error("Erro ao excluir compartimento:", error);
      Alert.alert("Erro", "Erro ao excluir compartimento.");
    }
  }
  
  return (
      <View style={styles.container}>
        <View style={styles.select}>
          <RNPickerSelect
            placeholder={{ label: 'Selecionar rua', value: null }}
            onValueChange={(value) => setRuaSelecionada(value)}
            items={ruas.map((rua) => ({
              label: rua.nome, value: rua.id,
            }))}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nova rua"
          onChangeText={(text) => setNovaRua(text)}
        />

        <Spinner
          visible={loading}
          textContent={'Inserindo...'}
          textStyle={styles.spinnerText}
        />

        <Pressable onPress={inserirNovaRua} style={styles.button} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'INSERINDO...' : 'INSERIR RUA'}</Text>
        </Pressable>

        <FlatList
          style={styles.lista}
          data={compartimentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => {
              setSelectedCompartimento({ nome: item.nome, qrCode: item.qrCode });
              setModalEditVisible(true);
            }}>
              <View style={styles.containerList}>
                <Text style={styles.textList}>{`${item.nome}`}</Text>
                <Image style={styles.imageList} source={{ uri: item.qrCode }}/>
              </View>
            </Pressable>
          )}
        />
        
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }}>
          {novoCompartimento && (
            <View style={styles.qrcode}>
            <QRCode value={ruaSelecionada + ' - ' + novoCompartimento} size={150}/>
          </View>
          )}
        </ViewShot>

        <TextInput
          style={styles.input}
          placeholder="Novo compartimento"
          onChangeText={(text) => setNovoCompartimento(text)}
        />

        <Pressable onPress={inserirNovoCompartimento} style={styles.button} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'INSERINDO...' : 'INSERIR COMPARTIMENTO'}</Text>
        </Pressable>

        <Modal visible={modalVisible} animationType='fade' transparent={true}>
          <ModalQrCodeImagem
            onClose={() => setModalVisible(false)}
            baixarQrCode={baixarQrCode}
            compartilharQrCode={compartilharQrCode}
            qrCodeImageUrl={qrCodeImageUrl}
          />
        </Modal>
        
        <Modal visible={modalEditVisible} animationType='fade' transparent={true}>
          <ModalQrCodeEdit
            onClose={() => setModalEditVisible(false)}
            baixarQrCodeCompartimentoSelecionado={baixarQrCodeCompartimentoSelecionado}
            compartilharQrCodeCompartimentoSelecionado={compartilharQrCodeCompartimentoSelecionado}
            deleteCompartimento={deleteCompartimento}
            qrCodeImageUrl={selectedCompartimento.qrCode}
          />
        </Modal>

      </View>
  );
}

const styles = StyleSheet.create({
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
