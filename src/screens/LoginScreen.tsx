import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { LoginCard } from '../components/login/LoginCard';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const { height } = Dimensions.get('window');

  const handleLogin = async () => {
    console.log('=== HANDLELOGIN CALLED ===');
    console.log('Stack trace:', new Error().stack);
    console.log('Credential:', credential);
    console.log('Password:', password);
    console.log('========================');
    
    if (!credential || !password) {
      console.log('ALERT: Please fill in all fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const success = await login(credential, password);
    setIsLoading(false);

    if (!success) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-purple-50'}`}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#f8faff'}
        translucent={false}
      />
      <SafeAreaView className="flex-1">
      
      {/* Background Overlay */}
      <View className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-purple-50'}`} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          bounces={false}
          nestedScrollEnabled={true}
        >
          {/* Header Section */}
          <View className="px-6 pt-6">
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Text className={`text-4xl font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Welcome to
                  </Text>
                </View>
                <Text className={`text-6xl font-bold -mt-1 ${isDark ? 'text-purple-600' : 'text-purple-600'} mb-2`}>
                  Pulz
                </Text>
                <Text className={`text-lg mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-xs leading-relaxed`}>
                  Your gateway to amazing experiences and connections
                </Text>
              </View>
              <View className="mt-2">
                <ThemeSwitch />
              </View>
            </View>
          </View>

          {/* Login Card Container */}
          <View className="flex-1 justify-center" >
            <LoginCard
              credential={credential}
              setCredential={setCredential}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isLoading={isLoading}
              handleLogin={handleLogin}
              navigation={navigation}
            />
          </View>

          {/* Bottom spacing for keyboard */}
          <View className="h-20" /> 
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};