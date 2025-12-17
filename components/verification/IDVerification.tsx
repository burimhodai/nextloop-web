// components/verification/IDVerification.tsx
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Camera, Upload, X, Check } from "lucide-react";

interface IDVerificationProps {
  onSubmit: (data: {
    documentImages: string[]; // base64 strings
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export const IDVerification: React.FC<IDVerificationProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const [frontImage, setFrontImage] = useState<string | null>(null); // base64
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Keep the full data URL for backend
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (file: File) => {
    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setFrontImage(base64);
      setFrontPreview(base64);
      setError(null);
    } catch (err) {
      setError("Failed to process image");
      console.error(err);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!frontImage) {
      setError("Please upload your ID image");
      return;
    }

    setError(null);

    try {
      await onSubmit({
        documentImages: [frontImage], // Array of base64 data URLs
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  };

  const removeImage = () => {
    setFrontImage(null);
    setFrontPreview("");
    if (frontInputRef.current) {
      frontInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
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

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-[#3a3735] mb-3">
            Upload Swiss ID Card (Front) *
          </label>

          {/* Guidelines */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm flex items-center gap-2">
              <Camera className="w-4 h-4" strokeWidth={1.5} />
              Photo Guidelines
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Ensure all text is clearly visible and readable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Avoid glare, shadows, and reflections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Capture the entire ID card with all corners visible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Use a plain, contrasting background</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Max file size: 10MB (JPG, PNG formats)</span>
              </li>
            </ul>
          </div>

          {/* Upload Area */}
          <input
            ref={frontInputRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] && handleImageSelect(e.target.files[0])
            }
            className="hidden"
            disabled={isSubmitting}
          />

          <div
            onClick={() =>
              !frontPreview && !isSubmitting && frontInputRef.current?.click()
            }
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg transition-all duration-200 ${
              isDragging
                ? "border-[#c8a882] bg-[#f5f1ea] scale-[1.01]"
                : frontPreview
                ? "border-[#d4cec4]"
                : "border-[#d4cec4] hover:border-[#c8a882] cursor-pointer"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {frontPreview ? (
              <div className="relative p-6">
                <img
                  src={frontPreview}
                  alt="ID Front"
                  className="max-h-96 mx-auto rounded-lg shadow-md"
                />
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                    <Check className="w-4 h-4" strokeWidth={2} />
                    Image Uploaded Successfully
                  </div>
                  {!isSubmitting && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                    isDragging
                      ? "bg-[#c8a882] text-white"
                      : "bg-[#f5f1ea] text-[#5a524b]"
                  }`}
                >
                  <Upload className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <p className="text-[#3a3735] font-medium mb-2">
                  {isDragging
                    ? "Drop image here"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-[#5a524b]">
                  Swiss ID Card - Front Side
                </p>
                <p className="text-xs text-[#5a524b] mt-1">
                  JPG or PNG, up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-900 mb-2 flex items-center text-sm">
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
          <p className="text-sm text-amber-800 leading-relaxed">
            By submitting this document, you confirm that you are the legitimate
            holder of this Swiss identification card and that all information
            shown is accurate. Your ID image will be securely stored and
            reviewed by our verification team within 24-48 hours. After the
            review is completed, all images will be automatically deleted from
            our servers, regardless of the verification outcome.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={() => window.history.back()}
            variant="ghost"
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isSubmitting}
            disabled={isSubmitting || !frontImage}
          >
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};
