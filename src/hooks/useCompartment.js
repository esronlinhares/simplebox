import { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

export function useCompartment() {
    const [productsInCompartment, setProductsInCompartment] = useState([]);

    const findCompartment = async (compartmentName) => {
        const user = auth.currentUser;
        const ruasRef = collection(db, 'usuarios', user.uid, 'ruas');
        const q = query(ruasRef, where('nome', '==', compartmentName));
        const ruasSnapshot = await getDocs(q);

        let compartmentData = null;
        let ruaData = null;

        if (!ruasSnapshot.empty) {
            const ruaDoc = ruasSnapshot.docs[0];
            ruaData = ruaDoc.data();
            const compartimentosRef = collection(ruasRef, ruaDoc.nome, 'compartimentos');
            const compartimentosSnapshot = await getDocs(compartimentosRef);

            for (const compartimentoDoc of compartimentosSnapshot.docs) {
                if (compartimentoDoc.data().nome === compartmentName) {
                    compartmentData = compartimentoDoc.data();
                    const produtosRef = collection(compartimentosRef, compartimentoDoc.nome, 'produtos');
                    const produtosSnapshot = await getDocs(produtosRef);
                    const produtosList = produtosSnapshot.docs.map(doc => ({ ...doc.data(), nome: doc.nome }));
                    setProductsInCompartment(produtosList);
                    break;
                }
            }
        }

        return { compartmentData, ruaData };
    };

    return { productsInCompartment, findCompartment };
}