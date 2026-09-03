"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Modal } from "@/components/ui/modal";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;

function receiptPath(url: string): string {
  try {
    return new URL(url, "http://local").pathname;
  } catch {
    return url.split("?")[0] ?? url;
  }
}

function isImageReceipt(url: string): boolean {
  return IMAGE_EXT.test(receiptPath(url));
}

interface ReceiptPreviewProps {
  url: string;
  payerName: string;
}

export function ReceiptPreview({ url, payerName }: ReceiptPreviewProps) {
  const [enlarged, setEnlarged] = useState(false);

  if (isImageReceipt(url)) {
    return (
      <>
        <button
          type="button"
          onClick={() => setEnlarged(true)}
          className="mt-2 block w-full max-w-55 overflow-hidden rounded-lg border border-primary-light/30 bg-bg text-left transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
          aria-label={`Enlarge receipt from ${payerName}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote receipt URLs vary by storage host */}
          <img
            src={url}
            alt={`Receipt from ${payerName}`}
            className="max-h-40 w-full object-contain object-left"
          />
          <span className="block border-t border-primary-light/20 px-2 py-1 text-[11px] font-medium text-secondary">
            Tap to enlarge
          </span>
        </button>
        <Modal
          open={enlarged}
          onOpenChange={setEnlarged}
          title="Receipt"
          description={`Uploaded by ${payerName}`}
          className="sm:max-w-2xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`Receipt from ${payerName}`}
            className="mx-auto max-h-[70vh] w-full object-contain"
          />
        </Modal>
      </>
    );
  }

  // PDFs and unknown types open in a new tab (browsers render PDFs natively).
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
    >
      View receipt
      <ExternalLink className="h-3 w-3" aria-hidden />
    </a>
  );
}
