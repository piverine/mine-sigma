"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const router = useRouter();

  // 1. Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // 2. Send File to Python Backend
  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus("processing");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 👉 CONNECTING TO YOUR FASTAPI BACKEND HERE
      const response = await fetch("http://127.0.0.1:8000/analyze-mine", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.blob();
      console.log("Analysis complete:", data);
      
      setStatus("success");
      
      // Redirect to the dashboard to see the results
      setTimeout(() => {
        router.push("/officer"); // Redirects to the Officer Dashboard
      }, 2000);

    } catch (error) {
      console.error("Error uploading:", error);
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Mining Lease Document</h1>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors">
        <div className="space-y-4">
          <div className="flex justify-center">
            {/* Icon */}
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div className="text-gray-600">
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:underline font-medium">Click to upload</span>
              <span className="mx-1">or drag and drop</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">PDF, PNG or JPG (MAX. 10MB)</p>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      {file && (
        <div className="mt-6 bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded text-blue-600">
                📄
              </div>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            {status === 'idle' && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {uploading ? "Processing..." : "Run Analysis"}
              </button>
            )}

            {status === 'processing' && (
              <span className="text-blue-600 text-sm font-medium animate-pulse">
                🛰️ Connecting to Satellite...
              </span>
            )}

            {status === 'success' && (
              <span className="text-green-600 text-sm font-medium">
                ✅ Analysis Complete! Redirecting...
              </span>
            )}
            
            {status === 'error' && (
              <span className="text-red-600 text-sm font-medium">
                ❌ Server Error. Check Backend Terminal.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}