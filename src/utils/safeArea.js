/**
 * Shared bottom safe-area padding — keeps content above the gesture bar
 * without a tall empty strip under footers.
 */
export function bottomSafePad(insets, extra = 0) {
  const inset = Math.max(0, insets?.bottom ?? 0);
  // Prefer the real inset; only a small floor when inset is 0 (e.g. some Android 3-button modes).
  return Math.max(inset, 6) + extra;
}
