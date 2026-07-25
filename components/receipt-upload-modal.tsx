"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmountInput } from "@/components/ui/amount-input";
import { Modal } from "@/components/ui/modal";
import { TextArea } from "@/components/ui/text-area";
import { useUploadContribution } from "@/hooks/use-cycles";
import { useToast } from "@/components/toast";
import { formatNaira } from "@/lib/utils";

const schema = z.object({
  amount: z
    .number({ error: "Enter the amount you sent" })
    .positive("Enter the amount you sent"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ReceiptUploadModalProps {
  open: boolean;
  onClose: () => void;
  cycleId: string;
  groupId: string;
  defaultAmount: number;
  collectorName: string;
  onSuccess: () => void;
}

export function ReceiptUploadModal({
  open,
  onClose,
  cycleId,
  groupId,
  defaultAmount,
  collectorName,
  onSuccess,
}: ReceiptUploadModalProps) {
  const { toast } = useToast();
  const upload = useUploadContribution(cycleId, groupId);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: defaultAmount, note: "" },
  });

  async function onSubmit(values: FormValues) {
    if (!file) {
      setFileError("Choose a receipt image or PDF to upload.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("receipt", file);
      formData.append("amount", String(values.amount));
      if (values.note?.trim()) {
        formData.append("note", values.note.trim());
      }
      await upload.mutateAsync(formData);
      toast("Receipt uploaded");
      reset();
      setFile(null);
      onSuccess();
      onClose();
    } catch {
      toast("Could not upload your receipt. Try again.", "error");
    }
  }

  function handleClose() {
    reset({ amount: defaultAmount, note: "" });
    setFile(null);
    setFileError("");
    onClose();
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
      title="Upload your receipt"
      description={
        <>
          Show that you paid {collectorName}{" "}
          <span className="font-mono">{formatNaira(defaultAmount)}</span>.
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">
            Receipt file
          </label>
          <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary-light/60 bg-bg px-4 py-8 transition-colors hover:border-secondary hover:bg-primary-light/10">
            <Upload className="h-6 w-6 text-primary transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="text-sm text-text-muted">
              {file ? file.name : "Tap to choose an image or PDF"}
            </span>
            <input
              type="file"
              name="receipt"
              accept="image/*,.pdf"
              className="sr-only"
              onChange={(e) => {
                const selected = e.target.files?.[0] ?? null;
                setFile(selected);
                setFileError("");
              }}
            />
          </label>
          {fileError && (
            <p className="mt-1.5 text-xs text-danger">{fileError}</p>
          )}
        </div>

        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <AmountInput
              label="Amount"
              name={field.name}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange(value ?? Number.NaN)}
              error={errors.amount?.message}
              placeholder="e.g. 10,000"
            />
          )}
        />

        <TextArea
          label="Note (optional)"
          placeholder="e.g. Sent via GTBank transfer"
          {...register("note")}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth disabled={upload.isPending}>
            {upload.isPending ? "Uploading…" : "Upload receipt"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
