export interface ExtractedIDData {
  fullName?: string;
  givenName?: string;
  surname?: string;
  dateOfBirth?: string;
  documentNumber?: string;
  expiryDate?: string;
  rawText: string; // Required field - the full OCR text
}

export interface VerificationSubmission {
  userProvidedData: {
    fullName: string;
    dateOfBirth: string;
    documentNumber: string;
    expiryDate: string; // Now required
  };
  extractedRawText: string; // This is what gets sent to backend for re-extraction
}
