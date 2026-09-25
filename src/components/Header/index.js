import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets';
import { useSidebar } from '../../context/SidebarContext';
import { useApp } from '../../context/AppContext';
import useThemedStyles from '../useThemedStyles';
import createStyles from './style';

export default function Header({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  showHelp = false,
  showSupport = false,
  showRightIcon = false,
  rightIconName = 'help-circle',
  leftComponent,
  rightComponent,
  onBackPress,
  onMenuPress,
  onHelpPress,
  onSupportPress,
  onRightPress,
  transparent = false,
  showBorder = true,
  containerStyle,
  titleStyle,
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { openDrawer } = useSidebar();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleMenu = () => {
    if (onMenuPress) {
      onMenuPress();
    } else if (openDrawer) {
      openDrawer();
    }
  };

  const renderLeft = () => {
    if (leftComponent) {
      return leftComponent;
    }
    if (showBack) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={styles.iconBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
      );
    }
    if (showMenu) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={handleMenu}
          style={styles.iconBtn}>
          <Feather name="menu" size={22} color={colors.text} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.iconPlaceholder} />;
  };

  const renderRight = () => {
    if (rightComponent) {
      return rightComponent;
    }
    if (showHelp) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Help"
          onPress={onHelpPress || onRightPress}
          style={styles.iconBtn}>
          <Feather name="help-circle" size={22} color={colors.text} />
        </TouchableOpacity>
      );
    }
    if (showSupport) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Support"
          onPress={onSupportPress || onRightPress}
          style={styles.iconBtn}>
          <Feather name="headphones" size={22} color={colors.text} />
        </TouchableOpacity>
      );
    }
    if (showRightIcon) {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={onRightPress}
          style={styles.iconBtn}>
          <Feather name={rightIconName} size={22} color={colors.text} />
        </TouchableOpacity>
      );
    }
    if (showBack || showMenu) {
      return <View style={styles.iconPlaceholder} />;
    }
    return null;
  };

  return (
    <View
      style={[
        styles.wrap,
        transparent && styles.transparentWrap,
        !showBorder && styles.noBorderWrap,
        { paddingTop: Math.max(insets.top, 8) + 4 },
        containerStyle,
      ]}>
      {renderLeft()}
      <View style={styles.titleWrap}>
        {title ? (
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {renderRight()}
    </View>
  );
}
