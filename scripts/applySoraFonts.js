const fs = require('fs');
const path = require('path');

function getFontByWeightProp(block) {
  // If fontFamily is already specified with sora weight
  if (/sora\.(extraBold|bold|semiBold|medium|light|thin|regular)/i.test(block)) {
    const m = block.match(/sora\.(extraBold|bold|semiBold|medium|light|thin|regular)/i);
    if (m) {
      const k = m[1];
      return k.charAt(0).toLowerCase() + k.slice(1);
    }
  }
  if (/Sora-ExtraBold/i.test(block)) return 'extraBold';
  if (/Sora-Bold/i.test(block)) return 'bold';
  if (/Sora-SemiBold/i.test(block)) return 'semiBold';
  if (/Sora-Medium/i.test(block)) return 'medium';
  if (/Sora-Light/i.test(block)) return 'light';
  if (/Sora-Thin/i.test(block)) return 'thin';
  if (/Sora-Regular/i.test(block)) return 'regular';

  const fwMatch = block.match(/fontWeight:\s*['"]?([0-9a-zA-Z]+)['"]?/);
  if (!fwMatch) {
    return 'regular';
  }
  const fw = fwMatch[1].toLowerCase();
  if (['800', '900', 'extrabold', 'black'].includes(fw)) {
    return 'extraBold';
  }
  if (['700', 'bold'].includes(fw)) {
    return 'bold';
  }
  if (['600', 'semibold'].includes(fw)) {
    return 'semiBold';
  }
  if (['500', 'medium'].includes(fw)) {
    return 'medium';
  }
  if (['300', 'light'].includes(fw)) {
    return 'light';
  }
  if (['100', '200', 'thin', 'extralight'].includes(fw)) {
    return 'thin';
  }
  return 'regular';
}

function getRelativeTypographyImport(filePath) {
  const dir = path.dirname(filePath);
  const target = path.resolve('src/config/typography');
  let rel = path.relative(dir, target);
  if (!rel.startsWith('.')) {
    rel = './' + rel;
  }
  return rel.replace(/\\/g, '/');
}

function processStyleFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip files that don't have StyleSheet.create
  if (!content.includes('StyleSheet.create')) {
    return;
  }

  // Check if file uses `createStyles(colors)` or `createStyles(theme)`
  const usesFunction =
    /function\s+createStyles\s*\(\s*([a-zA-Z0-9_]+)\s*\)/.test(content) ||
    /const\s+createStyles\s*=\s*\(?\s*([a-zA-Z0-9_]+)\s*\)?\s*=>/.test(content);

  let paramName = 'colors';
  if (usesFunction) {
    const fnMatch =
      content.match(/function\s+createStyles\s*\(\s*([a-zA-Z0-9_]+)\s*\)/) ||
      content.match(/const\s+createStyles\s*=\s*\(?\s*([a-zA-Z0-9_]+)\s*\)?\s*=>/);
    if (fnMatch && fnMatch[1]) {
      paramName = fnMatch[1];
    }
  }

  // Find each style rule inside StyleSheet.create({ ... })
  const ruleRegex = /([a-zA-Z0-9_]+):\s*\{([^}]+)\}/g;

  let modified = false;
  const newContent = content.replace(ruleRegex, (match, ruleName, block) => {
    // Check if this block is a text/label/title style
    const isText =
      /fontSize:|lineHeight:|textAlign:|letterSpacing:|textTransform:|fontStyle:/.test(block) ||
      (/fontWeight:/.test(block) && !/border/.test(ruleName) && !/container/.test(ruleName) && !/wrapper/.test(ruleName));

    if (!isText) {
      return match;
    }

    // Skip vector icons
    if (/AntDesign|Feather|FontAwesome|MaterialDesign|Lucide/i.test(block)) {
      return match;
    }

    const weightKey = getFontByWeightProp(block);
    let fontToken;
    if (usesFunction) {
      if (paramName === 'theme' && !content.includes('const { colors') && !content.includes('const {colors')) {
        fontToken = `theme.fonts.sora.${weightKey}`;
      } else {
        fontToken = `colors.fonts.sora.${weightKey}`;
      }
    } else {
      fontToken = `fonts.sora.${weightKey}`;
    }

    let updatedBlock = block;

    // Remove fontWeight property completely so Android uses the custom font file directly without falling back to Roboto!
    if (/fontWeight:\s*[^,\n]+,?\n?/.test(updatedBlock)) {
      updatedBlock = updatedBlock.replace(/\s*fontWeight:\s*[^,\n]+,?\n?/, '\n');
    }

    // Replace or add fontFamily
    if (/fontFamily:\s*[^,\n]+/.test(updatedBlock)) {
      updatedBlock = updatedBlock.replace(/fontFamily:\s*[^,\n]+/, `fontFamily: ${fontToken}`);
    } else {
      updatedBlock = `\n      fontFamily: ${fontToken},` + updatedBlock;
    }

    modified = true;
    return `${ruleName}: {${updatedBlock}}`;
  });

  let finalContent = newContent;
  if (!usesFunction && finalContent.includes('fonts.sora.')) {
    if (!finalContent.includes('import {fonts}') && !finalContent.includes('import { fonts }')) {
      const relImport = getRelativeTypographyImport(filePath);
      finalContent = `import { fonts } from '${relImport}';\n` + finalContent;
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
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      processStyleFile(fullPath);
    }
  }
}

walkDir('src');
console.log('Finished updating fonts and removing conflicting fontWeight for Android compatibility.');
