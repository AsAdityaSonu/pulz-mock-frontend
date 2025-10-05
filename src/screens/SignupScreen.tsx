import React, { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { 
  Step1BasicInfo, 
  Step2ContactInfo, 
  Step3Security, 
  Step4Privacy, 
  Step5Interests
} from '../components/signup';

interface SignupScreenProps {
  navigation: any;
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
    is_private: false,
    interests: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { register } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validation functions for each step
  const validateStep1 = () => {
    const { user_name, first_name, last_name } = formData;
    
    if (!user_name.trim() || !first_name.trim() || !last_name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (user_name.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const { email, phone_number } = formData;
    
    if (!email.trim() || !phone_number.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    const { password, confirmPassword, date_of_birth } = formData;
    
    if (!password || !confirmPassword || !date_of_birth.trim()) {
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

    // Basic date validation (YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date_of_birth)) {
      Alert.alert('Error', 'Please enter date in YYYY-MM-DD format');
      return false;
    }

    // Check if user is at least 13 years old
    const birthDate = new Date(date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 13) {
      Alert.alert('Error', 'You must be at least 13 years old to sign up');
      return false;
    }

    return true;
  };

  // Step navigation handlers
  const handleNext = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = true; // Privacy step is always valid
        break;
      default:
        isValid = false;
    }

    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (formData.interests.length !== 3) {
      Alert.alert('Error', 'Please select exactly 3 games');
      return;
    }

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
        interests: formData.interests
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={{
              user_name: formData.user_name,
              first_name: formData.first_name,
              last_name: formData.last_name
            }}
            onInputChange={handleInputChange}
            onNext={handleNext}
            isValid={validateStep1()}
          />
        );
      case 2:
        return (
          <Step2ContactInfo
            formData={{
              email: formData.email,
              phone_number: formData.phone_number
            }}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
            isValid={validateStep2()}
          />
        );
      case 3:
        return (
          <Step3Security
            formData={{
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              date_of_birth: formData.date_of_birth
            }}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
            isValid={validateStep3()}
          />
        );
      case 4:
        return (
          <Step4Privacy
            formData={{
              is_private: formData.is_private
            }}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <Step5Interests
            formData={{
              interests: formData.interests
            }}
            onInputChange={handleInputChange}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const getProgressWidth = () => {
    return (currentStep / 5) * 100;
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: 24, 
            paddingVertical: 32,
            flexGrow: 1
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          alwaysBounceVertical={false}
        >
          <View>
            {/* Header with theme switch */}
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Join
                </Text>
                <Text className="text-4xl font-bold text-purple-600 mt-1">Pulz</Text>
                <Text className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Step {currentStep} of 5
                </Text>
              </View>
              <ThemeSwitch />
            </View>

            {/* Progress Bar */}
            <View className={`w-full h-2 rounded-full mb-8 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <View 
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${getProgressWidth()}%` }}
              />
            </View>

            {/* Step Content */}
            {renderCurrentStep()}

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-8">
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
  );
};