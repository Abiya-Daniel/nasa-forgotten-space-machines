import { PageId } from '../types/equipment';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const go = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print relative z-10 border-t border-slate-800/80 bg-[#07090E] mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              NASA&apos;s Forgotten Space Machines
            </h2>
            <p className="mt-1 text-xs font-medium text-amber-400">
              Every machine has a story. Every discovery leaves a legacy.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 max-w-sm">
              Independent student educational storytelling platform created for the
              NASA International Space Apps Challenge: &ldquo;Abandoned but not
              Forgotten: Storytelling about NASA&apos;s Discarded Equipment on the
              Moon and Mars.&rdquo;
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Not an official NASA website. No official agency endorsement is implied.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
              Explore Platform Sections
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-400">
              {(
                [
                  { id: 'home', label: 'Home' },
                  { id: 'machines', label: 'Machines & Diagrams' },
                  { id: 'missions', label: 'Missions & 3D Rover' },
                  { id: 'history', label: 'Space History & Autopsy' },
                  { id: 'engineering', label: 'Engineering & 3D Lab' },
                  { id: 'historian', label: 'AI Space Historian' },
                  { id: 'passport', label: 'Passport & Guided Tours' },
                  { id: 'moon', label: 'Explore the Moon' },
                  { id: 'mars', label: 'Explore Mars' },
                  { id: 'map', label: '3D Planetary Atlas' },
                  { id: 'discoveries', label: 'Discoveries & Signal Lab' },
                  { id: 'timeline', label: 'Mission Timeline' },
                  { id: 'learn', label: 'Learning Lab & Badges' },
                  { id: 'media', label: 'Media, Video & Audio' },
                  { id: 'why', label: 'Why Left Behind' },
                  { id: 'about', label: 'About & Credits' },
                ] as { id: PageId; label: string }[]
              ).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
              Data Provenance &amp; Telemetry
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Spacecraft records cross-referenced with the NASA Space Science
              Data Coordinated Archive (NSSDCA), NASA Moon &amp; Mars Trek WMTS,
              and the NASA Image and Video Library API.
            </p>
            <p className="mt-3 text-xs text-sky-400 font-mono">
              Dynamic deep-space &amp; rover telemetry checked: Nov 14, 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
