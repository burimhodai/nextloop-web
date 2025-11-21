// app/profile/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, token } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      canton: "",
      postalCode: "",
      country: "Switzerland",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          canton: user.address?.canton || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || "Switzerland",
        },
      });
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/user/update/${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update user in store
      useAuthStore.setState({ user: data });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--charcoal)] mx-auto mb-4"></div>
          <p className="text-[var(--deep-brown)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      {/* Header */}
      <header className="bg-[var(--sand)] border-b border-[var(--warm-gray)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-[var(--charcoal)]">
                NextLoop
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a
                  href="/profile"
                  className="text-[var(--charcoal)] font-medium border-b-2 border-[var(--muted-gold)] pb-1"
                >
                  Profile
                </a>
                <a
                  href="/dashboard"
                  className="text-[var(--deep-brown)] hover:text-[var(--charcoal)] transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/marketplace"
                  className="text-[var(--deep-brown)] hover:text-[var(--charcoal)] transition-colors"
                >
                  Marketplace
                </a>
              </nav>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-3"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - User Card */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--sand)] rounded-2xl shadow-lg p-6 border border-[var(--warm-gray)] sticky top-24">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-[var(--muted-gold)]/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[var(--charcoal)]">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-[var(--charcoal)] mb-1">
                  {user.fullName}
                </h2>
                <p className="text-sm text-[var(--deep-brown)] mb-2">
                  @{user.username}
                </p>
                <p className="text-xs text-[var(--soft-taupe)]">{user.email}</p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {user.isVerified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                )}

                {user.isSeller && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--muted-gold)]/20 text-[var(--charcoal)]">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Seller
                  </span>
                )}

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--beige)] text-[var(--deep-brown)] capitalize">
                  {user.role}
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-3 border-t border-[var(--warm-gray)] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--deep-brown)]">
                    Balance
                  </span>
                  <span className="font-semibold text-[var(--charcoal)]">
                    CHF {user.balance.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--deep-brown)]">
                    Rating
                  </span>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-[var(--muted-gold)] mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-[var(--charcoal)]">
                      {user.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-[var(--soft-taupe)] ml-1">
                      ({user.totalRatings})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--deep-brown)]">
                    Member since
                  </span>
                  <span className="text-sm text-[var(--charcoal)]">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--sand)] rounded-2xl shadow-lg p-8 border border-[var(--warm-gray)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--charcoal)]">
                    Profile Information
                  </h2>
                  <p className="text-sm text-[var(--deep-brown)] mt-1">
                    Update your account details and personal information
                  </p>
                </div>

                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    size="sm"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-4 pb-2 border-b border-[var(--warm-gray)]">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                    />

                    <Input
                      label="Email"
                      value={user.email}
                      disabled
                      icon={
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
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="+41 79 123 45 67"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-4 pb-2 border-b border-[var(--warm-gray)]">
                    Address
                  </h3>

                  <div className="space-y-4">
                    <Input
                      label="Street Address"
                      name="address.street"
                      placeholder="Bahnhofstrasse 123"
                      value={formData.address.street}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="City"
                        name="address.city"
                        placeholder="Zürich"
                        value={formData.address.city}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                      />

                      <Input
                        label="Canton"
                        name="address.canton"
                        placeholder="ZH"
                        value={formData.address.canton}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Postal Code"
                        name="address.postalCode"
                        placeholder="8001"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                      />

                      <Input
                        label="Country"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Business Info (if seller) */}
                {user.isSeller && (
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-4 pb-2 border-b border-[var(--warm-gray)]">
                      Business Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Business Name"
                        value={user.businessName || "Not set"}
                        disabled
                      />

                      <Input
                        label="VAT Number"
                        value={user.vatNumber || "Not set"}
                        disabled
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex items-center gap-4 pt-4 border-t border-[var(--warm-gray)]">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      Save Changes
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                        // Reset form
                        setFormData({
                          fullName: user.fullName || "",
                          phone: user.phone || "",
                          address: {
                            street: user.address?.street || "",
                            city: user.address?.city || "",
                            canton: user.address?.canton || "",
                            postalCode: user.address?.postalCode || "",
                            country: user.address?.country || "Switzerland",
                          },
                        });
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
