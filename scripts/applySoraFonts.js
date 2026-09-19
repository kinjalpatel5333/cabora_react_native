const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src/components',
  'src/screen/WalkthroughScreen',
  'src/screen/LoginScreen',
  'src/screen/SignupScreen',
  'src/screen/OtpScreen',
  'src/screen/SetupAccountScreen',
  'src/screen/LocationPermissionScreen',
  'src/screen/DriverHomeScreen',
  'src/screen/DriverEarningsScreen',
  'src/screen/DriverWalletScreen',
  'src/screen/DriverIncentivesScreen',
  'src/screen/DriverIncentiveTrackerScreen',
  'src/screen/DriverProfileScreen',
  'src/screen/DriverSubscriptionScreen',
  'src/screen/DriverDailySafetyCheckScreen',
  'src/screen/DriverTripHistoryScreen',
  'src/screen/DriverAirportQueueScreen',
  'src/screen/DriverAirportTripSummaryScreen',
  'src/screen/DriverTripSummaryScreen',
  'src/screen/DriverStartTripScreen',
  'src/screen/DriverTripInProgressScreen',
  'src/screen/DriverEnRoutePickupScreen',
  'src/screen/DriverCollectCashScreen',
  'src/screen/NewRideRequestScreen',
  'src/screen/UploadDocumentsScreen',
  'src/screen/DocumentCaptureScreen',
  'src/navigation/DrawerContent',
];

function getFontByWeightProp(block) {
  const fwMatch = block.match(/fontWeight:\s*['"]?([0-9a-zA-Z]+)['"]?/);
  if (!fwMatch) {
    return 'colors.fonts.sora.regular';
  }
  const fw = fwMatch[1].toLowerCase();
  if (['800', '900', 'extrabold', 'black'].includes(fw)) {
    return 'colors.fonts.sora.extraBold';
  }
  if (['700', 'bold'].includes(fw)) {
    return 'colors.fonts.sora.bold';
  }
  if (['600', 'semibold'].includes(fw)) {
    return 'colors.fonts.sora.semiBold';
  }
  if (['500', 'medium'].includes(fw)) {
    return 'colors.fonts.sora.medium';
  }
  if (['300', 'light'].includes(fw)) {
    return 'colors.fonts.sora.light';
  }
  if (['100', '200', 'thin', 'extralight'].includes(fw)) {
    return 'colors.fonts.sora.thin';
  }
  return 'colors.fonts.sora.regular';
}

function processStyleFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if file uses `createStyles(colors)` or static colors
  const usesFunction = /function\s+createStyles\s*\(\s*colors\s*\)/.test(content) || /const\s+createStyles\s*=\s*\(?\s*colors\s*\)?\s*=>/.test(content);
  
  // Find each style rule inside StyleSheet.create({ ... })
  // Regex to match: propName: { ... }
  const ruleRegex = /([a-zA-Z0-9_]+):\s*\{([^}]+)\}/g;

  let modified = false;
  const newContent = content.replace(ruleRegex, (match, ruleName, block) => {
    // Check if this block is a text/label/title style: has fontSize or lineHeight or textAlign or letterSpacing or fontWeight
    const isText = /fontSize:|lineHeight:|textAlign:|letterSpacing:|textTransform:|fontStyle:/.test(block) ||
      (/fontWeight:/.test(block) && !/border/.test(ruleName) && !/container/.test(ruleName));

    if (!isText) {
      return match;
    }

    // If it already has fontFamily, replace with proper sora font
    if (/fontFamily:/.test(block)) {
      const fontToken = usesFunction ? getFontByWeightProp(block) : getFontByWeightProp(block).replace('colors.', 'fonts.');
      const updatedBlock = block.replace(/fontFamily:\s*[^,\n]+/, `fontFamily: ${fontToken}`);
      modified = true;
      return `${ruleName}: {${updatedBlock}}`;
    }

    // Otherwise, add fontFamily
    const fontToken = usesFunction ? getFontByWeightProp(block) : getFontByWeightProp(block).replace('colors.', 'fonts.');
    // Insert after the opening or at first line of block
    const updatedBlock = `\n      fontFamily: ${fontToken},` + block;
    modified = true;
    return `${ruleName}: {${updatedBlock}}`;
  });

  // If not using function and we used fonts., make sure fonts is imported
  let finalContent = newContent;
  if (!usesFunction && finalContent.includes('fonts.sora.')) {
    if (!finalContent.includes('import {fonts}') && !finalContent.includes('import { fonts }')) {
      finalContent = `import { fonts } from '../../config/typography';\n` + finalContent;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file === 'style.js' || file === 'styles.js') {
      processStyleFile(fullPath);
    }
  }
}

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir);
  }
});
console.log('Finished applying Sora font.');
