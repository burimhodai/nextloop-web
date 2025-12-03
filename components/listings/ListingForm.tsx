"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select"; // Assuming you have this similarly styled
import { CategorySelect } from "@/components/categories/CategorySelect";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import {
  ListingConditions,
  ListingTypes,
  ImageTypes,
} from "@/lib/types/listing.types";
import {
  Camera,
  AlertCircle,
  DollarSign,
  Gavel,
  CheckCircle2,
} from "lucide-react";

// ... [Interfaces remain the same as your original code] ...
interface ListingFormData {
  title: string;
  description: string;
  price: number;
  condition: ListingConditions;
  type: ListingTypes;
  category: string;
  images: Partial<Record<ImageTypes, File>>;
}

interface ListingFormProps {
  initialData?: Partial<ListingFormData>;
  onSubmit: (data: ListingFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const CONDITION_OPTIONS = Object.values(ListingConditions).map((c) => ({
  value: c,
  label: c.replace("_", " "),
}));

const REQUIRED_IMAGE_TYPES = Object.values(ImageTypes);

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
    condition: initialData?.condition || ListingConditions.GOOD,
    type: initialData?.type || ListingTypes.DIRECT_BUY,
    category: initialData?.category || "",
    images: initialData?.images || {},
  });

  const [previews, setPreviews] = useState<Partial<Record<ImageTypes, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPriceLabel = () =>
    formData.type === ListingTypes.AUCTION
      ? "Starting Bid (CHF)"
      : "Buy Now Price (CHF)";

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

  const handleImageUpload = (type: ImageTypes, file: File) => {
    setFormData((prev) => ({
      ...prev,
      images: { ...prev.images, [type]: file },
    }));
    const reader = new FileReader();
    reader.onloadend = () =>
      setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const removeImage = (type: ImageTypes) => {
    const newImages = { ...formData.images };
    delete newImages[type];
    const newPreviews = { ...previews };
    delete newPreviews[type];
    setFormData((prev) => ({ ...prev, images: newImages }));
    setPreviews(newPreviews);
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
    if (formData.price <= 0) return "Price must be greater than 0";
    if (!formData.category) return "Category is required";
    const missingImages = REQUIRED_IMAGE_TYPES.filter(
      (type) => !formData.images[type]
    );
    if (missingImages.length > 0)
      return `Missing images: ${missingImages
        .map((t) => t.replace("_", " "))
        .join(", ")}`;
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="max-w-5xl mx-auto pb-24">
      {/* Luxury Header Section */}
      <div className="mb-10 text-center">
        <h1
          className="text-4xl text-[#3a3735] mb-3"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {isEdit ? "Edit Your Collection" : "Consign an Item"}
        </h1>
        <p className="text-[#5a524b] max-w-2xl mx-auto">
          Provide the details of your item below. Our experts review all
          submissions to ensure authenticity and quality.
        </p>
      </div>

      <Card className="border-none shadow-xl bg-white relative overflow-hidden">
        {/* Decorative Top Border similar to Hero separator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#3a3735]" />

        <div className="p-8 md:p-12 space-y-12">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* SECTION 1: TYPE SELECTION */}
          <section className="space-y-6">
            <h3
              className="text-xl text-[#3a3735] flex items-center gap-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-none border border-[#3a3735] text-sm font-medium">
                01
              </span>
              Sales Method
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: ListingTypes.DIRECT_BUY,
                  label: "Direct Buy",
                  desc: "Set a fixed price for instant purchase",
                  icon: <DollarSign className="w-5 h-5" />,
                },
                {
                  value: ListingTypes.AUCTION,
                  label: "Auction",
                  desc: "Start bidding to get the best market price",
                  icon: <Gavel className="w-5 h-5" />,
                },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      type: option.value as ListingTypes,
                    }))
                  }
                  className={`cursor-pointer group relative flex flex-col p-6 border transition-all duration-300 ${
                    formData.type === option.value
                      ? "bg-[#3a3735] border-[#3a3735]"
                      : "bg-[#faf8f4] border-[#d4cec4] hover:border-[#c8a882] hover:bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`${
                        formData.type === option.value
                          ? "text-[#c8a882]"
                          : "text-[#3a3735]"
                      }`}
                    >
                      {option.icon}
                    </span>
                    {formData.type === option.value && (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h4
                    className={`text-lg font-medium mb-1 ${
                      formData.type === option.value
                        ? "text-white"
                        : "text-[#3a3735]"
                    }`}
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {option.label}
                  </h4>
                  <p
                    className={`text-sm ${
                      formData.type === option.value
                        ? "text-gray-300"
                        : "text-[#5a524b]"
                    }`}
                  >
                    {option.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2: DETAILS */}
          <section className="space-y-8 pt-8 border-t border-[#d4cec4]/30">
            <h3
              className="text-xl text-[#3a3735] flex items-center gap-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-none border border-[#3a3735] text-sm font-medium">
                02
              </span>
              Item Details
            </h3>

            <div className="space-y-6">
              <Input
                label="Item Name"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Rolex Submariner Date 1990"
                required
              />

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-[#5a524b]">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] placeholder:text-[#5a524b]/50 focus:bg-white focus:border-[#c8a882] focus:ring-1 focus:ring-[#c8a882] focus:outline-none transition-all resize-none shadow-sm"
                  placeholder="Provide provenance, condition details, and history..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label={getPriceLabel()}
                  name="price"
                  type="number"
                  min="0"
                  step="0.05"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

                <div className="space-y-2">
                  {/* Replace with your specific Select component */}
                  <label className="text-xs font-medium uppercase tracking-wider text-[#5a524b]">
                    Condition
                  </label>
                  <div className="relative">
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] appearance-none focus:bg-white focus:border-[#c8a882] focus:outline-none transition-all"
                    >
                      {CONDITION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#5a524b]">
                      ▼
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Simplification of CategorySelect for demo */}
                  <CategorySelect
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    // Pass specific styling props if your component accepts them
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: IMAGES */}
          <section className="space-y-8 pt-8 border-t border-[#d4cec4]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3
                className="text-xl text-[#3a3735] flex items-center gap-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-none border border-[#3a3735] text-sm font-medium">
                  03
                </span>
                Gallery
              </h3>
              <span className="text-xs text-[#c8a882] font-medium uppercase tracking-widest border border-[#c8a882] px-3 py-1">
                All {REQUIRED_IMAGE_TYPES.length} Angles Required
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {REQUIRED_IMAGE_TYPES.map((type) => {
                const isUploaded = !!formData.images[type];
                const previewUrl = previews[type];

                return (
                  <div key={type} className="group relative aspect-[4/5]">
                    <input
                      type="file"
                      id={`file-${type}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(type, file);
                      }}
                    />

                    <label
                      htmlFor={`file-${type}`}
                      className={`h-full w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border
                        ${
                          isUploaded
                            ? "border-none bg-gray-100"
                            : "border-dashed border-[#d4cec4] bg-[#faf8f4] hover:border-[#c8a882] hover:bg-white"
                        }`}
                    >
                      {isUploaded && previewUrl ? (
                        <>
                          <img
                            src={previewUrl}
                            alt={type}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-[#3a3735]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                            <span className="text-white font-serif text-lg mb-2">
                              Change Image
                            </span>
                            <span className="text-[#c8a882] text-xs uppercase tracking-widest">
                              {type}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeImage(type);
                            }}
                            className="absolute top-2 right-2 p-2 bg-white text-[#3a3735] hover:text-red-600 transition-colors z-10"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <div className="w-12 h-12 mx-auto mb-4 border border-[#d4cec4] flex items-center justify-center rounded-full text-[#5a524b] group-hover:border-[#c8a882] group-hover:text-[#c8a882] transition-colors">
                            <Camera className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                          <span className="block text-xs font-bold text-[#3a3735] uppercase tracking-widest mb-1">
                            {type}
                          </span>
                          <span className="text-[10px] text-[#5a524b] uppercase">
                            Upload
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse md:flex-row gap-4 pt-8 border-t border-[#d4cec4]/30">
            <Button
              onClick={onCancel}
              variant="ghost"
              className="flex-1 py-4 text-base tracking-wide"
              disabled={isSubmitting}
            >
              Cancel Consignment
            </Button>
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="flex-1 py-4 text-base tracking-wide"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEdit ? "Update Listing" : "Publish Listing"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
