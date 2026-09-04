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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-light-background/85 dark:bg-[#0a0e14]/85 py-3 border-b border-light-subtle/10 dark:border-[#1e2430] shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Desktop Navbar - Mathematically Symmetrical 3-Column Grid */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: Custom logo / masthead */}
          <div className="flex items-center justify-start">
            <Link to="/" className="group inline-flex items-center">
              <span className="font-semibold text-sm sm:text-base tracking-tight text-light-text dark:text-dark-text group-hover:text-[#e6b450] transition-colors">
                Jamal Ibrahim
                <span className="inline-block ml-1.5 h-1.5 w-1.5 rounded-full bg-light-accent dark:bg-[#e6b450] opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
          <Link to="/" className="group">
            <div
              className={`transition-all duration-500 ${
                scrolled
                  ? "bg-glass shadow-subtle px-3 py-1.5 rounded-full border border-light-subtle/10 dark:border-dark-subtle/10"
                  : "px-0 py-0"
              }`}
            >
              <span className="font-semibold text-sm text-light-text dark:text-dark-text">
                Jamal Ibrahim
              </span>
            </div>
          </Link>

          {/* Mobile menu controls */}
          <div className="flex items-center space-x-2">
            <div
              className={`transition-all duration-500 flex items-center justify-center ${
                scrolled
                  ? "bg-glass shadow-subtle border border-light-subtle/10 dark:border-dark-subtle/10 rounded-full p-1.5"
                  : "p-0"
              }`}
            >
              <ThemeToggle />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-all duration-500 active:scale-95 flex items-center justify-center ${
                scrolled
                  ? "p-2 bg-glass shadow-subtle border border-light-subtle/10 dark:border-dark-subtle/10 rounded-full text-light-text dark:text-dark-text"
                  : "p-1.5 text-light-text dark:text-dark-text"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5 text-light-accent dark:text-[#e6b450]" />
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
                    to={item.href as any}
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
