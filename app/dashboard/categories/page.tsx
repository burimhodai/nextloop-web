// app/dashboard/categories/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentCategory?: { _id: string; name: string };
  isActive: boolean;
  productCount: number;
  children?: Category[];
  createdAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    parentCategory: "",
  });

  useEffect(() => {
    fetchCategories();
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    setIsLoading(true);
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

  const handleSubmit = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const payload = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon || "📦",
        parentCategory: formData.parentCategory || null,
      };

      const url = editingCategory
        ? `${API_URL}/categories/${editingCategory._id}`
        : `${API_URL}/categories`;

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchCategories();
        setShowForm(false);
        setEditingCategory(null);
        setFormData({
          name: "",
          description: "",
          icon: "",
          parentCategory: "",
        });
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      parentCategory: category.parentCategory?._id || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/categories/status/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const flattenCategories = (
    cats: Category[],
    level = 0
  ): Array<Category & { level: number }> => {
    let flat: Array<Category & { level: number }> = [];

    cats.forEach((cat) => {
      flat.push({ ...cat, level });
      if (cat.children && cat.children.length > 0) {
        flat = flat.concat(flattenCategories(cat.children, level + 1));
      }
    });

    return flat;
  };

  const flatCategories = flattenCategories(categories);

  // Get parent options for select (exclude current category and its descendants when editing)
  const getParentOptions = () => {
    const options = flatCategories
      .filter((cat) => {
        if (!editingCategory) return true;
        // Exclude self and descendants
        return cat._id !== editingCategory._id;
      })
      .map((cat) => ({
        value: cat._id,
        label: `${"—".repeat(cat.level)}${cat.level > 0 ? " " : ""}${cat.name}`,
      }));

    return [{ value: "", label: "None (Root Category)" }, ...options];
  };

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      {/* Header */}
      <header className="bg-[var(--sand)] border-b border-[var(--warm-gray)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--charcoal)]">
                Categories
              </h1>
              <p className="text-[var(--deep-brown)] mt-1">
                Manage your listing categories
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => router.push("/dashboard")} variant="ghost">
                Back to Dashboard
              </Button>
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingCategory(null);
                  setFormData({
                    name: "",
                    description: "",
                    icon: "",
                    parentCategory: "",
                  });
                }}
                variant="primary"
              >
                {showForm ? "Cancel" : "+ New Category"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <Card variant="elevated" className="mb-8">
            <CardHeader>
              <CardTitle as="h3">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </CardTitle>
              <CardDescription>
                {editingCategory
                  ? "Update the category details"
                  : "Add a new category to organize your listings"}
              </CardDescription>
            </CardHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Category Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Electronics"
                  required
                />

                <Input
                  label="Icon (Emoji)"
                  name="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="📦"
                />
              </div>

              <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this category"
              />

              <Select
                label="Parent Category"
                name="parentCategory"
                value={formData.parentCategory}
                onChange={(e) =>
                  setFormData({ ...formData, parentCategory: e.target.value })
                }
                options={getParentOptions()}
                helperText="Leave empty to create a root category"
              />

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                    setFormData({
                      name: "",
                      description: "",
                      icon: "",
                      parentCategory: "",
                    });
                  }}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  className="flex-1"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Categories List */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle as="h3">All Categories</CardTitle>
            <CardDescription>
              {flatCategories.length} categories total
            </CardDescription>
          </CardHeader>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--charcoal)] mx-auto mb-4"></div>
              <p className="text-[var(--deep-brown)]">Loading categories...</p>
            </div>
          ) : flatCategories.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-[var(--soft-taupe)] mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-2">
                No categories yet
              </h3>
              <p className="text-[var(--deep-brown)]">
                Create your first category to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--beige)] border-b border-[var(--warm-gray)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--deep-brown)] uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--deep-brown)] uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--deep-brown)] uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--deep-brown)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[var(--deep-brown)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--warm-gray)]">
                  {flatCategories.map((category) => (
                    <tr
                      key={category._id}
                      className="hover:bg-[var(--ivory)] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            style={{ marginLeft: `${category.level * 20}px` }}
                          >
                            <span className="text-2xl mr-2">
                              {category.icon || "📦"}
                            </span>
                            <span className="font-medium text-[var(--charcoal)]">
                              {category.name}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--deep-brown)] max-w-xs truncate">
                          {category.description || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[var(--deep-brown)]">
                          {category.productCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(category._id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            category.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-[var(--muted-gold)] hover:text-[var(--deep-brown)] mr-4 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
