import {useMemo} from 'react';
import {useApp} from '../context/AppContext';

export default function useThemedStyles(createStyles) {
  const {colors} = useApp();
  return useMemo(() => createStyles(colors), [colors, createStyles]);
}
