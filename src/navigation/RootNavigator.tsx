import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';

export const RootNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <NavigationContainer>{user ? <TabNavigator /> : <AuthNavigator />}</NavigationContainer>;
};
