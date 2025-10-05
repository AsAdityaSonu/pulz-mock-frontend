import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { User, Mail, Lock, Eye, EyeOff, Phone, Calendar, Shield, Gamepad2 } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import apiService from '../services/api';

interface SignupScreenProps {
  navigation: any;
}

interface Game {
  _id: string;
  name: string;
  category: string;
  description?: string;
  popularity_score: number;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    password: '',
    confirmPassword: '',
    is_private: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const { register } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await apiService.getGames();
      setGames(response.games || []);
    } catch (error) {
      console.error('Failed to fetch games:', error);
      Alert.alert('Error', 'Failed to load games list');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleGameSelection = (gameName: string) => {
    setSelectedGames(prev => {
      if (prev.includes(gameName)) {
        return prev.filter(name => name !== gameName);
      } else if (prev.length < 3) {
        return [...prev, gameName];
      }
      return prev;
    });
  };

  const validateStep1 = () => {
    const { user_name, email, first_name, last_name, phone_number, password, confirmPassword } = formData;
    
    if (!user_name || !email || !first_name || !last_name || !phone_number || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (!formData.date_of_birth) {
      Alert.alert('Error', 'Please enter your date of birth');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (selectedGames.length !== 3) {
      Alert.alert('Error', 'Please select exactly 3 games');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleSignup = async () => {
    if (!validateStep2()) return;

    setIsLoading(true);
    
    try {
      const userData = {
        user_name: formData.user_name,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
        password: formData.password,
        is_private: formData.is_private,
        interests: selectedGames
      };

      const success = await register(userData);
      if (!success) {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Create Account
      </Text>

      <CustomInput
        icon={User}
        placeholder="Username"
        value={formData.user_name}
        onChangeText={(value) => handleInputChange('user_name', value)}
        autoCapitalize="none"
      />

      <View className="flex-row space-x-3">
        <View className="flex-1">
          <CustomInput
            icon={User}
            placeholder="First Name"
            value={formData.first_name}
            onChangeText={(value) => handleInputChange('first_name', value)}
          />
        </View>
        <View className="flex-1">
          <CustomInput
            icon={User}
            placeholder="Last Name"
            value={formData.last_name}
            onChangeText={(value) => handleInputChange('last_name', value)}
          />
        </View>
      </View>

      <CustomInput
        icon={Mail}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <CustomInput
        icon={Phone}
        placeholder="Phone Number (e.g., +1234567890)"
        value={formData.phone_number}
        onChangeText={(value) => handleInputChange('phone_number', value)}
        keyboardType="phone-pad"
      />

      <CustomInput
        icon={Calendar}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={formData.date_of_birth}
        onChangeText={(value) => handleInputChange('date_of_birth', value)}
      />

      <CustomInput
        icon={Lock}
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry={!showPassword}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      <CustomInput
        icon={Lock}
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry={!showConfirmPassword}
        rightIcon={showConfirmPassword ? EyeOff : Eye}
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      {/* Privacy Toggle */}
      <TouchableOpacity
        onPress={() => handleInputChange('is_private', (!formData.is_private).toString())}
        className={`flex-row items-center p-4 rounded-xl mb-4 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}
      >
        <Shield size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
        <View className="flex-1 ml-3">
          <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Private Account
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Only approved followers can see your posts
          </Text>
        </View>
        <View className={`w-6 h-6 rounded-full border-2 ${
          formData.is_private 
            ? 'bg-purple-600 border-purple-600' 
            : isDark ? 'border-gray-600' : 'border-gray-300'
        } items-center justify-center`}>
          {formData.is_private && (
            <View className="w-3 h-3 bg-white rounded-full" />
          )}
        </View>
      </TouchableOpacity>

      <CustomButton
        title="Next: Select Games"
        onPress={handleNextStep}
        size="large"
        style={{ marginBottom: 16 }}
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <View className="mb-6">
        <Text className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Choose Your Games
        </Text>
        <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Select exactly 3 games that you're interested in ({selectedGames.length}/3)
        </Text>
      </View>

      <View className="flex-row flex-wrap">
        {games.map((game) => {
          const isSelected = selectedGames.includes(game.name);
          return (
            <TouchableOpacity
              key={game._id}
              onPress={() => toggleGameSelection(game.name)}
              className={`m-1 px-4 py-3 rounded-xl border ${
                isSelected
                  ? 'bg-purple-600 border-purple-600'
                  : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
              }`}
              disabled={!isSelected && selectedGames.length >= 3}
              style={{
                opacity: !isSelected && selectedGames.length >= 3 ? 0.5 : 1
              }}
            >
              <View className="flex-row items-center">
                <Gamepad2 
                  size={16} 
                  color={isSelected ? '#ffffff' : (isDark ? '#9ca3af' : '#6b7280')} 
                />
                <Text className={`ml-2 font-medium ${
                  isSelected 
                    ? 'text-white' 
                    : isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {game.name}
                </Text>
              </View>
              <Text className={`text-xs mt-1 ${
                isSelected 
                  ? 'text-purple-200' 
                  : isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {game.category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mt-8 space-y-3">
        <CustomButton
          title="Back"
          variant="outline"
          onPress={() => setCurrentStep(1)}
          size="large"
        />
        
        <CustomButton
          title={isLoading ? 'Creating Account...' : 'Create Account'}
          onPress={handleSignup}
          loading={isLoading}
          size="large"
          disabled={selectedGames.length !== 3}
        />
      </View>
    </View>
  );

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={true}
          >
            <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
              {/* Header with theme switch */}
              <View className="flex-row justify-between items-center mb-8">
                <View>
                  <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Join
                  </Text>
                  <Text className="text-4xl font-bold text-purple-600 mt-1">Pulz</Text>
                  <Text className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Step {currentStep} of 2
                  </Text>
                </View>
                <ThemeSwitch />
              </View>

              {/* Step Content */}
              {currentStep === 1 ? renderStep1() : renderStep2()}

              {/* Sign In Link */}
              <View className="flex-row justify-center mt-6">
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text className="text-purple-600 font-semibold">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};