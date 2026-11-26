"use client";

import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Loader2,
  PlusCircle,
  MapPin,
  Camera,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  createTuition,
  type CreateTuitionPayload,
} from "@/services/tuition.service";

import { uploadImage } from "@/services/image.service";

import { BANGLADESH_DIVISIONS } from "@/lib/locations";

const initialForm: CreateTuitionPayload = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "offline",
  location: "",
  monthlyFee: 0,
  daysPerWeek: 5,
  bannerImage: "",
  description: "",
};

export default function AddTuitionPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  // New image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "monthlyFee" || name === "daysPerWeek"
          ? Number(value)
          : value,
    }));
  };

  // Choose Banner Image
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

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");

    const input = document.getElementById(
      "bannerImage"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.classLevel.trim() ||
      !form.location ||
      !form.description.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(form.monthlyFee) || form.monthlyFee <= 0) {
      toast.error("Please enter a valid monthly fee.");
      return;
    }

    if (
      !Number.isInteger(form.daysPerWeek) ||
      form.daysPerWeek < 1 ||
      form.daysPerWeek > 7
    ) {
      toast.error("Days per week must be between 1 and 7.");
      return;
    }

    try {
      setSaving(true);

      let bannerImageUrl = form.bannerImage.trim();

      // Upload selected banner image to ImgBB
      if (selectedImage) {
        toast.info("Uploading banner image...");

        bannerImageUrl = await uploadImage(selectedImage);

        if (!bannerImageUrl) {
          throw new Error("Banner image upload failed.");
        }
      }

      await createTuition({
        ...form,
        title: form.title.trim(),
        subject: form.subject.trim(),
        classLevel: form.classLevel.trim(),
        location: form.location,
        bannerImage: bannerImageUrl,
        description: form.description.trim(),
      });

      toast.success(
        "Tuition posted successfully! Waiting for admin approval."
      );

      router.push("/dashboard/tutor/my-tuitions");
    } catch (error) {
      console.error("Create Tuition Error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to create tuition.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Heading */}
      <div>
        <Link
          href="/dashboard/tutor"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4169E1] hover:text-[#2748A5]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-xl bg-[#E0EAFF] p-3 dark:bg-slate-800">
            <BookOpen className="h-6 w-6 text-[#4169E1]" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Post a New Tuition
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Provide the details to find your next student.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tuition Title *
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Mathematics Tutor Needed"
            className={inputClass}
            required
          />
        </div>

        {/* Subject and Class */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Subject *
            </label>

            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Mathematics"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Class Level *
            </label>

            <input
              name="classLevel"
              value={form.classLevel}
              onChange={handleChange}
              placeholder="e.g. Class 10"
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Tuition Mode */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tuition Mode *
          </label>

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="offline">Offline</option>
            <option value="online">Online</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Division */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Division *
          </label>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={`${inputClass} appearance-none pl-11`}
              required
            >
              <option value="">Select tuition division</option>

              {BANGLADESH_DIVISIONS.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fee and Days */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Monthly Fee (৳) *
            </label>

            <input
              type="number"
              name="monthlyFee"
              value={form.monthlyFee || ""}
              onChange={handleChange}
              min="1"
              placeholder="5000"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Days Per Week *
            </label>

            <select
              name="daysPerWeek"
              value={form.daysPerWeek}
              onChange={handleChange}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <option key={day} value={day}>
                  {day} Days
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Banner Image Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tuition Banner Image
          </label>

          <div className="space-y-4">
            <input
              id="bannerImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                document.getElementById("bannerImage")?.click()
              }
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-[#4169E1] px-5 py-3 text-sm font-medium text-[#4169E1] transition hover:bg-[#E0EAFF] disabled:opacity-50 dark:hover:bg-slate-800"
            >
              <Camera className="h-5 w-5" />
              Choose Image
            </button>

            <p className="text-xs text-slate-400">
              JPG, PNG or other image formats. Maximum size: 5MB.
            </p>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Tuition banner preview"
                  className="h-52 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={saving}
                  className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white shadow-md transition hover:bg-red-600 disabled:opacity-50"
                  aria-label="Remove selected image"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="bg-white px-3 py-2 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  {selectedImage?.name}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description *
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the tuition requirements..."
            rows={5}
            className={inputClass}
            required
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
          <Link
            href="/dashboard/tutor"
            className="rounded-lg border border-slate-200 px-5 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4169E1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2748A5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}

            {saving ? "Posting..." : "Post Tuition"}
          </button>
        </div>
      </form>
    </div>
  );
}