import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "../ui/theme-toggle";
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
import { useAuth } from "../../hooks/useAuth";

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
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-light-background/90 dark:bg-[#0a0e14]/90 py-3 border-b border-light-subtle/15 dark:border-[#1e2430] shadow-sm"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Desktop Navbar - Mathematically Symmetrical 3-Column Grid */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: Custom logo / masthead */}
          <div className="flex items-center justify-start">
            <Link to="/" className="group inline-flex items-center">
              <span className="font-serif italic font-semibold text-base sm:text-lg tracking-tight text-light-text dark:text-dark-text group-hover:text-[#e6b450] transition-colors">
                Jamal Ibrahim
                <span className="inline-block ml-1.5 h-1.5 w-1.5 rounded-full bg-[#e6b450] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </span>
            </Link>
          </div>

          {/* Center: Main menu items (Perfect Mathematical Center) */}
          <div className="flex items-center justify-center">
            <div className="flex items-center p-1 rounded-full bg-light-background/80 dark:bg-[#131721]/80 backdrop-blur-md border border-light-subtle/15 dark:border-[#1e2430] shadow-sm space-x-1">
              {allNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.name}
                    to={item.href as any}
                    className={`px-3.5 py-1 text-xs font-mono font-medium rounded-full transition-all duration-200 flex items-center ${
                      isActive
                        ? "bg-[#e6b450] text-[#0a0e14] font-semibold shadow-sm"
                        : "text-light-text/80 dark:text-[#d9d7d3]/80 hover:text-[#e6b450] dark:hover:text-[#e6b450]"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Theme toggle (Perfect Right Edge Alignment) */}
          <div className="flex items-center justify-end">
            <div className="p-1 rounded-full bg-light-background/80 dark:bg-[#131721]/80 backdrop-blur-md border border-light-subtle/15 dark:border-[#1e2430] shadow-sm flex items-center justify-center">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group inline-flex items-center py-1">
            <span className="font-serif italic font-semibold text-base tracking-tight text-light-text dark:text-dark-text group-hover:text-[#e6b450] transition-colors">
              Jamal Ibrahim
            </span>
          </Link>

          {/* Mobile menu controls */}
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-full bg-light-background/80 dark:bg-[#131721]/80 border border-light-subtle/15 dark:border-[#1e2430] flex items-center justify-center">
              <ThemeToggle />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-light-background/80 dark:bg-[#131721]/80 border border-light-subtle/15 dark:border-[#1e2430] text-light-text dark:text-dark-text focus:outline-none active:scale-95 transition-transform flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-4 w-4 text-[#e6b450]" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop Scrim */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Dropdown Card */}
      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden fixed top-[64px] inset-x-4 mx-auto bg-white dark:bg-[#0e1218] shadow-2xl border border-light-subtle/20 dark:border-[#1e2430] rounded-2xl p-3 z-50 max-w-sm animate-fade-in"
        >
          <div className="space-y-1 font-mono text-xs">
            {allNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.name}
                  to={item.href as any}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] font-semibold border border-[#e6b450]/30"
                      : "text-light-text dark:text-[#d9d7d3] hover:bg-light-subtle/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center">
                    {item.icon}
                    <span className="text-sm font-medium">{item.name}</span>
                  </span>
                  <ChevronRight
                    size={15}
                    className={`transform transition-transform ${isActive ? "text-[#e6b450]" : "opacity-40"}`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
