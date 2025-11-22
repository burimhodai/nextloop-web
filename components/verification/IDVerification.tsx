// components/verification/IDVerification.tsx
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createWorker, PSM } from "tesseract.js";
import type {
  ExtractedIDData,
  VerificationSubmission,
} from "@/lib/types/verification.types";

interface IDVerificationProps {
  onSubmit: (data: VerificationSubmission) => Promise<void>;
}

export const IDVerification: React.FC<IDVerificationProps> = ({ onSubmit }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedIDData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    documentNumber: "",
    expiryDate: "",
  });

  const frontInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setFrontImage(file);
      setFrontPreview(preview);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragging to false if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageSelect(files[0]);
    }
  };

  const processImage = async (imageFile: File): Promise<ExtractedIDData> => {
    const worker = await createWorker("eng");

    try {
      // Configure Tesseract for better accuracy with Swiss IDs
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO_OSD, // Automatic page segmentation with OSD
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÄÖÜäöüß0123456789.-/ ",
      });

      const imageUrl = URL.createObjectURL(imageFile);
      const {
        data: { text },
      } = await worker.recognize(imageUrl);

      // Clean up
      URL.revokeObjectURL(imageUrl);

      console.log("OCR Raw Text:", text);

      // Extract structured data from OCR text
      const extracted = extractIDInformation(text);

      return {
        ...extracted,
        rawText: text.trim(),
      };
    } finally {
      await worker.terminate();
    }
  };

  const extractIDInformation = (text: string): Partial<ExtractedIDData> => {
    const extracted: Partial<ExtractedIDData> = {};

    console.log("Raw OCR text:", text);

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    // 1. DOCUMENT NUMBER - Top right corner, alphanumeric format
    const docPattern = /\b([A-Z]\d[A-Z0-9]{6})\b/g;
    const docMatch = text.match(docPattern);
    if (docMatch) {
      // Filter out false positives
      const validDocs = docMatch.filter(
        (m) => !m.includes("CHE") && !m.includes("SUI") && m.length === 8
      );
      if (validDocs.length > 0) {
        extracted.documentNumber = validDocs[0];
      }
    }

    // 2. FIND NAME - Look for line with "Nom" or "Cognome" or "Surname"
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      // Surname line contains: "Name • Nom • Cognome • Num • Surname"
      if (
        line.includes("nom") &&
        line.includes("cognome") &&
        line.includes("surname")
      ) {
        // Next line is the surname
        if (i + 1 < lines.length) {
          const surname = lines[i + 1].trim();
          if (surname.length > 2 && surname.length < 40) {
            extracted.surname = surname;
          }
        }
      }

      // Given name line contains: "Vorname" or "Prénom" or "Nome" or "Given name"
      if (
        (line.includes("vorname") ||
          line.includes("prénom") ||
          line.includes("given name")) &&
        !line.includes("surname")
      ) {
        // Next line is the given name
        if (i + 1 < lines.length) {
          const givenName = lines[i + 1].trim();
          if (givenName.length > 2 && givenName.length < 40) {
            extracted.givenName = givenName;
          }
        }
      }
    }

    // Combine names: Given name + Surname
    if (extracted.givenName && extracted.surname) {
      extracted.fullName = `${extracted.givenName} ${extracted.surname}`;
    } else if (extracted.surname) {
      extracted.fullName = extracted.surname;
    } else if (extracted.givenName) {
      extracted.fullName = extracted.givenName;
    }

    // 3. DATES - Look for date labels
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      // Birth date line
      if (
        line.includes("geburtsdatum") ||
        line.includes("date de naissance") ||
        line.includes("data di nascita") ||
        line.includes("date of birth")
      ) {
        // Look in current line and next 2 lines for date pattern
        for (let j = i; j < Math.min(i + 3, lines.length); j++) {
          const dateMatch = lines[j].match(/\b(\d{2})\s+(\d{2})\s+(\d{4})\b/);
          if (dateMatch) {
            const year = parseInt(dateMatch[3]);
            // Birth dates should be between 1920-2015
            if (year >= 1920 && year <= 2015) {
              extracted.dateOfBirth = `${dateMatch[1]}.${dateMatch[2]}.${dateMatch[3]}`;
              break;
            }
          }
        }
      }

      // Expiry date line - look for the right side labels
      if (
        line.includes("gültig bis") ||
        line.includes("date d'expiration") ||
        line.includes("data di scadenza") ||
        line.includes("date of expiry")
      ) {
        // Look in current line and next 2 lines for date pattern
        for (let j = i; j < Math.min(i + 3, lines.length); j++) {
          const dateMatch = lines[j].match(/\b(\d{2})\s+(\d{2})\s+(\d{4})\b/);
          if (dateMatch) {
            const year = parseInt(dateMatch[3]);
            // Expiry dates should be between 2020-2050
            if (year >= 2020 && year <= 2050) {
              extracted.expiryDate = `${dateMatch[1]}.${dateMatch[2]}.${dateMatch[3]}`;
              break;
            }
          }
        }
      }
    }

    // Fallback: If dates not found with labels, extract all dates and sort by year
    if (!extracted.dateOfBirth || !extracted.expiryDate) {
      const allDates: Array<{ date: string; year: number }> = [];
      const datePattern = /\b(\d{2})\s+(\d{2})\s+(\d{4})\b/g;

      let match;
      while ((match = datePattern.exec(text)) !== null) {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]);
        const year = parseInt(match[3]);

        if (
          day >= 1 &&
          day <= 31 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1920 &&
          year <= 2050
        ) {
          allDates.push({
            date: `${match[1]}.${match[2]}.${match[3]}`,
            year: year,
          });
        }
      }

      // Sort by year (oldest first)
      allDates.sort((a, b) => a.year - b.year);

      // First date (older year) is birth date, second (newer year) is expiry
      if (allDates.length >= 2) {
        if (!extracted.dateOfBirth) {
          extracted.dateOfBirth = allDates[0].date;
        }
        if (!extracted.expiryDate) {
          extracted.expiryDate = allDates[allDates.length - 1].date;
        }
      } else if (allDates.length === 1) {
        // If only one date found, check the year to determine which it is
        if (allDates[0].year <= 2015) {
          extracted.dateOfBirth = allDates[0].date;
        } else {
          extracted.expiryDate = allDates[0].date;
        }
      }
    }

    console.log("Extracted data:", extracted);
    return extracted;
  };

  const handleProcessDocument = async () => {
    if (!frontImage) {
      setError("ID image is required");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const frontData = await processImage(frontImage);
      setExtractedData(frontData);

      console.log("Extracted Data:", frontData);

      // Pre-fill form with extracted data
      setFormData({
        fullName: frontData.fullName || "",
        dateOfBirth: frontData.dateOfBirth || "",
        documentNumber: frontData.documentNumber || "",
        expiryDate: frontData.expiryDate || "",
      });

      setStep(2);
    } catch (err) {
      console.error("OCR Error:", err);
      setError(
        "Failed to process document. Please try again or enter information manually."
      );
      // Even if OCR fails, allow user to proceed to step 2 to enter manually
      setExtractedData({ rawText: "OCR_FAILED" });
      setStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!extractedData) {
      setError("Please process the document first");
      return;
    }

    // Validate form data
    if (
      !formData.fullName ||
      !formData.dateOfBirth ||
      !formData.documentNumber ||
      !formData.expiryDate
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log("Submitting verification:", {
        userProvidedData: formData,
        extractedData: extractedData,
        extractedRawText: extractedData.rawText,
      });

      await onSubmit({
        userProvidedData: formData,
        extractedRawText: extractedData.rawText,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2].map((s, index) => (
            <div key={s} className="flex items-center">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${
                  step >= s
                    ? "bg-[var(--charcoal)] text-[var(--ivory)]"
                    : "bg-[var(--beige)] text-[var(--soft-taupe)]"
                }
              `}
              >
                {s}
              </div>
              {index < 1 && (
                <div
                  className={`
                  w-32 h-1 mx-2
                  ${step > s ? "bg-[var(--charcoal)]" : "bg-[var(--beige)]"}
                `}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-around mt-2 text-sm max-w-md mx-auto">
          <span
            className={
              step >= 1
                ? "text-[var(--charcoal)] font-medium"
                : "text-[var(--soft-taupe)]"
            }
          >
            Upload ID
          </span>
          <span
            className={
              step >= 2
                ? "text-[var(--charcoal)] font-medium"
                : "text-[var(--soft-taupe)]"
            }
          >
            Verify Details
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mr-3 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Image Upload */}
      {step === 1 && (
        <div className="bg-[var(--sand)] rounded-2xl shadow-lg p-8 border border-[var(--warm-gray)]">
          <h2 className="text-2xl font-semibold text-[var(--charcoal)] mb-2">
            Upload Your Swiss ID
          </h2>
          <p className="text-[var(--deep-brown)] mb-6">
            Please upload a clear photo of the front of your Swiss Identity Card
          </p>

          {/* Guidelines */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              📸 Photo Guidelines:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure all text is clearly visible and readable</li>
              <li>• Avoid glare, shadows, and reflections</li>
              <li>• Capture the entire ID card</li>
              <li>• Use a plain background</li>
              <li>• File size: Max 10MB, JPG/PNG format</li>
            </ul>
          </div>

          {/* Front Image Upload with Drag & Drop */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--deep-brown)] mb-2">
              Front of ID Card *
            </label>
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleImageSelect(e.target.files[0])
              }
              className="hidden"
            />
            <div
              onClick={() => frontInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[var(--muted-gold)] bg-amber-50 scale-[1.02]"
                  : "border-[var(--warm-gray)] hover:border-[var(--muted-gold)]"
              }`}
            >
              {frontPreview ? (
                <div className="relative">
                  <img
                    src={frontPreview}
                    alt="Front"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      frontInputRef.current?.click();
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <>
                  <svg
                    className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                      isDragging
                        ? "text-[var(--muted-gold)]"
                        : "text-[var(--soft-taupe)]"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-[var(--deep-brown)] font-medium mb-1">
                    {isDragging
                      ? "Drop image here"
                      : "Click to upload or drag and drop ID front"}
                  </p>
                  <p className="text-sm text-[var(--soft-taupe)]">
                    JPG, PNG up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Action */}
          <Button
            onClick={handleProcessDocument}
            variant="primary"
            className="w-full"
            disabled={!frontImage || isProcessing}
            isLoading={isProcessing}
          >
            {isProcessing ? "Processing Image..." : "Continue"}
          </Button>
        </div>
      )}

      {/* Step 2: Verify and Submit */}
      {step === 2 && (
        <div className="bg-[var(--sand)] rounded-2xl shadow-lg p-8 border border-[var(--warm-gray)]">
          <h2 className="text-2xl font-semibold text-[var(--charcoal)] mb-2">
            Verify Your Information
          </h2>
          <p className="text-[var(--deep-brown)] mb-6">
            Please review and confirm the information. Make corrections if
            needed.
          </p>

          <div className="space-y-4">
            <Input
              label="Full Name (as shown on ID) *"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Helvetia Schweizer Sample"
              required
            />

            <Input
              label="Date of Birth (DD.MM.YYYY) *"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder="01.08.1995"
              required
            />

            <Input
              label="Document Number *"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              placeholder="S1A00A00"
              required
            />

            <Input
              label="Expiry Date (DD.MM.YYYY) *"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="22.03.2033"
              required
            />

            {/* Legal Disclaimer */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Legal Notice
              </h4>
              <p className="text-sm text-amber-800">
                By submitting this information, you confirm that all details are
                accurate and that you are the legitimate holder of this
                identification document. Your ID image will NOT be stored - only
                the extracted text information will be used for verification.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="flex-1"
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                variant="primary"
                className="flex-1"
                isLoading={isProcessing}
                disabled={isProcessing}
              >
                Submit Verification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
