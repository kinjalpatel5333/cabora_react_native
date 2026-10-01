/**
 * Vehicle Number Plate Utility (On-Device Indian ANPR)
 *
 * Provides normalization, contextual character repair, regex validation,
 * and display formatting for vehicle registration number plates.
 */

// All standard 2-letter state & union territory codes in India (including legacy OR, UA)
export const INDIAN_STATE_CODES = new Set([
  'AN', 'AP', 'AR', 'AS', 'BR', 'CG', 'CH', 'DD', 'DL', 'DN',
  'GA', 'GJ', 'HP', 'HR', 'JH', 'JK', 'KA', 'KL', 'LA', 'LD',
  'MH', 'ML', 'MN', 'MP', 'MZ', 'NL', 'OD', 'OR', 'PB', 'PY',
  'RJ', 'SK', 'TN', 'TR', 'TS', 'UA', 'UK', 'UP', 'UT', 'WB',
]);

const INDIAN_STATES_UNION = Array.from(INDIAN_STATE_CODES).sort().join('|');

// Standard Indian vehicle registration format:
// Authorized State Code (2 letters) + RTO Code (1-2 digits) + Series (0-3 letters) + Number (1-4 digits)
// OR Bharat Series: 2 digits (Year 21-35) + BH + 4 digits + 1-2 letters
export const INDIAN_PLATE_REGEX = new RegExp(
  `^(?:(?:${INDIAN_STATES_UNION})[0-9]{1,2}[A-Z]{0,3}[0-9]{1,4}|[0-9]{2}BH[0-9]{4}[A-Z]{1,2})$`,
);

/**
 * Normalizes a number plate string by converting to uppercase and stripping
 * spaces, hyphens, periods, and special separators.
 * Also removes leading "IND", "1ND", or "INDIA" (printed on High Security Registration Plates).
 *
 * Examples:
 *  "IND GJ 05 AB 1234"  -> "GJ05AB1234"
 *  "1ND GJ 05 AB 1234"  -> "GJ05AB1234"
 *  "GJ 05 AB 1234"      -> "GJ05AB1234"
 *  "GJ-05-AB-1234"      -> "GJ05AB1234"
 *  "gj05ab1234"         -> "GJ05AB1234"
 *
 * @param {string} value
 * @returns {string} Clean, normalized plate string
 */
export function normalizeNumberPlate(value) {
  if (!value || typeof value !== 'string') return '';
  let clean = value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim();

  // Strip HSRP "IND" badge prefix if attached to the plate
  if (clean.startsWith('IND') && clean.length >= 8) {
    clean = clean.slice(3);
  } else if (clean.startsWith('1ND') && clean.length >= 8) {
    clean = clean.slice(3);
  } else if (clean.startsWith('INDIA') && clean.length >= 9) {
    clean = clean.slice(5);
  }

  return clean;
}

/**
 * Validates if the string strictly matches an Indian vehicle number plate.
 * Must belong to an authorized Indian State/UT code (or Bharat BH series).
 *
 * @param {string} value
 * @returns {boolean}
 */
export function isValidNumberPlate(value) {
  const normalized = normalizeNumberPlate(value);
  if (!normalized || normalized.length < 6 || normalized.length > 10) {
    return false;
  }

  // 1. Check Bharat (BH) Series: YY BH NNNN AA (e.g., 22BH1234AA)
  const bhMatch = normalized.match(/^([0-9]{2})BH([0-9]{4})([A-Z]{1,2})$/);
  if (bhMatch) {
    const year = parseInt(bhMatch[1], 10);
    const num = parseInt(bhMatch[2], 10);
    return year >= 21 && year <= 35 && num > 0;
  }

  // 2. Check Standard Indian Plate: State (2) + District (1-2) + Series (0-3) + Number (1-4)
  const match = normalized.match(/^([A-Z]{2})([0-9]{1,2})[A-Z]{0,3}([0-9]{1,4})$/);
  if (!match) return false;

  const [, state, rto, number] = match;

  // Must strictly be an official Indian State or Union Territory code
  if (!INDIAN_STATE_CODES.has(state)) {
    return false;
  }

  // RTO district code cannot be 0 or 00
  if (parseInt(rto, 10) === 0) {
    return false;
  }

  // Vehicle unique number cannot be 0 or 0000
  if (parseInt(number, 10) === 0) {
    return false;
  }

  return true;
}

