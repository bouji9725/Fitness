"use client";

import { useRef, useState } from "react";
import Button from "@frontend/components/ui/Button";
import { addProgressPhoto, deleteProgressPhoto } from "@frontend/api/progress-api";
import { useToast } from "@frontend/context/ToastContext";
import EmptyState from "@frontend/components/ui/EmptyState";
import type { ProgressPhotoEntry } from "@shared/types/progress";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

type Props = {
  initialPhotos: ProgressPhotoEntry[];
};

export default function ProgressPhotoSection({ initialPhotos }: Props) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<ProgressPhotoEntry[]>(initialPhotos);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [label, setLabel] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setSelectedFile(null);
    setPreview(null);
    setFileError(null);
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setFileError("Image must be under 5 MB. Please choose a smaller file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!selectedFile) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("date", date);
      if (label.trim()) {
        formData.append("label", label.trim());
      }

      const entry = await addProgressPhoto(formData);
      setPhotos((prev) => [entry, ...prev]);
      setSelectedFile(null);
      setPreview(null);
      setLabel("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast("Photo saved.", "success");
    } catch {
      toast("Failed to save photo.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteProgressPhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast("Photo removed.", "success");
    } catch {
      toast("Failed to remove photo.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Progress photos
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Photo check-ins
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Upload a photo to track visual changes over time. Photos are stored privately in your account.
        </p>
      </div>

      {/* Upload form */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="photo-date" className="text-sm font-medium text-slate-300">
              Date
            </label>
            <input
              id="photo-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-400/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="photo-label" className="text-sm font-medium text-slate-300">
              Label (optional)
            </label>
            <input
              id="photo-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Front view, Week 12"
              className="rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-400/50"
            />
          </div>
        </div>

        {/* File picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Photo</label>
          <label
            htmlFor="photo-file"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-5 text-sm text-slate-400 transition hover:border-indigo-400/40 hover:text-slate-200"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {preview ? "Change photo" : "Choose a photo — max 5 MB"}
            <input
              id="photo-file"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
          {fileError && (
            <p className="text-sm text-red-300" role="alert">{fileError}</p>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div className="relative w-fit">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 rounded-2xl border border-white/10 object-cover"
            />
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!preview || saving}
          className="w-full sm:w-auto"
        >
          {saving ? "Saving…" : "Save photo"}
        </Button>
      </div>

      {/* Gallery */}
      {photos.length === 0 ? (
        <EmptyState title="No photos yet" description="Upload your first check-in photo above." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <img
                src={photo.imageUrl}
                alt={photo.label ?? photo.date}
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="p-3">
                <p className="text-xs font-medium text-white">{photo.date}</p>
                {photo.label && (
                  <p className="mt-0.5 text-xs text-slate-400">{photo.label}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deletingId === photo.id}
                className="absolute right-2 top-2 rounded-xl bg-red-500/80 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
              >
                {deletingId === photo.id ? "…" : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
