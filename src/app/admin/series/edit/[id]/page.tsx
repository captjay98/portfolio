"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { BlogSeriesType } from "../../../../../types/admin";
import { blogService } from "@/services/blogService";
import SeriesForm from "../../components/SeriesForm";
import React from "react";
import { useParams } from "next/navigation";

export default function EditSeries() {
  const router = useRouter();
  const [series, setSeries] = useState<BlogSeriesType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const params = useParams<{ id: string }>();
  const id = params.id;

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const seriesData = await blogService.getSeries(id);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching series:", error);
        toast.error("Failed to load series");
        router.push("/admin/series");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [id, router]);

  const handleSubmit = async (
    data: Omit<BlogSeriesType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ) => {
    if (!series) return;

    setSubmitting(true);
    const toastId = toast.loading("Updating series...");

    try {
      await blogService.updateSeries(series.id, data, imageFile);
      toast.success("Series updated successfully", { id: toastId });
      router.push("/admin/series");
    } catch (error) {
      console.error("Error updating series:", error);
      toast.error("Failed to update series", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium">Series not found</h2>
        <Button
          onClick={() => router.push("/admin/series")}
          variant="secondary"
          className="mt-4"
        >
          Back to Series
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Edit Series</h2>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/series")}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>

      <SeriesForm
        series={series}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
      />
    </div>
  );
}
