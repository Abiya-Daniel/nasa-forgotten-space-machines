import { ExternalLink, ArrowRight } from 'lucide-react';
import { DATA_SOURCE_REGISTER } from '../data/equipmentData';
import { PageId } from '../types/equipment';

interface AboutPageProps {
  onNavigate?: (page: PageId) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
          Documentation, Data Provenance &amp; Research Credits
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
          About the Project &amp; NASA References
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
          Complete documentation of project methodology, official NASA datasets,
          image/video/audio credits, telemetry check dates, AI transparency disclosures,
          and independent student disclaimers for NASA&apos;s Forgotten Space Machines.
        </p>
      </div>

      {/* Challenge & Methodology */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-100">
            Project Objective &amp; Challenge
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong>Project Name:</strong> NASA&apos;s Forgotten Space Machines
            <br />
            <strong>Tagline:</strong> Every machine has a story. Every discovery leaves a legacy.
            <br />
            <strong>Challenge Title:</strong> Abandoned but not Forgotten:
            Storytelling about NASA&apos;s Discarded Equipment on the Moon and
            Mars (NASA Space Apps Challenge 2026).
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong>Objective:</strong> Transform archival spacecraft records,
            planetary coordinates, orbital maps, and mission audio/video into an
            accessible documentary experience that distinguishes active explorers,
            retired scientific pioneers, and expended hardware.
          </p>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('why')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:underline cursor-pointer pt-1"
            >
              <span>Read Why Machines Stay Behind &amp; Future Legacy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-100">
            Scientific Accuracy &amp; Telemetry Policy
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300 leading-relaxed">
            <li>
              Every spacecraft record is keyed to its COSPAR / NSSDCA Master
              Catalog identifier (for example{' '}
              <code className="font-mono text-amber-300">1971-063C</code> for
              Apollo 15 LRV-1), directly linking users to NASA&apos;s catalog.
            </li>
            <li>
              <strong>Dynamic Telemetry Notice:</strong> Changing distances for
              Voyager 1, Voyager 2, Pioneer 10/11, New Horizons, and active
              Martian rovers are marked with{' '}
              <span className="font-mono text-sky-300">Last Checked: November 14, 2026</span>{' '}
              and explicitly labeled when estimated.
            </li>
            <li>
              <strong>Visual &amp; Audio Labeling:</strong> Authentic NASA
              photographs, videos, and audio files carry official NASA IDs and
              center credits. Environmental backdrops and Web Audio sound effects
              are explicitly labeled as AI-generated visualizations or synthesized
              educational audio.
            </li>
          </ul>
        </div>
      </section>

      {/* Complete NASA Data & Reference Register */}
      <section className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6">
        <h2 className="text-xl font-bold text-slate-100">
          NASA Research References, Image Credits &amp; Software Register
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Record of every external NASA dataset, API, archival collection, and
          open-source library used in this application.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 pr-4 font-semibold">Resource / Library</th>
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold">Publisher</th>
                <th className="py-3 pr-4 font-semibold">License / Terms</th>
                <th className="py-3 font-semibold">How Used in Project</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {DATA_SOURCE_REGISTER.map((row) => (
                <tr key={row.name} className="align-top">
                  <td className="py-3.5 pr-4 font-medium text-slate-100 min-w-[200px]">
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                    >
                      <span>{row.name}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-sky-400 whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="py-3.5 pr-4 min-w-[160px]">{row.publisher}</td>
                  <td className="py-3.5 pr-4 min-w-[150px]">{row.license}</td>
                  <td className="py-3.5 leading-relaxed min-w-[240px]">
                    {row.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Transparency & NASA Rules */}
      <section className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-100">
          AI Transparency, Storytelling Honesty &amp; Privacy Disclosure
        </h2>
        <div className="rounded-md border border-slate-700 bg-[#07090E] p-4 text-sm leading-relaxed text-slate-200">
          AI-assisted development tools supported interface engineering,
          interactive diagram layout, and educational text structuring across all{' '}
          <strong className="text-amber-300">31 documented spacecraft</strong>. Four
          atmospheric environment illustrations on the homepage are AI-generated
          and explicitly labeled as &ldquo;Environment Visualization (AI-Generated)&rdquo;.
          First-person passages in <em>If This Machine Could Speak</em> are
          explicitly labeled as creative educational reflections based on
          documented facts—never presented as real NASA transmissions.
          Similarly, the <em>Final Signal Experience</em> separates verified telemetry
          dates and engineering causes from unobserved or uncertain failure details.
          Personal favorites, saved discoveries, and badges stay strictly inside
          your browser&apos;s <code className="font-mono text-sky-300">localStorage</code>{' '}
          with zero server tracking or accounts.
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm text-slate-300">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Verified Authentic Media Standards
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1.5">
              <li>
                No AI-generated NASA logos, flags, mission patches, or fake
                historical mission photographs are presented as authentic.
              </li>
              <li>
                All spacecraft photographs and archival videos stream from NASA&apos;s
                official <code className="font-mono text-sky-300">images-api.nasa.gov</code>{' '}
                archive with original NASA IDs.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Synthesized Audio Transparency
            </h3>
            <ul className="mt-2 list-disc pl-5 space-y-1.5">
              <li>
                Optional gentle space ambience and five educational sound effects
                are synthesized via Web Audio API and clearly labeled.
              </li>
              <li>
                Every spoken narration chapter includes a full written transcript
                so the site remains 100% accessible without sound.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Disclaimer & Acknowledgements */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-2">
          <h2 className="text-lg font-bold text-slate-100">
            Independent Student Project Disclaimer
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            NASA&apos;s Forgotten Space Machines is an independent student educational
            project built for the NASA International Space Apps Challenge. It is
            not an official NASA website, and no official endorsement by NASA or
            any space agency is implied.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-2">
          <h2 className="text-lg font-bold text-slate-100">
            Acknowledgements
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Built with deep appreciation for NASA&apos;s open-data archivists at the
            NASA Space Science Data Coordinated Archive (NSSDCA), the NASA Solar
            System Treks team (Moon Trek &amp; Mars Trek), the LRO and MRO
            HiRISE imaging teams, and NASA&apos;s public Image and Video Library.
          </p>
        </div>
      </section>
    </div>
  );
}
