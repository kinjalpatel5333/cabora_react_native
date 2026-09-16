/** Shared layout math for Home floating pill tab bar. */
export function getTabBarBottomPadding(insets) {
  const inset = Math.max(0, insets?.bottom ?? 0);
  // Sit lower / closer to the home indicator.
  if (inset === 0) {
    return ;
  }
  return Math.min(inset, 1);
}

export function getHomeTabBarContentHeight() {
  // outer pill pad + active chip (icon + label)
  return 72;
}

export function getHomeTabBarInset(insets) {
  return getHomeTabBarContentHeight() + getTabBarBottomPadding(insets);
}
