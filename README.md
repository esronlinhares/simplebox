# Simplebox - Sistema de Gerenciamento de Estoque

## Visão Geral
Este é um aplicativo de gerenciamento de estoque desenvolvido em React Native. Ele gera QR codes únicos para cada compartimento dentro de suas ruas, criando o endereçamento do seu próprio estoque. Posteriormente, realiza a leitura dos QR codes gerados para controlar a retirada dos produtos cadastrados dentro de seus respectivos compartimentos. O aplicativo utiliza o banco de dados Firebase Firestore e Expo BarCodeScanner para a leitura de QR codes.

## Estrutura do Projeto
A estrutura do projeto é organizada da seguinte forma:
- **components/**
- **hooks/**
- **images/**
- **pages/**
- **services/**
- **App.js**

## Tecnologias Utilizadas
- React Native
- Firebase Firestore
- Expo BarCodeScanner
- react-native-picker-select
- Node.js
- npm ou yarn

## Configuração e Instalação

### Pré-requisitos
- Node.js
- npm ou yarn
- Android Studio (para emulador) (não obrigatório)

### Passos para Instalação

1. **Clonar o repositório**
   ```sh
   git clone https://github.com/seu-usuario/seu-projeto.git

2. **Entrar no diretório do projeto**
   ```sh
   cd simplebox

3. **Instalar dependências**
   ```sh
   npm install

4. **Rodar o aplicativo**
   ```sh
   npx expo start

## Funcionalidades

### Leitura de QR Code
Utilizamos o Expo BarCodeScanner para leitura de QR codes. Quando um QR code é escaneado, buscamos o compartimento correspondente no Firestore.

### Listagem de Produtos
A listagem de produtos é feita através de consultas Firestore, exibindo todos os produtos dentro de um compartimento.

### Registro de Saída
Para registrar a saída de produtos, selecionamos o produto desejado e atualizamos o Firestore com as informações de retirada.

## Deploy

1. Para gerar os builds de produção, utilizamos o Expo:
   ```sh
   expo build:android
   expo build:ios  


## Contribuição

**1. Faça um fork do projeto.**

**2. Crie uma branch para sua feature (git checkout -b feature/fooBar).**

**3. Faça commit das suas alterações (git commit -m 'Add some fooBar').**

**4. Faça push para a branch (git push origin feature/fooBar).**

**5. Abra um Pull Request.**
