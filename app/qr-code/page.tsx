"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const reviewUrl = "http://localhost:3000/reviews/leave?invite=demo-atlanta";

export default function QRCodePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "success" | "error">("idle");

  useEffect(() => {
    // Generate QR code on component mount
    if (canvasRef.current) {
      void QRCode.toCanvas(canvasRef.current, reviewUrl, {
        errorCorrectionLevel: "H",
        margin: 1,
        color: {
          dark: "#0f766e",
          light: "#ffffff",
        },
      }).catch((error) => {
        console.error("Error generating QR code:", error);
      });
    }
  }, []);

  const handleDownloadQR = async () => {
    try {
      setDownloadStatus("downloading");

      const canvas = canvasRef.current;
      if (!canvas) {
        setDownloadStatus("error");
        return;
      }

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          setDownloadStatus("error");
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `review-invitation-qr-code-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setDownloadStatus("success");
        setTimeout(() => setDownloadStatus("idle"), 3000);
      });
    } catch (error) {
      console.error("Error downloading QR code:", error);
      setDownloadStatus("error");
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(reviewUrl);
      alert("URL copied to clipboard!");
    } catch {
      alert("Failed to copy URL");
    }
  };

  return (
    <div className="page-shell">
      <div className="section-wrap py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--spruce)]">
              QR Code Generator
            </div>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-950">
              Review Invitation QR Code
            </h1>
            <p className="mt-4 text-slate-600">
              Scan this QR code to access the review invitation page. Download or share it with your customers.
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-3xl p-8 text-center">
            {/* QR Code Display */}
            <div className="mb-8 inline-block rounded-2xl border-4 border-[var(--spruce)] bg-white p-6">
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
              />
            </div>

            {/* URL Display */}
            <div className="mb-6 break-all rounded-lg bg-slate-50 p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-600">
                Review URL
              </div>
              <div className="text-sm font-mono text-slate-700">
                {reviewUrl}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={handleDownloadQR}
                disabled={downloadStatus === "downloading"}
                className="button-primary"
              >
                {downloadStatus === "downloading" && "Downloading..."}
                {downloadStatus === "success" && "✓ Downloaded!"}
                {downloadStatus === "error" && "Try Again"}
                {downloadStatus === "idle" && "📥 Download QR Code"}
              </button>
              <button
                onClick={handleCopyUrl}
                className="button-secondary"
              >
                📋 Copy URL
              </button>
            </div>

            {/* Status Message */}
            {downloadStatus === "success" && (
              <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                ✓ QR code downloaded successfully to your device!
              </div>
            )}

            {downloadStatus === "error" && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                ✗ Failed to download QR code. Please try again.
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-2xl">📱</div>
              <h3 className="mt-3 font-bold text-slate-950">Mobile Friendly</h3>
              <p className="mt-2 text-sm text-slate-600">
                Customers can scan with any smartphone camera or QR code reader app.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-2xl">💾</div>
              <h3 className="mt-3 font-bold text-slate-950">Easy Download</h3>
              <p className="mt-2 text-sm text-slate-600">
                Save the QR code image and use it in marketing materials, emails, or print.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-2xl">🎯</div>
              <h3 className="mt-3 font-bold text-slate-950">Direct Access</h3>
              <p className="mt-2 text-sm text-slate-600">
                Links directly to the review invitation page for seamless customer experience.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="mt-12 rounded-2xl bg-blue-50 p-8">
            <h2 className="mb-4 font-bold text-slate-950">How to Use</h2>
            <ol className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="font-bold text-[var(--spruce)]">1.</span>
                <span>Download the QR code using the button above</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--spruce)]">2.</span>
                <span>Use the image in your marketing materials, emails, SMS, or print</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--spruce)]">3.</span>
                <span>Customers scan the code with their phone camera</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[var(--spruce)]">4.</span>
                <span>They're instantly taken to the review invitation page</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
