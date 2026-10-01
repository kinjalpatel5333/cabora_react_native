import { NativeModules } from 'react-native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {
  normalizeNumberPlate,
  isValidNumberPlate,
  extractPlateFromOcrBlocks,
} from '../utils/numberPlate';

/**
 * Checks if native ML Kit Text Recognition is compiled and available
 * in the current binary runtime.
 */
function isNativeOcrAvailable() {
  return Boolean(NativeModules && NativeModules.TextRecognition);
}

/**
 * On-Device Vehicle Number Plate Recognition
 *
 * Runs 100% on the device using Google ML Kit Text Recognition.
 * Does NOT call any remote backend or API.
 * Strictly detects and validates Indian registration plates (State RTO or BH series).
 *
 * Flow:
 * 1. Validates image URI.
 * 2. Processes image using on-device ML Kit OCR.
 * 3. Extracts and repairs candidate vehicle plates using Indian plate patterns.
 * 4. Strictly validates against authorized Indian State / UT codes or BH series.
 * 5. Normalizes plate number (uppercase, spaces/hyphens removed).
 * 6. Returns plateNumber, confidence score, rawText, and imageUri.
 *
 * @param {string} imageUri Local image file path or content URI
 * @param {object} [options]
 * @param {number} [options.minConfidence=50] Minimum acceptable confidence percentage (0-100)
 * @returns {Promise<{ plateNumber: string, confidence?: number, rawText?: string, imageUri: string }>}
 */
export async function scanNumberPlate(imageUri, options = {}) {
  const minConfidence = options.minConfidence ?? 50;

  if (!imageUri || typeof imageUri !== 'string') {
    throw new Error('Please select or capture a valid vehicle image.');
  }

  // Ensure valid file path for native OCR engine
  const cleanUri =
    imageUri.startsWith('file://') || imageUri.startsWith('content://')
      ? imageUri
      : `file://${imageUri}`;

  console.log('🔍 [NumberPlateService:On-Device] Scanning image for Indian plate:', cleanUri);

  // 1. Try On-Device Native ML Kit Text Recognition
  if (isNativeOcrAvailable()) {
    try {
      const ocrResult = await TextRecognition.recognize(cleanUri);
      console.log('📝 [NumberPlateService:On-Device] Recognized Text:', ocrResult?.text);

      const plateMatch = extractPlateFromOcrBlocks(ocrResult?.blocks, ocrResult?.text);

      if (plateMatch && plateMatch.plateNumber) {
        const normalized = normalizeNumberPlate(plateMatch.plateNumber);

        // Enforce strict Indian vehicle number plate validation
        if (!isValidNumberPlate(normalized)) {
          throw new Error(
            'Only valid Indian vehicle number plates are supported (e.g. GJ05AB1234, DL3CAA1111, 22BH1234AA).',
          );
        }

        const confidenceScore = Math.round((plateMatch.confidence || 0.9) * 100);

        if (confidenceScore < minConfidence) {
          throw new Error('The detected number plate has low clarity. Please capture a closer, sharper photo.');
        }

        return {
          plateNumber: normalized,
          confidence: confidenceScore,
          rawText: plateMatch.rawText || plateMatch.plateNumber,
          imageUri,
        };
      }

      // If text was recognized but no Indian plate matched, provide context
      if (ocrResult?.text && ocrResult.text.trim().length > 0) {
        throw new Error(
          'No valid Indian vehicle number plate was detected (e.g. GJ05AB1234). Please ensure the Indian plate is clearly visible.',
        );
      }

      throw new Error(
        'No vehicle number plate detected. Please position the camera closer to the Indian number plate.',
      );
    } catch (ocrErr) {
      if (
        ocrErr.message?.includes('No vehicle number plate detected') ||
        ocrErr.message?.includes('low clarity') ||
        ocrErr.message?.includes('Indian vehicle number plate')
      ) {
        throw ocrErr;
      }
      console.warn('⚠️ [NumberPlateService:On-Device] ML Kit execution error:', ocrErr?.message);
    }
  }

  // 2. If native module is not linked in currently running binary, throw clear instruction
  throw new Error(
    'Native OCR module is not compiled into the current app build. Please rebuild the app (npx react-native run-ios / run-android) to enable the camera scanner.',
  );
}

export default {
  scanNumberPlate,
};
