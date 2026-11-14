import { useState, useRef, useEffect } from 'react';
import { Menu, X, Compass, ChevronDown } from 'lucide-react';
import { PageId } from '../types/equipment';
import { DiscoveriesTabId } from '../pages/DiscoveriesPage';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onNavigateDiscoveries: (tab: DiscoveriesTabId) => void;
}

interface NavGroupItem {
  label: string;
  defaultPage: PageId;
  matchPages: PageId[];
  subLinks: {
    label: string;
    page: PageId;
    discoveriesTab?: DiscoveriesTabId;
  }[];
}

const DESKTOP_GROUPS: NavGroupItem[] = [
  {
    label: 'Explore',
    defaultPage: 'machines',
    matchPages: ['machines', 'moon', 'mars', 'missions'],
    subLinks: [
      { label: 'All 31 Space Machines & Catalog', page: 'machines' },
      { label: '3D Rover, First-Person & Live Tracker', page: 'missions' },
      { label: 'Explore the Moon', page: 'moon' },
      { label: 'Explore Mars', page: 'mars' },
      { label: 'Why Machines Stay Behind', page: 'why' },
    ],
  },
  {
    label: 'Stories',
    defaultPage: 'history',
    matchPages: ['timeline', 'history'],
    subLinks: [
      { label: 'Museum Halls, Autopsy & Lost Archive', page: 'history' },
      { label: 'Mission Timeline (1964–Present)', page: 'timeline' },
      {
        label: 'If This Machine Could Speak',
        page: 'discoveries',
        discoveriesTab: 'speak',
      },
      {
        label: 'Final Signal Experience',
        page: 'discoveries',
        discoveriesTab: 'final-signal',
      },
    ],
  },
  {
    label: 'Discover',
    defaultPage: 'discoveries',
    matchPages: ['discoveries', 'historian'],
    subLinks: [
      { label: 'Ask the Space Historian & AI Stories', page: 'historian' },
      {
        label: 'Discovery Investigation Lab',
        page: 'discoveries',
        discoveriesTab: 'investigate',
      },
      {
        label: 'Surface Panorama Viewer',
        page: 'discoveries',
        discoveriesTab: 'panorama',
      },
      {
        label: 'Space Scale & Light-Time Comparison',
        page: 'discoveries',
        discoveriesTab: 'scale',
      },
    ],
  },
  {
    label: 'Learn',
    defaultPage: 'engineering',
    matchPages: ['learn', 'engineering', 'passport'],
    subLinks: [
      { label: 'Engineering Lab & 3D Exploded Hardware', page: 'engineering' },
      { label: 'Explorer Passport, Tours & Card Creator', page: 'passport' },
      { label: 'Quizzes, Games & Glossary', page: 'learn' },
      { label: 'Build a Spacecraft & Badges', page: 'learn' },
    ],
  },
  {
    label: 'Media & About',
    defaultPage: 'media',
    matchPages: ['media', 'gallery', 'about', 'why'],
    subLinks: [
      { label: 'NASA Image Gallery, Videos & Audio', page: 'media' },
      { label: 'About, References & Honesty Policy', page: 'about' },
    ],
  },
];

const MOBILE_LINKS: {
  id: PageId;
  label: string;
  discoveriesTab?: DiscoveriesTabId;
}[] = [
  { id: 'home', label: 'Home' },
  { id: 'missions', label: '3D Rover, First-Person & Where Is It Now?' },
  { id: 'history', label: 'Digital Museum, Autopsy & Golden Record' },
  { id: 'engineering', label: 'Engineering Lab, 3D Exploded View & Landings' },
  { id: 'historian', label: 'Ask the Space Historian & AI Stories' },
  { id: 'passport', label: 'Explorer Passport, Guided Tours & Cards' },
  { id: 'machines', label: 'All 31 Space Machines & Diagrams' },
  { id: 'moon', label: 'Explore the Moon' },
  { id: 'mars', label: 'Explore Mars' },
  { id: 'map', label: '3D Planetary Atlas & Routes' },
  { id: 'discoveries', label: 'Discovery Investigation Lab', discoveriesTab: 'investigate' },
  { id: 'discoveries', label: 'Final Signal Experience', discoveriesTab: 'final-signal' },
  { id: 'discoveries', label: 'If This Machine Could Speak', discoveriesTab: 'speak' },
  { id: 'discoveries', label: 'Surface Panorama Viewer', discoveriesTab: 'panorama' },
  { id: 'discoveries', label: 'Space Scale Comparison', discoveriesTab: 'scale' },
  { id: 'timeline', label: 'Mission Timeline' },
  { id: 'learn', label: 'Learning Lab, Builder & Certificate' },
  { id: 'media', label: 'Gallery, Videos & Audio Centre' },
  { id: 'why', label: 'Why Left Behind & Legacy' },
  { id: 'about', label: 'About & NASA References' },
];

export function Navbar({
  currentPage,
  onNavigate,
  onNavigateDiscoveries,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleNav = (page: PageId, discoveriesTab?: DiscoveriesTabId) => {
    if (page === 'discoveries' && discoveriesTab) {
      onNavigateDiscoveries(discoveriesTab);
    } else {
      onNavigate(page);
    }
    setOpenDropdown(null);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      ref={navRef}
      className="no-print sticky top-0 z-40 border-b border-slate-800/80 bg-[#07090E]/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="text-left text-base sm:text-lg font-bold tracking-tight text-slate-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 rounded-sm cursor-pointer"
        >
          Forgotten Space Machines
        </button>

        {/* Zone 2: Clean 5-group single-row navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium"
        >
          {DESKTOP_GROUPS.map((group) => {
            const active = group.matchPages.includes(currentPage);
            const isOpen = openDropdown === group.label;
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(group.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenDropdown((curr) =>
                      curr === group.label ? null : group.label
                    )
                  }
                  className={`relative inline-flex items-center gap-1 py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 rounded-sm ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  {active && (
                    <span
                      className="absolute inset-x-0 -bottom-[15px] h-0.5 bg-amber-400"
                      aria-hidden="true"
                    />
                  )}
                </button>

                {isOpen && (
                  <div className="absolute left-0 top-full pt-2 w-64 z-50">
                    <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-1.5 shadow-2xl">
                      {group.subLinks.map((sub) => (
                        <button
                          key={`${sub.page}-${sub.label}`}
                          type="button"
                          onClick={() => handleNav(sub.page, sub.discoveriesTab)}
                          className="block w-full text-left rounded-md px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('map')}
            className={`inline-flex items-center gap-2 rounded-md px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
              currentPage === 'map'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>3D Atlas</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-slate-800 bg-[#0D111A] p-2 text-slate-300 hover:text-white min-w-[40px] min-h-[40px] cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-slate-800 bg-[#0B0F18] px-4 py-3 space-y-1 max-h-[75vh] overflow-y-auto"
        >
          {MOBILE_LINKS.map((link) => (
            <button
              key={`${link.id}-${link.label}`}
              type="button"
              onClick={() => handleNav(link.id, link.discoveriesTab)}
              className={`block w-full text-left rounded-md px-3 py-2.5 text-sm font-medium min-h-[44px] cursor-pointer ${
                currentPage === link.id && !link.discoveriesTab
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
