import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Login from './src/pages/login';
import Register from './src/pages/register';
import Pesquisar from './src/pages/pesquisar';
import Produto from './src/pages/produto';
import Ruas from './src/pages/ruas';
import Retirada from './src/pages/retirada';
import Perfil from './src/pages/perfil';
import { auth } from './src/services/firebaseConfig';
import { View } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {

  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#0A1126',
      tabBarStyle: {
        display: 'flex',
        borderTopWidth: 0,
      },
      tabBarBackground: () => (
        <View style={{ flex: 1, backgroundColor: '#F2911B' }} />
      )
    }}
    >
      <Tab.Screen
        name="Início"
        component={Pesquisar}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons size={size} color={color} name={focused ? 'home' : 'home-outline'} />
          ),
        }}
      />

      <Tab.Screen
        name="Produto"
        component={Produto}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons size={size} color={color} name={focused ? 'cube' : 'cube-outline'} />
          ),
        }}
      />

      <Tab.Screen
        name="Endereço"
        component={Ruas}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons size={size} color={color} name={focused ? 'location' : 'location-outline'} />
          ),
        }}
      />

      <Tab.Screen
        name="Retirar"
        component={Retirada}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons size={size} color={color} name={focused ? 'qr-code' : 'qr-code-outline'} />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color}) => (
            <Ionicons size={size} color={color} name={focused ? 'person' : 'person-outline'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
