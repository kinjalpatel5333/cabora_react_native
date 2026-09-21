/** Shared layout math for Home floating pill tab bar. */
<<<<<<< HEAD
export function getTabBarBottomPadding() {
  return 0;
=======
export function getTabBarBottomPadding(insets) {
  const inset = Math.max(0, insets?.bottom ?? 0);
  // Keep a small lift above the home indicator / screen edge.
  return Math.max(inset > 0 ? inset - 4 : 14, 14);
>>>>>>> f3c5ed56ae67ae4660df2d822e204c5d279119ea
}

export function getHomeTabBarContentHeight() {
  // outer pill pad + active chip (icon + label)
  return 64;
}

export function getHomeTabBarInset() {
  return getHomeTabBarContentHeight();
}
