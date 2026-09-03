import { Mail, Clock, MapPin, Send, ArrowUpRight } from "lucide-react";
import LucideIcon from "@app/components/LucideIcon";
import ContactForm from "./ContactForm";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  is_visible: boolean;
  priority: number;
}

interface ContactPageProps {
  profile: any;
  socialLinks: SocialLink[];
}

export default function ContactPage({ profile, socialLinks }: ContactPageProps) {
  // Only display visible links, sort by priority
  const visibleLinks = socialLinks
    .filter((link) => link.is_visible)
    .sort((a, b) => a.priority - b.priority);

  return (
    <main className="min-h-screen pb-24 animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        {/* Header Section */}
        <header className="space-y-4 pb-10 border-b border-light-subtle/15 dark:border-dark-subtle/15 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase border border-[#e6b450]/40 bg-[#e6b450]/10 text-[#e6b450]">
            <Send size={12} />
            <span>Correspondence Desk // Inquiries</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-light-text dark:text-[#ffffff] tracking-tight">
            Write a Letter or Inquiry
          </h1>

          <p className="font-serif italic text-lg text-light-subtle dark:text-[#d9d7d3]/80 leading-relaxed">
            I am available for distributed systems engineering, architecture advisery, and technical collaborations.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Desk Correspondence Dossier / Side Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/50 dark:bg-[#131721]/60 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-medium text-light-text dark:text-dark-text mb-2">
                  Direct Correspondence
                </h2>
                <p className="text-xs sm:text-sm text-light-subtle dark:text-[#949dab] leading-relaxed">
                  For formal requests, confidential proposals, or direct dialogue, you may write to me directly:
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <a
                  href="mailto:captjay98@gmail.com"
                  className="p-3 rounded-lg border border-[#e6b450]/30 bg-[#e6b450]/5 text-[#e6b450] flex items-center justify-between hover:bg-[#e6b450]/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Mail size={14} />
                    <span>captjay98@gmail.com</span>
                  </span>
                  <ArrowUpRight size={13} />
                </a>

                <div className="p-3 rounded-lg border border-light-subtle/10 dark:border-[#1e2430] bg-light-subtle/5 dark:bg-[#0a0e14] text-light-subtle dark:text-dark-subtle space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#e6b450]" />
                    <span>Turnaround: 24–48 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#e6b450]" />
                    <span>Location: Copenhagen / London</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-light-subtle/10 dark:border-dark-subtle/10 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle">
                  Public Key &amp; Profiles
                </h3>

                <div className="flex flex-wrap gap-2">
                  {visibleLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border border-light-subtle/20 dark:border-[#1e2430] bg-light-background/60 dark:bg-[#0a0e14] text-light-text dark:text-dark-text hover:border-[#e6b450]/50 hover:text-[#e6b450] transition-colors"
                    >
                      <LucideIcon name={link.icon} size={12} />
                      <span>{link.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Letter / Inquiry Form Container */}
          <div className="md:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl border border-light-subtle/15 dark:border-[#1e2430] bg-light-background/50 dark:bg-[#131721]/60">
              <div className="mb-6 space-y-1">
                <h2 className="font-serif text-2xl font-medium text-light-text dark:text-dark-text">
                  Dispatch Message
                </h2>
                <p className="text-xs font-mono text-light-subtle dark:text-dark-subtle">
                  Transmitted directly to Cloudflare D1 and email dispatch
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
