import React, { useEffect, useState } from 'react';
import { auth, db } from '../../services/firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { View, Text, TextInput, FlatList, Image, Pressable, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native';
import { ModalProdutoEdit } from '../../components/modal/produtoEdit';
import { styles } from './styles';

export default function Pesquisar() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [originalProdutos, setOriginalProdutos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState({ nome: "", compartimento: "", rua: ""});
  const [refreshing, setRefreshing] = useState(false);

  async function getProdutos() {
    const user = auth.currentUser;

    if (user) {
      try {
        const ruasRef = collection(db, 'usuarios', user.uid, 'ruas');
        const ruasSnapshot = await getDocs(ruasRef);

        const listaProdutos = [];

        for (const ruaDoc of ruasSnapshot.docs) {
          const compartimentosRef = collection(ruasRef, ruaDoc.id, 'compartimentos');
          const compartimentosSnapshot = await getDocs(compartimentosRef);

          for (const compartimentoDoc of compartimentosSnapshot.docs) {
            const produtosRef = collection(compartimentosRef, compartimentoDoc.id, 'produtos');
            const produtosSnapshot = await getDocs(produtosRef);

            for (const produtoDoc of produtosSnapshot.docs) {
              listaProdutos.push({
                id: produtoDoc.id,
                nome: produtoDoc.data().nome,
                quantidade: produtoDoc.data().quantidade,
                descricao: produtoDoc.data().descricao,
                rua: ruaDoc.id,
                compartimento: compartimentoDoc.id,
                imagem: produtoDoc.data().imagem,
              });
            }
          }
        }

        setOriginalProdutos(listaProdutos);
        setProdutos(listaProdutos);
      } catch (error) {
        console.error('Erro ao obter produtos:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    getProdutos();
  }, [refreshing]);

  useEffect(() => {
    if (searchText === '') {
      setProdutos(originalProdutos);
      return;
    }

    // Filtra os produtos com base no texto digitado
    const filteredProdutos = originalProdutos.filter((produto) =>
      produto.nome.toLowerCase().includes(searchText.toLowerCase())
    );
    setProdutos(filteredProdutos);
  }, [searchText, originalProdutos]);

  async function deleteProduto() {
    try {
      if (!selectedProduto || !selectedProduto.nome) {
        Alert.alert("Erro", "Nenhum compartimento selecionado para exclusão.");
        return;
      }
  
      const user = auth.currentUser;
      const produtoRef = doc(db, 'usuarios', user.uid, 'ruas', selectedProduto.rua, 'compartimentos', selectedProduto.compartimento, 'produtos', selectedProduto.nome);
  
      await deleteDoc(produtoRef);
  
      Alert.alert("Sucesso", "Produto excluído com sucesso.");
  
      // Update the list of compartments
      getProdutos();
  
      // Close the modal
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      Alert.alert("Erro", "Erro ao excluir produto.");
    }
  }
  
  return (
    <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color="#F2911B" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar"
            placeholderTextColor="#A9A9A9"
            onChangeText={(text) => setSearchText(text)}
          />
        </View>

        <View style={styles.lista}>
          {loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <FlatList
              data={produtos}
              renderItem={({ item }) => (
                <Pressable onLongPress={() => {
                  setSelectedProduto({ nome: item.nome, compartimento: item.compartimento, rua: item.rua});
                  setModalVisible(true);
                }}>
                  <View style={styles.itemContainer}>
                    <Image
                      style={styles.imagem}
                      source={{ uri: item.imagem }}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.textContainer2}> <Text style={styles.textContainer}>{`Nome: `}</Text>{item.nome}</Text>
                      <Text style={styles.textContainer2}> <Text style={styles.textContainer}>{`Quantidade: `}</Text>{item.quantidade}</Text>
                      <Text style={styles.textContainer2}> <Text style={styles.textContainer}>{`Descrição: `}</Text>{item.descricao}</Text>
                      <Text style={styles.textContainer2}> <Text style={styles.textContainer}>{`Local: `}</Text>{item.compartimento}</Text>
                    </View>
                  </View>
                </Pressable>
              )}
              onRefresh={async () => {
                setRefreshing(true);
                await getProdutos();
                setRefreshing(false);
              }}
              refreshing={refreshing}
            />
          )}
        </View>

        <Modal visible={modalVisible} animationType='fade' transparent={true}>
          <ModalProdutoEdit
            onClose={() => setModalVisible(false)}
            deleteProduto={deleteProduto}
          />
        </Modal>
      </View>
  );
}
