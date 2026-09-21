/** Shared layout math for Home floating pill tab bar. */
export function getTabBarBottomPadding() {
  return 0;
}

export function getHomeTabBarContentHeight() {
  // outer pill pad + active chip (icon + label)
  return 64;
}

export function getHomeTabBarInset() {
  return getHomeTabBarContentHeight();
}
