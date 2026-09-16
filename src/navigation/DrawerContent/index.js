import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {images} from '../../assets';
import {Button} from '../../components';
import {useSidebar} from '../../context/SidebarContext';
import {useAuth} from '../../hooks/useAuth';
import {useAppDispatch} from '../../redux/hooks';
import {logoutUser} from '../../redux/slices/authSlice';
import {bottomSafePad} from '../../utils/safeArea';
import styles from './style';

const LINKS = [
  {label: 'Home', screen: 'Home', icon: images.iconHome},
  {label: 'Services', screen: 'Services', icon: images.iconSearch},
  {label: 'Activity', screen: 'Activity', icon: images.iconSettings},
  {label: 'Wallet', screen: 'Wallet', icon: images.iconProfile},
  {label: 'Profile', screen: 'Profile', icon: images.iconProfile},
];

export default function DrawerContent() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const {user} = useAuth();
  const {activeTab, goTo} = useSidebar();

  return (
    <View
      style={[
        styles.root,
        {paddingTop: insets.top + 16, paddingBottom: bottomSafePad(insets, 8)},
      ]}>
      <View style={styles.profile}>
        <Image source={images.avatar} style={styles.avatar} />
        <Text style={styles.name}>{user?.name || 'Demo user'}</Text>
        <Text style={styles.email}>{user?.email || 'you@email.com'}</Text>
      </View>

      <View style={styles.items}>
        {LINKS.map(link => {
          const active = activeTab === link.screen;
          return (
            <Pressable
              key={link.screen}
              onPress={() => goTo(link.screen)}
              style={[styles.item, active && styles.itemActive]}>
              <Image source={link.icon} style={styles.itemIcon} />
              <Text style={styles.itemLabel}>{link.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          title="Log out"
          variant="outline"
          onPress={() => dispatch(logoutUser())}
        />
      </View>
    </View>
  );
}
