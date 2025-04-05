import { Mail } from "lucide-react";
import { profileService } from "@/services/profileService";
import LucideIcon from "@/components/LucideIcon";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  // Fetch social links on the server
  const socialLinks = await profileService.getSocialLinks();
  // Only display visible links, sort by priority
  const visibleLinks = socialLinks
    .filter((link) => link.is_visible)
    .sort((a, b) => a.priority - b.priority);

  return (
    <main className="min-h-screen max-h-screen overflow-y-auto pb-16">
      <div className="w-full px-4 py-6 md:py-12 mt-10">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 animate-fade-in">
            <p className="text-light-subtle dark:text-dark-subtle max-w-2xl mx-auto">
              Let&apos;s connect! Reach out for collabs, opportunities, help, or
              just to say Hi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1 animate-fade-in-up">
              <div className="bg-glass rounded-xl shadow-elevated effect-3d overflow-hidden border border-light-subtle/10 dark:border-dark-subtle/20 h-full hover:shadow-lg transition-shadow duration-300 p-6">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center">
                  <Mail className="mr-2" size={20} />
                  Contact Information
                </h2>

                <div className="mb-6">
                  <p className="text-light-subtle dark:text-dark-subtle mb-2">
                    You can get in touch with me through the following channels:
                  </p>
                  <p className="flex gap-2 text-light-accent dark:text-dark-accent">
                    <Mail /> captjay98@gmail.com
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-light-text dark:text-dark-text">
                    Socials:
                  </h3>

                  {visibleLinks.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {visibleLinks.map((link, index) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-light-subtle/10 dark:bg-dark-subtle/10 hover:bg-light-subtle/20 dark:hover:bg-dark-subtle/20 rounded-md text-light-text dark:text-dark-text transition-all hover:scale-105 active:scale-95"
                          style={{
                            animationName: "fadeInUp",
                            animationDuration: "0.5s",
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: "both",
                          }}
                        >
                          <LucideIcon name={link.icon} />
                          <span>{link.platform}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-light-subtle dark:text-dark-subtle">
                      No social links available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form - Using client component */}
            <div
              className="md:col-span-2 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
