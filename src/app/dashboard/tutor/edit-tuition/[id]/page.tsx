"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  MapPin,
  Camera,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import {
  getMyTuitions,
  updateTuition,
} from "@/services/tuition.service";

import { uploadImage } from "@/services/image.service";
import type { TuitionMode } from "@/types/tuition.types";
import { BANGLADESH_DIVISIONS } from "@/lib/locations";

export default function EditTuitionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    subject: "",
    classLevel: "",
    mode: "offline" as TuitionMode,
    location: "",
    monthlyFee: "",
    daysPerWeek: "5",
    bannerImage: "",
    description: "",
  });

  // Load Existing Tuition
  useEffect(() => {
    const loadTuition = async () => {
      try {
        // Get logged-in tutor's own tuitions
        const myTuitions = await getMyTuitions();

        // Find the requested tuition by ID
        const tuition = myTuitions.find(
          (item) => item._id === params.id
        );

        if (!tuition) {
          throw new Error(
            "Tuition not found or you do not own this tuition."
          );
        }

        setForm({
          title: tuition.title,
          subject: tuition.subject,
          classLevel: tuition.classLevel,
          mode: tuition.mode,
          location: tuition.location,
          monthlyFee: String(tuition.monthlyFee),
          daysPerWeek: String(tuition.daysPerWeek),
          bannerImage: tuition.bannerImage || "",
          description: tuition.description,
        });

        setImagePreview(tuition.bannerImage || "");
      } catch (error) {
        console.error("Load Tuition Error:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load tuition information.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadTuition();
    }
  }, [params.id]);

  // Handle Form Changes
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle Image Selection
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5MB.");

      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove Selected or Existing Image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");

    setForm((previous) => ({
      ...previous,
      bannerImage: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Update Tuition
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.classLevel.trim() ||
      !form.location ||
      !form.monthlyFee ||
      !form.description.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const monthlyFee = Number(form.monthlyFee);
    const daysPerWeek = Number(form.daysPerWeek);

    if (!Number.isFinite(monthlyFee) || monthlyFee <= 0) {
      toast.error("Enter a valid monthly fee.");
      return;
    }

    if (
      !Number.isInteger(daysPerWeek) ||
      daysPerWeek < 1 ||
      daysPerWeek > 7
    ) {
      toast.error("Days per week must be between 1 and 7.");
      return;
    }

    try {
      setSaving(true);

      let bannerImageUrl = form.bannerImage.trim();

      // Upload New Image to ImgBB if Selected
      if (selectedImage) {
        toast.info("Uploading banner image...");

        bannerImageUrl = await uploadImage(selectedImage);
      }

      // Update Tuition Information
      await updateTuition(params.id, {
        title: form.title.trim(),
        subject: form.subject.trim(),
        classLevel: form.classLevel.trim(),
        mode: form.mode,
        location: form.location,
        monthlyFee,
        daysPerWeek,
        bannerImage: bannerImageUrl,
        description: form.description.trim(),
      });

      toast.success(
        "Tuition updated successfully. It is now pending admin approval."
      );

      router.push("/dashboard/tutor/my-tuitions");
    } catch (error) {
      console.error("Update Tuition Error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update tuition. Please try again.";

      toast.error(message);
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4169E1] hover:text-[#2748A5]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Tuitions
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Edit Tuition
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Update your tuition information.
        </p>
      </div>

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

        {/* Mode */}
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
              value={form.monthlyFee}
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
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <img
                  src={imagePreview}
                  alt="Tuition banner preview"
                  className="h-52 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                  aria-label="Remove banner image"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2">
                  <p className="text-xs text-white">
                    {selectedImage
                      ? "New image selected"
                      : "Current banner image"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-950">
                <Camera className="mb-3 h-10 w-10 text-slate-400" />

                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Choose a banner image
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  PNG, JPG, JPEG or WEBP (Maximum 5MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="tuition-banner-upload"
            />

            <label
              htmlFor="tuition-banner-upload"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#4169E1] px-4 py-2.5 text-sm font-medium text-[#4169E1] transition hover:bg-[#4169E1]/10"
            >
              <Camera className="h-4 w-4" />

              {imagePreview ? "Change Image" : "Choose Image"}
            </label>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an image from your device. It will be uploaded when you
              update the tuition.
            </p>
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
            href="/dashboard/tutor/my-tuitions"
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
              <Save className="h-4 w-4" />
            )}

            {saving ? "Updating..." : "Update Tuition"}
          </button>
        </div>
      </form>
    </div>
  );
}