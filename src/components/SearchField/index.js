import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {TextInput, TouchableOpacity} from 'react-native';
import {Feather} from '@react-native-vector-icons/feather/static';
import {useApp} from '../../context/AppContext';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

const SearchField = forwardRef(function SearchField(
  {
    value = '',
    onChangeText,
    placeholder = 'Search...',
    placeholderTextColor,
    disabled = false,
    editable = true,
    onFocus,
    onBlur,
    onSubmitEditing,
    onClear,
    showClear = true,
    style,
    inputStyle,
    leftIcon,
    rightComponent,
    returnKeyType = 'search',
    ...rest
  },
  ref,
) {
  const {colors} = useApp();
  const styles = useThemedStyles(createStyles);
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => inputRef.current?.clear(),
    isFocused: () => inputRef.current?.isFocused(),
  }));

  const isEditable = editable && !disabled;
  const hasValue = Boolean(value && value.length > 0);

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (isEditable) {
          inputRef.current?.focus();
        }
      }}
      style={[
        styles.searchBox,
        isFocused && styles.searchBoxFocused,
        disabled && styles.searchBoxDisabled,
        style,
      ]}>
      {leftIcon !== undefined ? (
        leftIcon
      ) : (
        <Feather
          name="search"
          size={18}
          color={isFocused ? colors.primary : colors.textMuted}
        />
      )}

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || colors.textMuted}
        editable={isEditable}
        returnKeyType={returnKeyType}
        autoCapitalize="none"
        onFocus={e => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onSubmitEditing={onSubmitEditing}
        style={[styles.searchInput, inputStyle]}
        {...rest}
      />

      {showClear && hasValue && isEditable ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleClear}
          hitSlop={8}
          style={styles.clearBtn}
          accessibilityRole="button"
          accessibilityLabel="Clear search">
          <Feather name="x-circle" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}

      {rightComponent}
    </TouchableOpacity>
  );
});

export default SearchField;
