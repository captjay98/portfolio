import { databases, ID, appwriteConfig } from "@/lib/appwrite";

export interface ProfileData {
  full_name: string;
  nickname: string;
  title: string;
  bio_short: string;
  bio_long: string;
  location: string;
  avatar: string;
  avatar_id?: string;
  cover_image?: string;
  cover_image_id?: string;
  resume_url?: string;
  meta_description?: string;
}

export const profileData: ProfileData = {
  full_name: "Jamal Ibrahim Umar",
  nickname: "CaptJay",
  title: "Software Engineer",
  bio_short:
    "Just building things while througly enjoying the process, because well; it's part of my Ikigai",
  bio_long: `Since my childhood, I've been a tech geek with an insatiable curiosity for all things, especially digital. It was clear to me from an early age that my future lay in the world of technology; I just hadn't quite figured out the specific path I wanted to take.

### The Beginning
My proper journey into the tech world began with me spending countless hours tinkering with custom ROMs, bricking and unbricking my devices. This hands-on experience not only further fueled my passion for technology but also sparked my desire to dive deeper into the realm of software development.

### The Decision
In 2019, I made the decision to pursue a career in software engineering. Following my university education, I embarked on a transformative journey by enrolling in the **ALX Software Engineering** program.

### My Focus
Since then, I've been dedicated to:
* 🚀 Expanding my knowledge and skills
* 🔍 Constantly pushing the boundaries of what I can achieve in the world of software
* 💻 Building things while thoroughly enjoying the process, because well; it's part of my Ikigai

### Today
I proudly stand as a Software Engineer with:
* 🔥 A deep-rooted passion for technology
* 📚 A commitment to lifelong learning
* 🌟 A desire to make a meaningful impact through my work
`,
  location: "Kaduna, Nigeria",
  avatar: "/profile/default-avatar.webp",
  meta_description:
    "Software Engineer currently using Laravel, Next.js and Flutter to Build scalable web and mobile applications. While exploring other modern technologies.",
};

export const seedProfile = async () => {
  console.log("Seeding profile data...");

  try {
    // Check if profile already exists
    const existingProfiles = await databases.listDocuments(
      appwriteConfig.databaseId,
      "profile",
    );

    if (existingProfiles.documents.length > 0) {
      console.log("Profile already exists, skipping seeding");
      return;
    }

    // Create profile
    await databases.createDocument(
      appwriteConfig.databaseId,
      "profile",
      ID.unique(),
      profileData,
    );

    console.log("✅ Profile data seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding profile data:", error);
    throw error;
  }
};
