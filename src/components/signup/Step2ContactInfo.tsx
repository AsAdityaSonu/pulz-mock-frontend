import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Mail, Phone } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";
import { CustomInput } from "../CustomInput";
import { CustomButton } from "../CustomButton";
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { CircularButton } from '../CustomCircularButton';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

interface Step2ContactInfoProps {
  formData: {
    email: string;
    phone_number: string;
  };
  onInputChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const Step2ContactInfo: React.FC<Step2ContactInfoProps> = ({
  formData,
  onInputChange,
  onNext,
  onBack,
  isValid,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Country picker state
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [country, setCountry] = useState<Country | null>(null);
  const [withFlag, setWithFlag] = useState(true);
  const [withCallingCode, setWithCallingCode] = useState(true);
  const [visible, setVisible] = useState(false);

  const handleSelectCountry = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
    setVisible(false);
    // Prepend country calling code to phone number if not present
    if (selectedCountry.callingCode && selectedCountry.callingCode.length > 0) {
      const code = `+${selectedCountry.callingCode[0]}`;
      let phone = formData.phone_number;
      // Remove any existing country code
      phone = phone.replace(/^\+\d+\s*/, '');
      onInputChange('phone_number', `${code} ${phone}`);
    }
  };

  return (
    <View className="py-4">
      {/* Header */}
      <View className="items-center mb-12">
        <View
          className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
            isDark ? "bg-blue-900" : "bg-blue-100"
          }`}
          style={{
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Mail size={32} color={isDark ? "#60a5fa" : "#3b82f6"} />
        </View>
        <Text
          className={`text-3xl font-bold mb-3 text-center ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Contact Information
        </Text>
        <Text
          className={`text-center px-6 text-lg ${isDark ? "text-gray-400" : "text-gray-600"} leading-relaxed`}
        >
          How can we reach you?
        </Text>
      </View>

      <View className="mb-8">
        <View style={{ marginBottom: 5 }}>
          <CustomInput
            icon={Mail}
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(value) => onInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View 
          className={`flex-row items-center border rounded-2xl px-4 py-2 ${
            isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
          }`}
        >
          <Phone
            size={20}
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
          
          {/* Country Picker */}
          <CountryPicker
            countryCode={countryCode}
            withFlag={withFlag}
            withCallingCode={false}
            withFilter
            withEmoji
            onSelect={handleSelectCountry}
            visible={visible}
            onClose={() => setVisible(false)}
            theme={isDark ? { backgroundColor: '#1f2937', onBackgroundTextColor: '#fff' } : undefined}
            containerButtonStyle={{
              marginLeft: 12,
              marginRight: 8,
            }}
          />
          
          <Text
            className={`text-base ${isDark ? "text-gray-300" : "text-gray-700"} mr-2`}
            style={{ marginLeft: -10 }} 
            onPress={() => setVisible(true)}
          >
            {country && country.callingCode ? `+${country.callingCode[0]}` : '+91'}
          </Text>
          
          <View className="w-px h-6 bg-gray-300 mr-3" />
          
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            value={formData.phone_number.replace(/^\+\d+\s*/, '')}
            onChangeText={(value: string) => {
              const code = country && country.callingCode ? `+${country.callingCode[0]}` : '+91';
              onInputChange('phone_number', `${code} ${value}`);
            }}
            keyboardType="phone-pad"
            className={`flex-1 text-base ${isDark ? "text-white" : "text-gray-900"}`}
          />
        </View>
      </View>

      {/* Helper Text */}
      <Text
        className={`text-sm mb-10 text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}
      >
        Your contact info is private and secure
      </Text>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between">
        <CircularButton
          icon={ArrowLeft}
          onPress={onBack}
          disabled={false}
          style={{ marginRight: 12 }}
        />
        <CircularButton
          icon={ArrowRight}
          onPress={onNext}
          disabled={!isValid}
        />
      </View>
    </View>
  );
};
