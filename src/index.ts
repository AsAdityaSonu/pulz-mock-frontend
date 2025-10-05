// Context exports
export { AuthProvider, useAuth } from './context/AuthContext';
export { ThemeProvider, useTheme } from './context/ThemeContext';

// Component exports
export { ThemeSwitch } from './components/ThemeSwitch';
export { LoadingScreen } from './components/LoadingScreen';
export { SplashScreen } from './components/SplashScreen';
export { CustomInput } from './components/CustomInput';
export { CustomButton } from './components/CustomButton';
export { Header } from './components/Header';
export { ScrollableContainer } from './components/ScrollableContainer';

// Screen exports
export { LoginScreen } from './screens/LoginScreen';
export { SignupScreen } from './screens/SignupScreen';
export { HomeScreen } from './screens/HomeScreen';
export { StreaksScreen } from './screens/StreaksScreen';
export { CreateScreen } from './screens/CreateScreen';
export { AwardsScreen } from './screens/AwardsScreen';
export { ProfileScreen } from './screens/ProfileScreen';

// Navigation exports
export { AuthNavigator } from './navigation/AuthNavigator';
export { TabNavigator } from './navigation/TabNavigator';
export { RootNavigator } from './navigation/RootNavigator';

// Service exports
export { default as apiService } from './services/api';