import {StyleSheet} from 'react-native';
import colors from '../../config/color';

export default StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 24,
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 16,
  },
  empty: {
    width: '100%',
    height: 160,
    marginBottom: 20,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  email: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
  },
});
