import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { useApp } from '../../context/AppContext';
import Icon from '../Icon';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';


export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  error,
  success,
  hint,
  disabled = false,
  left,
  right,
  statusIcon = true,
  showFocusBorder = true,
  onFocus,
  onBlur,
  style,
  fieldStyle,
  containerStyle,
  hintStyle,
  ...rest
}) {
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const helper = error || hint;
  const formatHelperText = val => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val?.message === 'string') return val.message;
    if (typeof val?.error === 'string') return val.error;
    try {
      return JSON.stringify(val);
    } catch (e) {
      return String(val);
    }
  };

  const helperText = formatHelperText(helper);

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          fieldStyle,
          showFocusBorder &&
          focused &&
          !hasError &&
          !hasSuccess &&
          !disabled &&
          styles.fieldFocused,
          hasError && !disabled && styles.fieldError,
          hasSuccess && !disabled && styles.fieldSuccess,
          disabled && styles.fieldDisabled,
        ]}>
        {left ? <View style={styles.left}>{left}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.disabledText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
          underlineColorAndroid="transparent"
          style={[styles.input, disabled && styles.inputDisabled, style]}
          {...rest}
          caretHidden={false}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
        />
        {right ? <View style={styles.accessory}>{right}</View> : null}
        {!right && statusIcon && hasError && !disabled ? (
          <View style={styles.accessory}>
            <Icon name="alert" color={colors.danger} size={20} circle />
          </View>
        ) : null}
        {!right && statusIcon && hasSuccess && !disabled ? (
          <View style={styles.accessory}>
            <Icon name="check" color={colors.success} size={20} circle />
          </View>
        ) : null}
      </View>
      {helperText ? (
        <View style={styles.hintRow}>
          {hasError && !disabled ? (
            <AntDesign name="info-circle" size={16} color={colors.danger} />
          ) : null}
          {hasSuccess && !disabled ? (
            <Icon name="check" color={colors.success} size={14} circle />
          ) : null}
          <Text
            style={[
              styles.hint,
              hasError && !disabled && styles.hintError,
              hasSuccess && !disabled && styles.hintSuccess,
              hintStyle,
            ]}>
            {helperText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
