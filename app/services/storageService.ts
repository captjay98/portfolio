export const storageService = {
  uploadFile: async (file: File, bucketId: string = "portfolio"): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucketId);

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      return data.fileId || data.id;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  getFileView: (fileId: string, bucketId: string = "portfolio"): string => {
    if (!fileId) return "";
    if (fileId.startsWith("http://") || fileId.startsWith("https://")) return fileId;
    if (fileId.startsWith("/")) return fileId;
    return `/api/storage/${fileId}`;
  },

  getFilePreview: (
    fileId: string,
    bucketId: string = "portfolio",
    width: number = 200,
    height: number = 200,
  ): string => {
    return storageService.getFileView(fileId, bucketId);
  },

  deleteFile: async (fileId: string, bucketId: string = "portfolio"): Promise<void> => {
    if (!fileId || fileId.startsWith("/")) return;
    try {
      await fetch(`/api/storage/${encodeURIComponent(fileId)}?bucket=${encodeURIComponent(bucketId)}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  },
};
