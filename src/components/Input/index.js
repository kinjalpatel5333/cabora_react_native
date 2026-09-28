import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { useApp } from '../../context/AppContext';
import Icon from '../Icon';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

const Input = forwardRef(function Input(
  {
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
    statusIcon = false,
    showHelperIcon = false,
    showFocusBorder = true,
    pointerEvents,
    onPress,
    onFocus,
    onBlur,
    style,
    fieldStyle,
    containerStyle,
    hintStyle,
    ...rest
  },
  ref,
) {
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => inputRef.current);

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

  const handleFieldPress = event => {
    if (disabled) {
      return;
    }
    if (onPress) {
      onPress(event);
    } else {
      inputRef.current?.focus();
    }
  };

  const isPressable = Boolean(onPress);
  const ContainerComponent = isPressable ? Pressable : View;

  return (
    <ContainerComponent
      onPress={isPressable ? handleFieldPress : undefined}
      style={[styles.wrap, containerStyle]}>
      {label ? (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      ) : null}
      <Pressable
        onPress={handleFieldPress}
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
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.disabledText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled && !isPressable && rest.editable !== false}
          pointerEvents={isPressable || rest.editable === false ? 'none' : pointerEvents}
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
            <AntDesign name="check-circle" size={20} color={colors.success} />
          </View>
        ) : null}
      </Pressable>
      {helperText ? (
        <View style={styles.hintRow}>
          {showHelperIcon && hasError && !disabled ? (
            <AntDesign name="info-circle" size={16} color={colors.danger} />
          ) : null}
          {showHelperIcon && hasSuccess && !disabled ? (
            <AntDesign name="check-circle" size={14} color={colors.success} />
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
    </ContainerComponent>
  );
});

export default Input;