/**
 * Formats a normalized number plate into human-friendly spacing.
 * e.g. "GJ05AB1234" -> "GJ 05 AB 1234"
 *
 * @param {string} value
 * @returns {string}
 */
export function formatDisplayPlate(value) {
  const clean = normalizeNumberPlate(value);
  if (!clean) return '';

  // Match standard: State (2) + District (1-2) + Series (0-3) + Number (1-4)
  const match = clean.match(/^([A-Z]{2})([0-9]{1,2})([A-Z]{0,3})([0-9]{1,4})$/);
  if (match) {
    const parts = [match[1], match[2], match[3], match[4]].filter(Boolean);
    return parts.join(' ');
  }

  // Match BH Series: 22 BH 1234 AA
  const bhMatch = clean.match(/^([0-9]{2})(BH)([0-9]{4})([A-Z]{1,2})$/);
  if (bhMatch) {
    return `${bhMatch[1]} ${bhMatch[2]} ${bhMatch[3]} ${bhMatch[4]}`;
  }

  return clean;
}

function cleanOcrDigits(str) {
  return str
    .replace(/[OQD]/g, '0')
    .replace(/[IL]/g, '1')
    .replace(/Z/g, '2')
    .replace(/S/g, '5')
    .replace(/B/g, '8');
}

function cleanOcrLetters(str) {
  return str
    .replace(/0/g, 'O')
    .replace(/1/g, 'I')
    .replace(/2/g, 'Z')
    .replace(/8/g, 'B');
}

/**
 * Repairs common OCR misread characters in Indian plates based on positional rules:
 * - State code (chars 0-1): Must be letters (replaces 0->O, 1->I)
 * - District code (chars 2-3): Must be digits (replaces O->0, I->1, Z->2)
 * - Last characters: Must be digits (replaces O->0, I/L->1, Z->2, S->5, B->8)
 * - Series code (middle): Must be letters (replaces 0->O, 1->I)
 *
 * @param {string} candidate
 * @returns {string | null}
 */
export function repairIndianPlate(candidate) {
  if (!candidate || typeof candidate !== 'string') return null;
  const s = normalizeNumberPlate(candidate);
  if (s.length < 6 || s.length > 11) return null;

  // 1. Check Bharat (BH) Series: YY BH NNNN AA
  const bhMatch = s.match(/^([0-9OI]{2})BH([0-9OI]{4})([A-Z0-9]{1,2})$/);
  if (bhMatch) {
    const year = cleanOcrDigits(bhMatch[1]);
    const num = cleanOcrDigits(bhMatch[2]);
    const series = cleanOcrLetters(bhMatch[3]);
    const candidatePlate = year + 'BH' + num + series;
    if (isValidNumberPlate(candidatePlate)) return candidatePlate;
  }

  // 2. Standard Indian Plate
  let state = cleanOcrLetters(s.slice(0, 2));
  if (!INDIAN_STATE_CODES.has(state)) {
    return null;
  }
  let rest = s.slice(2);

  // Extract 1-2 district digits
  let dist = '';
  while (dist.length < 2 && rest.length > 0) {
    const ch = rest[0];
    if (/[0-9]/.test(ch)) dist += ch;
    else if (ch === 'O' || ch === 'Q' || ch === 'D') dist += '0';
    else if (ch === 'I' || ch === 'L') dist += '1';
    else if (ch === 'Z') dist += '2';
    else break;
    rest = rest.slice(1);
  }
  if (dist.length === 0) return null;

  // Trailing digits (1-4 digits)
  const numMatch = rest.match(/([0-9OQDILZSB]{1,4})$/);
  if (!numMatch) return null;
  const rawNum = numMatch[1];
  const num = cleanOcrDigits(rawNum);
  const rawSeries = rest.slice(0, -rawNum.length);
  const series = cleanOcrLetters(rawSeries);

  const repaired = state + dist + series + num;
  return isValidNumberPlate(repaired) ? repaired : null;
}

