/** Shared layout math for Home floating pill tab bar. */
export function getTabBarBottomPadding(insets) {
  const inset = Math.max(0, insets?.bottom ?? 0);
  // Keep a small lift above the home indicator / screen edge.
  return Math.max(inset > 0 ? inset - 4 : 14, 14);
}

export function getHomeTabBarContentHeight() {
  // outer pill pad + active chip (icon + label)
  return 64;
}

export function getHomeTabBarInset(insets) {
  return getHomeTabBarContentHeight() + getTabBarBottomPadding(insets);
}
