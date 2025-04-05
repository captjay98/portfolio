"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { BlogSeriesType } from "../../../../types/admin";
import { blogService } from "@/services/blogService";
import SeriesForm from "../components/SeriesForm";

export default function NewSeries() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (
    data: Omit<BlogSeriesType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ) => {
    setSubmitting(true);
    const toastId = toast.loading("Creating series...");

    try {
      await blogService.createSeries(data, imageFile);
      toast.success("Series created successfully", { id: toastId });
      router.push("/admin/series");
    } catch (error) {
      console.error("Error creating series:", error);
      toast.error("Failed to create series", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Create New Series</h2>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/series")}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>

      <SeriesForm onSubmit={handleSubmit} isSubmitting={submitting} />
    </div>
  );
}