/**
 * Searches a raw OCR text string strictly for Indian vehicle number plates.
 *
 * @param {string} rawText
 * @returns {{ plateNumber: string, confidence: number } | null}
 */
export function extractPlateFromText(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  // 1. Direct line/token analysis
  const tokens = rawText
    .split(/[\n\r,;|]+/)
    .map(t => normalizeNumberPlate(t))
    .filter(Boolean);

  for (const token of tokens) {
    const repaired = repairIndianPlate(token);
    if (repaired && isValidNumberPlate(repaired)) {
      return {
        plateNumber: repaired,
        confidence: 0.95,
      };
    }
  }

  // 2. Strict word boundary pattern (ensures state code is NOT preceded or followed by word chars)
  const normalizedSpaces = rawText.toUpperCase();
  const stdPattern = new RegExp(
    `(?:^|[^A-Z])(${INDIAN_STATES_UNION})\\s*([0-9OI]{1,2})\\s*([A-Z0-9]{0,3})\\s*([0-9OI]{1,4})(?:$|[^A-Z0-9])`,
    'g',
  );

  let match;
  while ((match = stdPattern.exec(normalizedSpaces)) !== null) {
    const stateCandidate = match[1];
    if (INDIAN_STATE_CODES.has(stateCandidate)) {
      const repaired = repairIndianPlate(`${stateCandidate}${match[2]}${match[3] || ''}${match[4]}`);
      if (repaired && isValidNumberPlate(repaired)) {
        return {
          plateNumber: repaired,
          confidence: 0.93,
        };
      }
    }
  }

  // BH series pattern
  const bhPattern = /(?:^|[^A-Z0-9])([0-9OI]{2})\s*(BH)\s*([0-9OI]{4})\s*([A-Z0-9]{1,2})(?:$|[^A-Z0-9])/g;
  while ((match = bhPattern.exec(normalizedSpaces)) !== null) {
    const repaired = repairIndianPlate(`${match[1]}BH${match[3]}${match[4]}`);
    if (repaired && isValidNumberPlate(repaired)) {
      return {
        plateNumber: repaired,
        confidence: 0.94,
      };
    }
  }

  return null;
}

/**
 * Parses ML Kit OCR blocks to extract vehicle registration plates,
 * handling single-line and two-line (stacked) plates.
 *
 * @param {Array} blocks ML Kit TextBlock array
 * @param {string} fullText ML Kit full text string
 * @returns {{ plateNumber: string, confidence: number, rawText: string } | null}
 */
export function extractPlateFromOcrBlocks(blocks, fullText = '') {
  // 1. Try full text first
  const fromFullText = extractPlateFromText(fullText);
  if (fromFullText) {
    return {
      ...fromFullText,
      rawText: fullText,
    };
  }

  if (!blocks || !Array.isArray(blocks)) {
    return null;
  }

  // 2. Scan individual lines
  for (const block of blocks) {
    if (block?.lines && Array.isArray(block.lines)) {
      for (const line of block.lines) {
        const found = extractPlateFromText(line?.text);
        if (found) {
          return {
            ...found,
            rawText: line?.text || found.plateNumber,
          };
        }
      }

      // 3. Scan adjacent lines (e.g. Line 1: "GJ 01", Line 2: "AB 1234")
      for (let i = 0; i < block.lines.length - 1; i++) {
        const line1 = block.lines[i]?.text || '';
        const line2 = block.lines[i + 1]?.text || '';
        const combined = `${line1} ${line2}`.trim();
        const found = extractPlateFromText(combined);
        if (found) {
          return {
            ...found,
            confidence: 0.9,
            rawText: combined,
          };
        }
      }
    }
  }

  // 4. Scan all block texts joined
  const allBlocksText = blocks.map(b => b?.text || '').join('\n');
  const fromBlocks = extractPlateFromText(allBlocksText);
  if (fromBlocks) {
    return {
      ...fromBlocks,
      rawText: allBlocksText,
    };
  }

  return null;
}
