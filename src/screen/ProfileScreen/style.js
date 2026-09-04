import {StyleSheet} from 'react-native';
import colors from '../../config/color';

export default StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  email: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
