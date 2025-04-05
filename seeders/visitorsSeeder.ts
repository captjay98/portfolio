import {
  databases,
  ID,
  appwriteConfig,
  VISITORS_COLLECTION_ID,
  GUEST_BOOK_COLLECTION_ID,
} from "@/lib/appwrite";

export const seedVisitors = async () => {
  try {
    console.log("🔢 Seeding visitors...");

    // Create total counter document
    await databases.createDocument(
      appwriteConfig.databaseId,
      VISITORS_COLLECTION_ID,
      ID.unique(),
      {
        timestamp: new Date().toISOString(),
        visit_count: 1,
        is_total_counter: true,
        total_count: 1,
      },
    );
    console.log("Created total counter document");

    // Create a few sample visit records
    const sampleVisits = [
      {
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        ip_address: "127.0.0.1",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        referrer: "https://github.com",
        page: "/",
        visit_count: 1,
        session_id: "session_1",
        is_total_counter: false,
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
        ip_address: "127.0.0.2",
        user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        referrer: "https://linkedin.com",
        page: "/projects",
        visit_count: 1,
        session_id: "session_2",
        is_total_counter: false,
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        ip_address: "127.0.0.3",
        user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        referrer: "https://twitter.com",
        page: "/blog",
        visit_count: 1,
        session_id: "session_3",
        is_total_counter: false,
      },
    ];

    for (const visit of sampleVisits) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        VISITORS_COLLECTION_ID,
        ID.unique(),
        visit,
      );
    }
    console.log(`Created ${sampleVisits.length} sample visits`);

    // Seed guestbook messages
    console.log("📝 Seeding guestbook messages...");

    const sampleMessages = [
      {
        name: "Sarah Johnson",
        message:
          "Amazing portfolio! The projects are impressive and I love the clean design.",
        date: new Date(Date.now() - 3600000 * 48).toISOString().split("T")[0], // 2 days ago
      },
      {
        name: "Mike Rodriguez",
        message:
          "Great work! I especially liked your approach to the Kalbites project.",
        date: new Date(Date.now() - 3600000 * 36).toISOString().split("T")[0], // 1.5 days ago
      },
      {
        name: "Tech Enthusiast",
        message:
          "Your tech stack is impressive! Looking forward to seeing more of your work.",
        date: new Date(Date.now() - 3600000 * 12).toISOString().split("T")[0], // 12 hours ago
      },
      {
        name: "Fellow Developer",
        message:
          "Nice portfolio site. The animations are smooth and the UI is intuitive. Great job!",
        date: new Date().toISOString().split("T")[0], // Today
      },
    ];

    for (const message of sampleMessages) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        GUEST_BOOK_COLLECTION_ID,
        ID.unique(),
        message,
      );
    }
    console.log(`Created ${sampleMessages.length} sample guestbook messages`);

    console.log("✅ Visitors and guestbook seeding complete!");
    return Promise.resolve();
  } catch (error) {
    console.error("Error seeding visitors and guestbook:", error);
    return Promise.reject(error);
  }
};

export default seedVisitors;
