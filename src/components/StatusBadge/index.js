import React from 'react';
import {Text, View} from 'react-native';
import {useApp} from '../../context/AppContext';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

const TONES = {
  neutral: {dot: 'gray', text: 'gray', dotShade: 500, textShade: 700},
  accent: {dot: 'orange', text: 'orange', dotShade: 500, textShade: 600},
  success: {dot: 'green', text: 'green', dotShade: 500, textShade: 600},
  warning: {dot: 'amber', text: 'amber', dotShade: 600, textShade: 600},
  danger: {dot: 'red', text: 'red', dotShade: 500, textShade: 600},
  info: {dot: 'blue', text: 'blue', dotShade: 500, textShade: 600},
};

export default function StatusBadge({label, tone = 'neutral'}) {
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const spec = TONES[tone] || TONES.neutral;
  const scale = colors[spec.dot];
  const textScale = colors[spec.text];

  return (
    <View style={[styles.base, styles[tone] || styles.neutral]}>
      <View
        style={[styles.dot, {backgroundColor: scale[spec.dotShade]}]}
      />
      <Text style={[styles.label, {color: textScale[spec.textShade]}]}>
        {label}
      </Text>
    </View>
  );
}
