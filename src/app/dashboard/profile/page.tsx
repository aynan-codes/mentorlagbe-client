"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CreditCard,
  Loader2,
  Save,
  RefreshCw,
  AlertCircle,
  CalendarDays,
  Camera,
  Upload,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  getMyProfile,
  updateMyProfile,
  type UserProfile,
} from "@/services/user.service";

import { uploadImage } from "@/services/image.service";
import { BANGLADESH_DIVISIONS } from "@/lib/locations";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [division, setDivision] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Profile
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const user = await getMyProfile();

      // Check Google / Saved Profile Image
      console.log("Profile image status:", {
        exists: Boolean(user.image),
        isHttps: user.image?.startsWith("https://"),
      });

      setProfile(user);
      setName(user.name || "");
      setDivision(user.division || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  // Select Profile Image
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Upload Profile Image
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }

    try {
      setUploading(true);

      // Step 1: Upload image to ImgBB
      const imageUrl = await uploadImage(selectedFile);

      console.log("1. Uploaded Image URL:", imageUrl);

      if (!imageUrl) {
        throw new Error("Image upload failed. No image URL received.");
      }

      // Step 2: Save image URL to backend database
      const updatedUser = await updateMyProfile({
        image: imageUrl,
      });

      console.log("2. Updated Profile Image:", updatedUser.image);

      // Step 3: Fetch profile again to verify database save
      const savedProfile = await getMyProfile();

      console.log("3. Database Saved Image:", savedProfile.image);

      // Step 4: Update profile state
      setProfile(savedProfile);

      if (savedProfile.image) {
        setImagePreview("");
        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast.success("Profile image updated successfully.");
      } else {
        toast.error(
          "Image uploaded, but the profile image was not saved in the database."
        );
      }
    } catch (err) {
      console.error("Profile Image Upload Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to upload profile image."
      );
    } finally {
      setUploading(false);
    }
  };

  // Cancel Selected Image
  const handleCancelImage = () => {
    setSelectedFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Update Profile Information
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!division) {
      toast.error("Please select your division.");
      return;
    }

    try {
      setSaving(true);

      const updatedUser = await updateMyProfile({
        name: name.trim(),
        division,
        phone: phone.trim(),
        bio: bio.trim(),
      });

      setProfile(updatedUser);
      setName(updatedUser.name || "");
      setDivision(updatedUser.division || "");
      setPhone(updatedUser.phone || "");
      setBio(updatedUser.bio || "");

      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4169E1]" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-slate-900">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

        <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
          Unable to Load Profile
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {error || "Profile information is unavailable."}
        </p>

        <button
          onClick={() => void loadProfile()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2748A5]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Profile Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Profile Overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          {/* Profile Image */}
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#E0EAFF] dark:bg-slate-800">
              {imagePreview || profile.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview || profile.image || ""}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircle className="h-14 w-14 text-[#4169E1]" />
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-[#4169E1] p-2 text-white shadow-md transition hover:bg-[#2748A5]"
              title="Choose profile image"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* User Information */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {profile.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {profile.email}
            </p>

            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-[#E0EAFF] px-3 py-1 text-xs font-semibold capitalize text-[#2748A5] dark:bg-slate-800 dark:text-blue-300">
                {profile.role}
              </span>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {profile.plan || "Free"} Plan
              </span>
            </div>
          </div>
        </div>

        {/* Image Upload Controls */}
        <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#4169E1] px-4 py-2.5 text-sm font-medium text-[#4169E1] transition hover:bg-[#E0EAFF] disabled:opacity-50 dark:hover:bg-slate-800"
            >
              <Camera className="h-4 w-4" />
              Choose Image
            </button>

            {selectedFile && (
              <>
                <button
                  type="button"
                  onClick={() => void handleImageUpload()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2748A5] disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}

                  {uploading ? "Uploading..." : "Upload Image"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelImage}
                  disabled={uploading}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Cancel selection"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-400">
            JPG, PNG or other image formats. Maximum size: 5MB.
          </p>

          {selectedFile && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Edit Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update your personal details below.
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Full Name *
          </label>

          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={`${inputClass} pl-11`}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="email"
              value={profile.email}
              readOnly
              className={`${inputClass} cursor-not-allowed bg-slate-50 pl-11 dark:bg-slate-800`}
            />
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Email address cannot be changed here.
          </p>
        </div>

        {/* Division */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Division *
          </label>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className={`${inputClass} appearance-none pl-11`}
              required
            >
              <option value="">Select your division</option>

              {BANGLADESH_DIVISIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Phone Number
          </label>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            About Me
          </label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write something about yourself..."
            rows={5}
            maxLength={500}
            className={inputClass}
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {bio.length}/500 characters
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4169E1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2748A5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Account Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
          Account Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#E0EAFF] p-3 dark:bg-slate-800">
              <ShieldCheck className="h-5 w-5 text-[#4169E1]" />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Account Role
              </p>

              <p className="font-semibold capitalize text-slate-900 dark:text-white">
                {profile.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#E0EAFF] p-3 dark:bg-slate-800">
              <CreditCard className="h-5 w-5 text-[#4169E1]" />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Subscription Plan
              </p>

              <p className="font-semibold capitalize text-slate-900 dark:text-white">
                {profile.plan || "Free"}
              </p>
            </div>
          </div>

          {profile.createdAt && (
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#E0EAFF] p-3 dark:bg-slate-800">
                <CalendarDays className="h-5 w-5 text-[#4169E1]" />
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Member Since
                </p>

                <p className="font-semibold text-slate-900 dark:text-white">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}