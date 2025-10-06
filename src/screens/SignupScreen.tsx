import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ThemeSwitch } from "../components/ThemeSwitch";
import {
  Step1BasicInfo,
  Step2ContactInfo,
  Step3Security,
  Step4Privacy,
  Step5Interests,
} from "../components/signup";

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
    password: "",
    confirmPassword: "",
    is_private: false,
    interests: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value((1 / 5) * 100)).current;

  const { register } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { height } = Dimensions.get("window");

  useEffect(() => {
    // Animate progress bar width
    Animated.timing(progressAnim, {
      toValue: (currentStep / 5) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // direction: 'next' | 'back'
  const animateStepChange = (
    callback: () => void,
    direction: "next" | "back"
  ) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === "next" ? 100 : -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(direction === "next" ? -100 : 100);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validation functions for each step
  const validateStep1 = () => {
    const { user_name, first_name, last_name } = formData;

    if (!user_name.trim() || !first_name.trim() || !last_name.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (user_name.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const { email, phone_number } = formData;

    if (!email.trim() || !phone_number.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    const { password, confirmPassword, date_of_birth } = formData;

    if (!password || !confirmPassword || !date_of_birth.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    // Basic date validation (YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date_of_birth)) {
      Alert.alert("Error", "Please enter date in YYYY-MM-DD format");
      return false;
    }

    // Check if user is at least 13 years old
    const birthDate = new Date(date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 13) {
      Alert.alert("Error", "You must be at least 13 years old to sign up");
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
      animateStepChange(() => setCurrentStep(currentStep + 1), "back");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      animateStepChange(() => setCurrentStep(currentStep - 1), "next");
    }
  };

  const handleComplete = async () => {
    if (formData.interests.length !== 3) {
      Alert.alert("Error", "Please select exactly 3 games");
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
        interests: formData.interests,
      };

      const success = await register(userData);
      if (!success) {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
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
              last_name: formData.last_name,
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
              phone_number: formData.phone_number,
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
              date_of_birth: formData.date_of_birth,
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
              is_private: formData.is_private,
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
              interests: formData.interests,
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
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-purple-50"}`}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#1f2937" : "#f8faff"}
      />

      {/* Background Gradient Overlay */}
      <View
        className={`absolute inset-0 ${isDark ? "bg-gray-900" : "bg-purple-50"}`}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Header Section */}
          <View className="px-6 pt-8 pb-4" style={{ minHeight: height * 0.25 }}>
            {/* Header Section */}
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text
                  className={`text-xl font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Join
                </Text>
                <Text
                  className={`text-5xl font-bold -mt-2 ${isDark ? "text-white" : "text-gray-900"} mb-2`}
                >
                  Pulz
                </Text>
                <Text
                  className={`text-sm mt-1 ${isDark ? "text-purple-400" : "text-purple-600"} font-semibold`}
                >
                  Step {currentStep} of 5
                </Text>
                <View
                  className={`h-0.5 w-12 mt-1 ${isDark ? "bg-purple-400" : "bg-purple-600"} rounded-full`}
                />
              </View>
              <View className="mt-2">
                <ThemeSwitch />
              </View>
            </View>
          </View>

          {/* Step Content Container */}
          <View
            className="flex-1 justify-center px-6 -mt-10"
            style={{ minHeight: height * 0.6 }}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              }}
            >
              {renderCurrentStep()}
            </Animated.View>
          </View>

          {/* Sign In Link */}
          <View className="px-6 pb-8" style={{ minHeight: height * 0.1 }}>
            <View className="flex-row justify-center items-center pt-6">
              <Text
                className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-purple-600 font-bold text-base">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
