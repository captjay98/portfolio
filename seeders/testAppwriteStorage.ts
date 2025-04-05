import { PORTFOLIO_BUCKET_ID } from "@/lib/appwrite";
import { storageService } from "@/services/storageService";

/**
 * This file contains functions to test Appwrite storage connection
 * Run with: npx ts-node -r tsconfig-paths/register seeders/testAppwriteStorage.ts
 */

// Test function to verify Appwrite connection and bucket
export const testAppwriteStorage = async () => {
  try {
    console.log("Testing Appwrite storage connection...");
    console.log(`Using bucket ID: ${PORTFOLIO_BUCKET_ID}`);

    // Create a small test file
    const textEncoder = new TextEncoder();
    const fileContent = textEncoder.encode("Test file content");
    const testFile = new File([fileContent], "test-file.txt", {
      type: "text/plain",
    });

    // Attempt to upload the test file
    console.log("Attempting to upload test file...");
    const fileId = await storageService.uploadFile(
      testFile,
      PORTFOLIO_BUCKET_ID,
    );

    if (fileId) {
      console.log(`Successfully uploaded test file with ID: ${fileId}`);

      // Test getting the file view URL
      const fileUrl = storageService.getFileView(fileId, PORTFOLIO_BUCKET_ID);
      console.log(`File view URL: ${fileUrl}`);

      // Clean up - delete the test file
      console.log("Deleting test file...");
      await storageService.deleteFile(fileId, PORTFOLIO_BUCKET_ID);
      console.log("Test file deleted successfully.");

      return true;
    } else {
      console.error("Upload failed - no file ID returned");
      return false;
    }
  } catch (error) {
    console.error("Error testing Appwrite storage:", error);
    return false;
  }
};

// Run the test
testAppwriteStorage()
  .then((success) => {
    if (success) {
      console.log("✅ Appwrite storage test completed successfully");
    } else {
      console.log("❌ Appwrite storage test failed");
    }
  })
  .catch((error) => {
    console.error("Error running test:", error);
  });
