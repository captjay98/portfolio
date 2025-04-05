"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Menu,
  X,
  ShieldAlert,
  ChevronRight,
  Home,
  User,
  Briefcase,
  FileText,
  Mail,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { name: "Home", href: "/", icon: <Home size={16} className="mr-1.5" /> },
  {
    name: "About",
    href: "/about",
    icon: <User size={16} className="mr-1.5" />,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: <Briefcase size={16} className="mr-1.5" />,
  },
  {
    name: "Blog",
    href: "/blog",
    icon: <FileText size={16} className="mr-1.5" />,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: <Mail size={16} className="mr-1.5" />,
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle client-side only rendering
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize

    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const allNavItems =
    mounted && user
      ? [
          ...navItems,
          {
            name: "Admin",
            href: "/admin",
            icon: <ShieldAlert size={16} className="mr-1.5" />,
          },
        ]
      : navItems;

  // Get active item for positioning
  const activeItemIndex = allNavItems.findIndex(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-lg py-3" : "py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between">
          {/* Custom glass pill with logo */}
          <Link href="/" className="group">
            <div
              className={`text-center transition-all duration-500 ${
                scrolled
                  ? "bg-glass shadow-subtle px-4 py-2 rounded-full border border-light-subtle/10 dark:border-dark-subtle/10"
                  : "px-0"
              }`}
            >
              <span className="font-bold text-2xl text-light-accent dark:text-dark-accent">
                IUJ
                <span className="inline-block ml-1 h-1.5 w-1.5 rounded-full bg-light-accent dark:bg-dark-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </span>
            </div>
          </Link>

          {/* Main menu items in custom nav pill */}
          <div
            className={`relative bg-glass shadow-elevated border border-light-subtle/10 dark:border-dark-subtle/10 rounded-xl py-2 px-1.5 transition-all duration-500 ${
              scrolled ? "translate-y-0" : "translate-y-0"
            }`}
          >
            {/* Active pill indicator - Position based on active item */}
            <div
              className={`absolute top-1.5 left-0 h-[calc(100%-12px)] bg-light-accent/20 dark:bg-dark-accent/20 rounded-full z-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                activeItemIndex === -1 ? "opacity-0" : "opacity-100"
              }`}
            />

            <div className="relative z-10 flex items-center space-x-1">
              {allNavItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <div key={item.name} className="relative">
                    <Link
                      href={item.href}
                      className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 flex items-center ${
                        isActive
                          ? "text-light-accent dark:text-dark-accent"
                          : "text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theme toggle in its own pill */}
          <div
            className={`bg-glass shadow-subtle border border-light-subtle/10 dark:border-dark-subtle/10 rounded-full p-2 transition-all duration-500 ${
              scrolled ? "translate-y-0" : "translate-y-0"
            }`}
          >
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group">
            <div
              className={`transition-all duration-500 ${
                scrolled
                  ? "bg-glass shadow-subtle px-3 py-1.5 rounded-full border border-light-subtle/10 dark:border-dark-subtle/10"
                  : "px-0"
              }`}
            >
              <span className="font-bold text-xl text-light-accent dark:text-dark-accent">
                IUJ
              </span>
            </div>
          </Link>

          {/* Mobile menu controls */}
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-glass shadow-subtle border border-light-subtle/10 dark:border-dark-subtle/10 rounded-full">
              <ThemeToggle />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-glass shadow-subtle border border-light-subtle/10 dark:border-dark-subtle/10 rounded-full text-light-text dark:text-dark-text focus:outline-none transition-transform active:scale-95"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5 text-light-accent dark:text-dark-accent" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          ref={menuRef}
          className="backdrop-blur-lg md:hidden fixed top-[72px] inset-x-4 mx-auto bg-glass shadow-elevated border border-light-subtle/10 dark:border-dark-subtle/20 rounded-2xl p-4 z-50 max-w-sm animate-slideDown"
        >
          <div className="space-y-1">
            {allNavItems.map((item, index) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <div
                  key={item.name}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium ${
                      isActive
                        ? "bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent"
                        : "text-light-text dark:text-dark-text hover:bg-light-subtle/5 dark:hover:bg-dark-subtle/5"
                    }`}
                  >
                    <span className="flex items-center">
                      {item.icon}
                      {item.name}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`transform transition-transform ${isActive ? "text-light-accent dark:text-dark-accent" : "opacity-40"}`}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
