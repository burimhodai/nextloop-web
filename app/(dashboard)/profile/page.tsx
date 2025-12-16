// app/profile/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
  CreditCard,
  Star,
  Calendar,
  Edit2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Camera,
} from "lucide-react";

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
    if (user) {
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

  // Helper component for consistent input styling
  const ProfileInput = ({
    label,
    name,
    value,
    onChange,
    disabled,
    type = "text",
    placeholder,
    icon: Icon,
  }: any) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[#3a3735]">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 bg-white border border-[#d4cec4] rounded-lg text-[#3a3735] placeholder-[#5a524b]/50 
            focus:outline-none focus:ring-2 focus:ring-[#c8a882]/50 focus:border-[#c8a882] transition-all
            disabled:bg-[#f5f1ea] disabled:text-[#5a524b] ${
              Icon ? "pl-10" : ""
            }`}
        />
        {Icon && (
          <Icon className="w-4 h-4 text-[#5a524b] absolute left-3.5 top-3" />
        )}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#c8a882] animate-spin mx-auto mb-4" />
          <p className="text-[#5a524b]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3a3735] mb-2">My Profile</h1>
        <p className="text-[#5a524b]">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar - User Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-6 sticky top-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-[#e8dfd0] flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                  <span className="text-4xl font-bold text-[#3a3735]">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Optional: Add functionality to change photo later */}
                <button className="absolute bottom-0 right-0 p-2 bg-[#3a3735] text-[#c8a882] rounded-full hover:bg-[#c8a882] hover:text-[#3a3735] transition-colors shadow-sm">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center mt-4">
                <h2 className="text-xl font-bold text-[#3a3735]">
                  {user.fullName}
                </h2>
                <p className="text-sm text-[#5a524b] mb-1">@{user.username}</p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#5a524b] bg-[#f5f1ea] px-3 py-1 rounded-full w-fit mx-auto">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {user.emailVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  <CheckCircle className="w-3 h-3" />
                  Email Verified
                </span>
              )}

              {user.idVerification?.success ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                  <ShieldCheck className="w-3 h-3" />
                  ID Verified
                </span>
              ) : (
                <button
                  onClick={() => router.push("/profile/verify")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Verify ID
                </button>
              )}

              {user.isSeller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3a3735] text-[#c8a882] border border-[#3a3735]">
                  <Building className="w-3 h-3" />
                  Seller Account
                </span>
              )}
            </div>

            {/* Stats Grid */}
            <div className="border-t border-[#d4cec4] pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#5a524b]">
                  <CreditCard className="w-4 h-4 text-[#c8a882]" />
                  <span className="text-sm">Balance</span>
                </div>
                <span className="font-bold text-[#3a3735]">
                  CHF {user.balance?.toFixed(2) || "0.00"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#5a524b]">
                  <Star className="w-4 h-4 text-[#c8a882]" />
                  <span className="text-sm">Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[#3a3735]">
                    {user.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-xs text-[#5a524b]">
                    ({user.totalRatings || 0})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#5a524b]">
                  <Calendar className="w-4 h-4 text-[#c8a882]" />
                  <span className="text-sm">Joined</span>
                </div>
                <span className="text-sm font-medium text-[#3a3735]">
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
          <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#3a3735]">
                  Profile Information
                </h2>
                <p className="text-sm text-[#5a524b] mt-1">
                  Update your account details and physical address
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#f5f1ea] text-[#3a3735] rounded-lg hover:bg-[#e8dfd0] transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-bold text-[#c8a882] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ProfileInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    icon={User}
                  />

                  <ProfileInput
                    label="Email Address"
                    value={user.email}
                    disabled={true}
                    icon={Mail}
                  />
                </div>

                <div className="mt-5">
                  <ProfileInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+41 79 123 45 67"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    icon={Phone}
                  />
                </div>
              </div>

              <hr className="border-[#d4cec4]" />

              {/* Address */}
              <div>
                <h3 className="text-sm font-bold text-[#c8a882] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Address
                </h3>

                <div className="space-y-5">
                  <ProfileInput
                    label="Street Address"
                    name="address.street"
                    placeholder="Bahnhofstrasse 123"
                    value={formData.address.street}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ProfileInput
                      label="City"
                      name="address.city"
                      placeholder="Zürich"
                      value={formData.address.city}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                    />

                    <ProfileInput
                      label="Canton"
                      name="address.canton"
                      placeholder="ZH"
                      value={formData.address.canton}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ProfileInput
                      label="Postal Code"
                      name="address.postalCode"
                      placeholder="8001"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                    />

                    <ProfileInput
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
                <>
                  <hr className="border-[#d4cec4]" />
                  <div>
                    <h3 className="text-sm font-bold text-[#c8a882] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Building className="w-4 h-4" /> Business Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <ProfileInput
                        label="Business Name"
                        value={user.businessName || "Not set"}
                        disabled={true}
                      />

                      <ProfileInput
                        label="VAT Number"
                        value={user.vatNumber || "Not set"}
                        disabled={true}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center gap-4 pt-4 border-t border-[#d4cec4]">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>

                  <button
                    type="button"
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
                    className="px-6 py-2.5 bg-[#f5f1ea] text-[#5a524b] rounded-lg hover:bg-[#e8dfd0] transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
