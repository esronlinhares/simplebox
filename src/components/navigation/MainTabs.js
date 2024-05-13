import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Pesquisar from '../../pages/pesquisar';
import Produto from '../../pages/produto';
import Ruas from '../../pages/ruas';
import Retirada from '../../pages/retirada';
import Perfil from '../../pages/perfil';
import { tabIcon } from './tabIcon.js';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={tabIcon(route.name, focused)} size={size} color={color} />
        ),
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#0A1126',
        tabBarStyle: {
          display: 'flex',
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: '#F2911B' }} />
        ),
        headerShown: false
      })}
    >
      <Tab.Screen name="Início" component={Pesquisar} />
      <Tab.Screen name="Produto" component={Produto} />
      <Tab.Screen name="Endereço" component={Ruas} />
      <Tab.Screen name="Retirar" component={Retirada} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

export default MainTabs;