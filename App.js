import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import useAuth from './src/hooks/useAuth';
import AuthStack from './src/components/navigation/AuthStack';
import MainStack from './src/components/navigation/MainStack';

export default function App() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
