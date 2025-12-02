// components/categories/CategorySelect.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Select } from "@/components/ui/Select";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: string;
  children?: Category[];
}

interface CategorySelectProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  label = "Category",
  name,
  value,
  onChange,
  required = false,
  error,
  helperText,
  placeholder = "Select a category",
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/category`);

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Flatten category tree into options with indentation
  const flattenCategories = (
    cats: Category[],
    level = 0
  ): Array<{ value: string; label: string }> => {
    let options: Array<{ value: string; label: string }> = [];

    cats.forEach((cat) => {
      const indent = "—".repeat(level);
      options.push({
        value: cat._id,
        label: `${indent}${level > 0 ? " " : ""}${cat.name}`,
      });

      if (cat.children && cat.children.length > 0) {
        options = options.concat(flattenCategories(cat.children, level + 1));
      }
    });

    return options;
  };

  const options = flattenCategories(categories);

  if (isLoading) {
    return (
      <Select
        label={label}
        name={name}
        value=""
        onChange={onChange}
        options={[{ value: "", label: "Loading categories..." }]}
        disabled
      />
    );
  }

  return (
    <Select
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      required={required}
      error={error}
      helperText={helperText}
    />
  );
};
