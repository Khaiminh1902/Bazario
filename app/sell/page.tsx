"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import {
  Upload,
  DollarSign,
  MapPin,
  Package,
  FileText,
  Camera,
  CheckCircle,
  Loader,
} from "lucide-react";

export default function SellPage() {
  const createListing = useMutation(api.listings.createListing);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bazario_unsigned");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dzosh9ltv/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, description, price, location, image } = form;

    if (
      !name.trim() ||
      !description.trim() ||
      !price.trim() ||
      !location.trim() ||
      !image.trim()
    ) {
      alert("Please fill in all fields and upload an image before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      await createListing(form);
      setForm({
        name: "",
        description: "",
        price: "",
        location: "",
        image: "",
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pl-27 min-h-screen bg-[#f5e3d2] py-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Package className="w-8 h-8 text-[#5c3b27]" />
          </div>
          <h1 className="text-4xl font-bold text-[#5c3b27] mb-2">
            List Your Item
          </h1>
          <p className="text-[#5c3b27] opacity-70 text-lg">
            Share your item with the Bazario community
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-800 font-semibold">Success!</p>
              <p className="text-green-700 text-sm">
                Your item has been listed successfully!
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#5c3b27] font-semibold text-lg">
              <Package className="w-5 h-5" />
              Item Name
            </label>
            <input
              name="name"
              placeholder="What are you selling?"
              value={form.name}
              onChange={handleChange}
              className="w-full p-4 border-2 border-[#f5e3d2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c3b27] focus:border-[#5c3b27] transition-all duration-200 text-[#5c3b27] placeholder-[#5c3b27] placeholder-opacity-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#5c3b27] font-semibold text-lg">
              <FileText className="w-5 h-5" />
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your item in detail..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full p-4 border-2 border-[#f5e3d2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c3b27] focus:border-[#5c3b27] transition-all duration-200 text-[#5c3b27] placeholder-[#5c3b27] placeholder-opacity-50 resize-y min-h-[120px]"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#5c3b27] font-semibold text-lg">
                <DollarSign className="w-5 h-5" />
                Price
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <DollarSign className="w-5 h-5 text-[#5c3b27] opacity-50" />
                </div>
                <input
                  name="price"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-[#f5e3d2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c3b27] focus:border-[#5c3b27] transition-all duration-200 text-[#5c3b27] placeholder-[#5c3b27] placeholder-opacity-50"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#5c3b27] font-semibold text-lg">
                <MapPin className="w-5 h-5" />
                Meeting Location
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <MapPin className="w-5 h-5 text-[#5c3b27] opacity-50" />
                </div>
                <input
                  name="location"
                  placeholder="Where can buyers meet you?"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-[#f5e3d2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c3b27] focus:border-[#5c3b27] transition-all duration-200 text-[#5c3b27] placeholder-[#5c3b27] placeholder-opacity-50"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#5c3b27] font-semibold text-lg">
              <Camera className="w-5 h-5" />
              Item Photo
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!form.image ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full p-8 border-2 border-dashed border-[#f5e3d2] rounded-xl hover:border-[#5c3b27] hover:bg-[#f5e3d2] transition-all duration-200 flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader className="w-8 h-8 text-[#5c3b27] animate-spin" />
                    <p className="text-[#5c3b27] font-medium">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#5c3b27] opacity-50" />
                    <p className="text-[#5c3b27] font-medium">
                      Click to upload an image
                    </p>
                    <p className="text-[#5c3b27] opacity-50 text-sm">
                      PNG, JPG up to 10MB
                    </p>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-[#f5e3d2]">
                  <Image
                    src={form.image}
                    alt="Uploaded item"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-3 px-4 border-2 border-[#f5e3d2] rounded-xl text-[#5c3b27] font-medium hover:bg-[#f5e3d2] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {uploading ? "Uploading..." : "Change Image"}
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={
              uploading ||
              submitting ||
              !form.name.trim() ||
              !form.description.trim() ||
              !form.price.trim() ||
              !form.location.trim() ||
              !form.image.trim()
            }
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
              uploading ||
              submitting ||
              !form.name.trim() ||
              !form.description.trim() ||
              !form.price.trim() ||
              !form.location.trim() ||
              !form.image.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#5c3b27] text-white hover:bg-[#3f2a1b] shadow-lg hover:shadow-xl cursor-pointer"
            }`}
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creating Listing...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                List My Item
              </>
            )}
          </button>

          <div className="text-center pt-4">
            <p className="text-[#5c3b27] opacity-60 text-sm">
              By listing your item, you agree to meet buyers in safe, public
              locations.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
