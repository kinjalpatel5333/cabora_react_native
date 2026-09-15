import React, {useState} from 'react';
import {Pressable, TextInput, View} from 'react-native';
import {useApp} from '../../context/AppContext';
import Icon from '../Icon';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

export default function SearchField({
  value,
  onChangeText,
  placeholder = 'Where to?',
  disabled = false,
  onFocus,
  onBlur,
  style,
  ...rest
}) {
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value);
  const accented = !disabled && (focused || hasValue);
  const iconColor = disabled
    ? colors.disabledText
    : accented
      ? colors.primary
      : colors.gray[400];

  return (
    <View
      style={[
        styles.field,
        !disabled && hasValue && !focused && styles.fieldFilled,
        !disabled && focused && styles.fieldFocused,
        disabled && styles.fieldDisabled,
        style,
      ]}>
      <Icon name="search" color={iconColor} size={20} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.disabledText}
        editable={!disabled}
        autoCapitalize="none"
        returnKeyType="search"
        cursorColor={colors.focus}
        selectionColor={colors.orange[200]}
        underlineColorAndroid="transparent"
        onFocus={event => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={event => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[styles.input, disabled && styles.inputDisabled]}
        {...rest}
      />
      {hasValue && !disabled ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
          onPress={() => onChangeText?.('')}
          style={styles.clearBtn}>
          <Icon
            name="close"
            color={colors.gray[400]}
            size={18}
            circle
            circleColor={colors.gray[300]}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
