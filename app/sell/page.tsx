"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

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

    // Validate all fields (simple check)
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

    await createListing(form);
    setForm({ name: "", description: "", price: "", location: "", image: "" });
    setSuccess(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5e3d2]">
      <div className="mt-[-5%]">
        <h1 className="text-2xl font-bold text-[#5c3b27] mb-6 text-center">
          List an item for sale
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-md space-y-4 bg-white p-6 rounded-xl shadow"
        >
          <input
            name="name"
            placeholder="Item name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Describe the item"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded resize-y min-h-[80px]"
            required
          />

          <div className="flex items-center rounded border overflow-hidden">
            <div className="bg-gray-100 text-gray-700 px-3 py-2 border-r rounded-l">
              $
            </div>
            <input
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-2 outline-none rounded-r"
              type="number"
              required
            />
          </div>

          <input
            name="location"
            placeholder="Meet location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="cursor-pointer w-full bg-gray-100 border text-sm py-2 rounded hover:bg-gray-200 transition"
          >
            {form.image
              ? "Change Image"
              : uploading
                ? "Uploading..."
                : "Upload Image"}
          </button>

          {form.image && (
            <div className="relative w-full h-40 rounded overflow-hidden">
              <Image
                src={form.image}
                alt="Uploaded"
                fill
                className="object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={
              uploading ||
              !form.name.trim() ||
              !form.description.trim() ||
              !form.price.trim() ||
              !form.location.trim() ||
              !form.image.trim()
            }
            className={`w-full py-2 rounded transition ${
              uploading ||
              !form.name.trim() ||
              !form.description.trim() ||
              !form.price.trim() ||
              !form.location.trim() ||
              !form.image.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#5c3b27] text-white hover:bg-[#4b2f20] cursor-pointer"
            }`}
          >
            {uploading ? "Uploading Image..." : "Submit Listing"}
          </button>

          {success && (
            <p className="text-green-600 text-sm pt-2">
              Item listed successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
