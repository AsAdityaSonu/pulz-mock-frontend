import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  messageContainer: {
    marginBottom: 20,
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 15,
    lineHeight: 21,
    opacity: 0.85,
  },
});
