import { profileService } from "@/services/profileService";
import { currentTechStackService } from "@/services/currentTechStackService";
import TechStackSection from "@/components/home/TechStackSection";
import DynamicProfileContent from "@/components/home/DynamicProfileContent";
import VisitorCounter from "@/components/home/visitor-counter";

export default async function HomePage() {
  // Fetch all required data in parallel
  const [profile, currentTechStack, socialLinks] = await Promise.all([
    profileService.getProfile(),
    currentTechStackService.getCurrentTechsWithDetails(),
    profileService.getSocialLinks(),
  ]);

  // Filter for visible social links
  const visibleSocialLinks = socialLinks.filter((link) => link.is_visible);

  return (
    <main className="min-h-screen animate-fade-in">
      <section className="min-h-screen w-[99%] m-auto my-2 rounded-2xl md:bg-glass shadow-subtle p-4 flex flex-col md:flex-row justify-center md:items-center md:gap-12 lg:gap-64">
        {/* Profile Section */}
        <div className="text-center max-w-2xl mx-auto md:mx-0 max-sm:mt-12 max-sm:mb-8 animate-fade-in-up">
          <DynamicProfileContent
            profile={profile}
            socialLinks={visibleSocialLinks}
          />
        </div>

        {/* Tech Stack Section - Using the component with 3D animation */}
        {currentTechStack?.length > 0 && (
          <TechStackSection techStacks={currentTechStack} />
        )}
      </section>

      {/* Visitor Counter - Fixed position at bottom right */}
      <div className="fixed bottom-6 right-6 z-20">
        <VisitorCounter />
      </div>
    </main>
  );
}
