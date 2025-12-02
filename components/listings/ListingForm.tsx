// components/listings/ListingForm.tsx
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CategorySelect } from "@/components/categories/CategorySelect";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

interface ListingFormData {
  title: string;
  description: string;
  price: number;
  condition: string;
  type: "DIRECT_BUY" | "AUCTION";
  category: string;
  images: File[];
}

interface ListingFormProps {
  initialData?: Partial<ListingFormData>;
  onSubmit: (data: ListingFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const LISTING_CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "VERY_GOOD", label: "Very Good" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
];

const LISTING_TYPES = [
  { value: "DIRECT_BUY", label: "Direct Buy", icon: "🛒" },
  { value: "AUCTION", label: "Auction", icon: "🔨" },
];

export const ListingForm: React.FC<ListingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<ListingFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    condition: initialData?.condition || "GOOD",
    type: initialData?.type || "DIRECT_BUY",
    category: initialData?.category || "",
    images: initialData?.images || [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + formData.images.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    // Create previews
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setError(null);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (!formData.category) {
      setError("Category is required");
      return;
    }
    if (formData.images.length === 0 && !isEdit) {
      setError("At least one image is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle as="h2">
            {isEdit ? "Edit Listing" : "Create New Listing"}
          </CardTitle>
          <CardDescription>
            Fill in the details below to {isEdit ? "update" : "create"} your
            listing
          </CardDescription>
        </CardHeader>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0"
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
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Nike Air Max 2024"
            required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--deep-brown)] mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-[var(--ivory)] border-2 border-[var(--warm-gray)] rounded-lg text-[var(--charcoal)] font-sans transition-all duration-300 hover:border-[var(--muted-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--muted-gold)] focus:ring-opacity-50 focus:border-[var(--muted-gold)]"
              placeholder="Describe your item in detail..."
              required
            />
          </div>

          {/* Price & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Price (CHF)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />

            <div>
              <label className="block text-sm font-medium text-[var(--deep-brown)] mb-2">
                Listing Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {LISTING_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type: type.value as any,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.type === type.value
                        ? "border-[var(--muted-gold)] bg-[var(--beige)]"
                        : "border-[var(--warm-gray)] hover:border-[var(--muted-gold)] bg-[var(--ivory)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium text-[var(--charcoal)]">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Condition & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              options={LISTING_CONDITIONS}
              required
            />

            <CategorySelect
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              helperText="Select the category that best fits your item"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-[var(--deep-brown)] mb-2">
              Images <span className="text-red-500">*</span> (Max 10)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {/* Existing images */}
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-[var(--warm-gray)] group"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add button */}
              {formData.images.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-[var(--warm-gray)] hover:border-[var(--muted-gold)] flex items-center justify-center text-[var(--soft-taupe)] hover:text-[var(--muted-gold)] transition-all duration-300 bg-[var(--ivory)]"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-xs text-[var(--soft-taupe)] mt-2">
              {formData.images.length}/10 images uploaded
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={onCancel}
              variant="ghost"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEdit ? "Update Listing" : "Create Listing"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
