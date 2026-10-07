"use client";

import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileImage } from "@/hooks";
import { getFallbackText } from "@/utils/fallback.avater";

const MAX_MB = 3;

export function ProfileAvatarUpload({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate, isPending } = useProfileImage();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_MB}MB`);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    mutate(file, {
      onSuccess: (res: unknown) => {
        const message =
          (res as { message?: string } | undefined)?.message ??
          "Profile photo updated";
        toast.success(message);
      },
      onError: (err: unknown) => {
        const message =
          (err as { message?: string } | undefined)?.message ?? "Upload failed";
        toast.error(message);
        setPreview(null);
      },
    });
  };

  return (
    <div className="relative h-20 w-20 shrink-0">
      <Avatar className="h-20 w-20 bg-primary text-primary-foreground">
        <AvatarImage src={preview ?? imageUrl ?? ""} alt={name} />
        <AvatarFallback className="bg-primary text-[22px] font-bold text-primary-foreground">
          {getFallbackText(name || "U")}
        </AvatarFallback>
      </Avatar>
      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40">
          <Loader2 className="h-5 w-5 animate-spin text-background" />
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        aria-label="Change profile photo"
        title="Change profile photo"
        className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow transition hover:bg-primary/90 disabled:opacity-60"
      >
        <Camera className="h-4 w-4" />
      </button>
    </div>
  );
}
