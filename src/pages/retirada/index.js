import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Image, TextInput, Alert, ImageBackground} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import RNPickerSelect from 'react-native-picker-select';
import { auth, db } from '../../services/firebaseConfig';
import { addDoc, getDocs, collection, serverTimestamp, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from './styles';

export default function Retirada() {
  const [modalVisible, setModalVisible] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [nota, setNota] = useState('');
  const [compartmentName, setCompartmentName] = useState('');
  const [productsInCompartment, setProductsInCompartment] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQRCodeButtonPress = () => {
    setModalVisible(true);
  };

  const handleQRCodeScanned = ({ data }) => {
    console.log('Código QR lido:', data);

    setCompartmentName(data);
    findCompartment(data);
    alert('Compartimento encontrado!');
    setModalVisible(false);
  };

  const findCompartment = async (compartmentName) => {
    try {
      const user = auth.currentUser;
      const ruasRef = collection(db, 'usuarios', user.uid, 'ruas');
      const ruasSnapshot = await getDocs(ruasRef);

      for (const ruaDoc of ruasSnapshot.docs) {
        const compartimentosRef = collection(ruasRef, ruaDoc.id, 'compartimentos');
        const compartimentosSnapshot = await getDocs(compartimentosRef);

        for (const compartimentoDoc of compartimentosSnapshot.docs) {
          const compartimentoData = compartimentoDoc.data();

          if (compartimentoData.nome === compartmentName) {
            console.log('Compartimento encontrado:', compartimentoData);

            const produtosRef = collection(compartimentosRef, compartimentoDoc.id, 'produtos');
            const produtosSnapshot = await getDocs(produtosRef);
            const produtosList = produtosSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setProductsInCompartment(produtosList);

            return { compartimentoData, ruaData: ruaDoc.data() };
          }
        }
      }
    } catch (error) {
      console.error('Erro ao consultar o banco de dados:', error);
    }
  };

  const handleRetirada = async () => {
    try {
      setLoading(true);

      const quantidadeRetirada = parseInt(quantity, 10);
  
      if (quantidadeRetirada <= 0 || isNaN(quantidadeRetirada)) {
        Alert.alert('Erro', 'Insira uma quantidade válida.');
        return;
      }
  
      if (!productDetails || quantidadeRetirada > productDetails.quantidade) {
        Alert.alert('Erro', 'Quantidade insuficiente no estoque.');
        return;
      }
  
      const { compartimentoData, ruaData } = await findCompartment(compartmentName);
  
      if (!compartimentoData || !ruaData) {
        Alert.alert('Erro', 'Compartimento ou rua não encontrados.');
        return;
      }
  
      const user = auth.currentUser;
      const ruasRef = collection(db, 'usuarios', user.uid, 'ruas');
      const compartimentosRef = collection(ruasRef, ruaData.nome, 'compartimentos');
      const produtosRef = collection(compartimentosRef, compartimentoData.nome, 'produtos');
  
      const produtoDocRef = productDetails?.id ? doc(produtosRef, productDetails.id) : null;
  
      if (!produtoDocRef) {
        console.error('Erro ao criar a referência do documento. productDetails.id está vazio ou indefinido.');
        return;
      }
  
      await updateDoc(produtoDocRef, {
        quantidade: (productDetails?.quantidade || 0) - quantidadeRetirada,
      });
  
      // Se a quantidade chegar a zero, exclui o produto
      if ((productDetails?.quantidade || 0) - quantidadeRetirada === 0) {
        await deleteDoc(produtoDocRef);
      }
  
      const saidaRef = collection(db, 'usuarios', user.uid, 'saida');
      const timestamp = serverTimestamp();
      await addDoc(saidaRef, {
        nome: productDetails?.nome,
        quantidade: quantidadeRetirada,
        rua: ruaData.nome,
        compartimento: compartimentoData.nome,
        nota: nota,
        dataHora: timestamp,
      });
  
      // Atualiza a lista de produtos após a retirada
      const updatedCompartment = await findCompartment(compartmentName);
      setProductsInCompartment(updatedCompartment.produtosList);
  
      setQuantity('');
      setMessage('');
      setProductDetails(null);
  
      Alert.alert('Sucesso', 'Retirada realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao processar a retirada:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao processar a retirada.');
    } finally {
      setLoading(false); // Close the spinner regardless of success or failure
    }
  };

  return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modal}>
            <BarCodeScanner
              onBarCodeScanned={handleQRCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />

            <Pressable
              style={styles.altButton}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textButton}>CANCELAR</Text>
            </Pressable>
            
          </View>
        </Modal>

        <View style={styles.select}>
          <RNPickerSelect
            placeholder={{ label: 'Selecione um produto', value: null }}
            onValueChange={(value) => {
              const selectedProduct = productsInCompartment?.find((product) => product.nome === value);
              setProductDetails(selectedProduct || null); // Garantindo que productDetails seja nulo se selectedProduct for indefinido
            }}
            items={productsInCompartment?.map((product) => ({ label: product.nome, value: product.nome })) || []}
          />
        </View>

        {productDetails && (
          <View style={styles.containerProduto}>
            <Image source={{ uri: productDetails?.imagem }} style={styles.imagemProduto} />

            <View style={styles.containerQuantidade}>
              <Text style={styles.text}>{`Quantidade: ${productDetails?.quantidade}`}</Text>

              <TextInput
                style={styles.inputQuantidade}
                placeholder="Quantidade"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>

            <TextInput
              style={styles.inputNota}
              placeholder="Nota"
              value={nota}
              onChangeText={setNota}
              multiline={true}
              numberOfLines={4}
            />

            <Spinner
              visible={loading}
              textContent={'Retirando...'}
              textStyle={styles.spinnerText}
            />

            <Pressable style={styles.button} onPress={handleRetirada} disabled={loading}>
              <Text style={styles.textButton}>{loading ? 'RETIRANDO...' : 'RETIRAR'}</Text>
            </Pressable>
          </View>
        )}

        <Pressable style={styles.button} onPress={handleQRCodeButtonPress}>
          <Text style={styles.textButton}>LER QR CODE</Text>
        </Pressable>
      </View>
  );
}

