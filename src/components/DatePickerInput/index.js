import React from 'react';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useApp } from '../../context/AppContext';
import Input from '../Input';

export default function DatePickerInput({
  label,
  value,
  placeholder = 'DD / MM / YYYY',
  error,
  success,
  hint,
  onPress,
  disabled = false,
  containerStyle,
  fieldStyle,
  style,
  hintStyle,
  leftIcon = 'calendar',
  ...rest
}) {
  const { colors } = useApp();

  const isError = Boolean(error);
  const isSuccess = Boolean(success) && !isError;

  const iconColor = isError
    ? colors.danger
    : isSuccess
      ? colors.success
      : colors.textSecondary || colors.text;

  return (
    <Input
      label={label}
      value={value}
      placeholder={placeholder}
      editable={false}
      onPress={onPress}
      error={error}
      success={success}
      hint={hint}
      disabled={disabled}
      maxLength={50}
      containerStyle={containerStyle}
      fieldStyle={fieldStyle}
      style={style}
      hintStyle={hintStyle}
      left={
        <Feather
          name={leftIcon}
          size={18}
          color={iconColor}
        />
      }
      {...rest}
    />
  );
}
