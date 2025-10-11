import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  fullWidth: {
    width: '100%',
  },
  // Size variants
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: -5,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: -5,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: -5,
    minHeight: 52,
  },
  // Text styles
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  icon: {
    marginRight: 8,
  },
});
