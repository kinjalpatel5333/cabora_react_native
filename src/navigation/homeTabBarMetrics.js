/** Shared layout math for Home floating pill tab bar. */
export function getTabBarBottomPadding() {
  return 0;
}

export function getHomeTabBarContentHeight() {
  // outer pill pad + active chip (icon + label)
  return 62;
}

export function getHomeTabBarInset(insets) {
  const bottomInset = insets?.bottom || 0;
  const bottomMargin = bottomInset > 0 ? bottomInset + 6 : 10;
  return getHomeTabBarContentHeight() + bottomMargin + 12;
}
