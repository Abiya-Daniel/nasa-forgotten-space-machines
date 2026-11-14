# THE FORGOTTEN FRONTIER – Stories of Humanity's Machines on Other Worlds

An interactive educational storytelling platform and 3D planetary atlas created for the **2026 NASA International Space Apps Challenge**:
> *"Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars."*

> **Disclaimer:** This is an independent student project created for the NASA Space Apps Challenge 2026. It is not an official NASA website and does not imply agency endorsement.

---

## 1. Features & Pages

1. **Home** — Hero overview (*"Every Mission Leaves a Story."*), Moon & Mars exploration entry points, live NASA Trek planetary previews, and featured off-world hardware.
2. **Explore the Moon** — Filterable archive of Apollo Lunar Module descent stages, Apollo Lunar Roving Vehicles (LRVs), Surveyor landers, ALSEP stations, and impact probes (Ranger 7, LCROSS).
3. **Explore Mars** — Catalog distinguishing **Active**, **Retired**, **Inactive**, and **Crashed** hardware (Viking 1 & 2, Pathfinder & Sojourner, Mars Polar Lander, Beagle 2, Spirit, Opportunity, Phoenix, Curiosity, Schiaparelli, InSight, Perseverance, Ingenuity).
4. **Interactive Planetary Map (3D & 2D)** — Switch between the Moon and Mars, toggle between a **Three.js 3D Interactive Globe** and a **2D Zoomable Equirectangular Map**, switch Mars layers (Viking Color Mosaic vs. MGS MOLA Shaded Elevation), filter by mission and equipment type, and inspect verified coordinates and NSSDCA links.
5. **Mission Timeline** — Chronological journey from 1964 to 2024 with clickable mission stories.
6. **Why Do We Leave Equipment Behind?** — Interactive Return Mass Penalty (Rocket Equation) explorer, thermal/dust/radiation engineering breakdowns, and a clear separation between **Established Scientific Facts** and **Future Possibilities**.
7. **NASA Image Gallery** — Live search and curated mission filters powered directly by `https://images-api.nasa.gov/search` with NASA IDs, center credits, and original source links.
8. **About & References** — Complete methodology, source register, licensing, and AI transparency disclosure.

---

## 2. How the Code Works (Beginner-Friendly Guide)

- `src/data/equipmentData.ts`: Stores verified spacecraft facts, launch/landing dates, NSSDCA IDs, coordinates (`verified` vs `approximate`), and narrative stories.
- `src/services/nasaApi.ts`: Connects directly to NASA's public **Image and Video Library API** (`images-api.nasa.gov`) and streams orbital surface tiles from **NASA Moon Trek / Mars Trek WMTS** (`trek.nasa.gov`).
- `src/components/PlanetaryGlobe3D.tsx`: Uses **Three.js** to wrap NASA Trek's stitched 2048×1024 planetary mosaic onto a 3D sphere and projects latitude/longitude coordinates into 3D surface beacons that you can orbit and click.
- `src/components/PlanetaryMap2D.tsx`: Renders zoomable NASA Trek WMTS map tiles in a standard equirectangular projection with pan and zoom controls.
- `src/pages/*`: Each of the 8 pages is its own clean React component so you can easily read, update, or present any section independently.

---

## 3. Installation & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `npm` (included with Node.js)

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Start the development server (runs on http://localhost:3000)
npm run dev

# 3. Type-check and build for production
npm run lint
npm run build
```

---

## 4. NASA Data & Reference Register

| Name | Original URL | Publisher | License / Terms | How Used |
| :--- | :--- | :--- | :--- | :--- |
| **NASA Space Science Data Coordinated Archive (NSSDCA)** | https://nssdc.gsfc.nasa.gov/ | NASA GSFC | U.S. Gov Public Domain | Authoritative resource from the 2026 challenge resources; supplies COSPAR/NSSDCA IDs, launch/landing dates, status, and coordinates. |
| **NASA Moon Trek WMTS (`LRO_WAC_Mosaic_Global_303ppd_v02`)** | https://trek.nasa.gov/moon/ | NASA Solar System Treks / GSFC / ASU | NASA Open Data | Live OGC WMTS tiles stitched into the 3D Moon Globe texture and 2D zoomable Moon Map. |
| **NASA Mars Trek WMTS (`Mars_Viking_MDIM21_ClrMosaic_global_232m` & `Mars_MGS_MOLA_ClrShade_merge_global_463m`)** | https://trek.nasa.gov/mars/ | NASA Solar System Treks / JPL / USGS | NASA Open Data | Live OGC WMTS tiles streamed into the 3D Mars Globe and 2D zoomable Mars Map with layer switching. |
| **NASA Image and Video Library API** | https://images-api.nasa.gov/ | NASA HQ / JSC / JPL / KSC | NASA Media Usage Guidelines | Powers archival hardware photos across all pages and live search in the NASA Image Gallery. |
| **React, Vite, TypeScript, Tailwind CSS, Three.js, Lucide React** | https://react.dev/ · https://threejs.org/ | Open-source communities | MIT / ISC | Frontend UI, state management, WebGL 3D globe rendering, and responsive styling. |

---

## 5. AI Usage Disclosure

> Google Antigravity was used as an AI-assisted development tool for website implementation, coding, debugging and interface development. AI assistance was also used for the content and features identified in the project documentation. Scientific facts and references were checked against the cited sources.

- **AI-assisted areas:** React/TypeScript component scaffolding, Three.js 3D globe/raycasting logic, NASA Trek WMTS tile stitching, layout styling, and initial educational narrative drafting.
- **Human verification & compliance:** All NSSDCA spacecraft IDs, coordinates, mission dates, and images were cross-referenced against NASA NSSDCA, LRO/MRO records, and `images-api.nasa.gov`. No AI-generated NASA logos, flags, mission patches, or fabricated historical photographs are used.

---

## 6. Free Deployment Instructions

Because this project is a fast, static-compatible React + Vite application with zero mandatory backend or paid APIs, you can deploy it for free in minutes:

### Option A: Vercel or Netlify
1. Push this repository to GitHub.
2. Import the repository on **Vercel** (`vercel.com`) or **Netlify** (`app.netlify.com`).
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Deploy—your live HTTPS URL is ready for Space Apps judges with no login required.

### Option B: GitHub Pages
1. Run `npm run build` (or configure a GitHub Actions workflow using `actions/upload-pages-artifact` on `./dist`).
2. In `vite.config.ts`, if deploying under a subpath (`https://<user>.github.io/<repo>/`), set `base: '/<repo>/'`.
3. Enable **Settings → Pages** in your GitHub repository.

---

## 7. Short Judge Presentation Script (2–3 Minutes)

- **0:00–0:30 (Hook & Problem):**
  *"Every time humanity launches a rover or lunar lander, headlines follow launch and landing—but what happens when the mission ends? Today, dozens of lunar buggies, descent stages, and Martian rovers sit quietly across two worlds. We built **The Forgotten Frontier** to turn NASA's archival spacecraft records into an interactive storytelling atlas."*
- **0:30–1:30 (Live Demo – Interactive Planetary Map):**
  *"Here on our **Interactive Planetary Map**, we stream real orbital surface tiles directly from NASA Moon Trek and Mars Trek WMTS APIs onto a Three.js 3D globe and 2D zoomable map. When I click Apollo 12 or Surveyor 3, you see verified NSSDCA coordinates, authentic NASA photography, why the hardware stayed behind, and a direct link to its NSSDCA Master Catalog record. Switching to Mars lets us toggle between the Viking Color Mosaic and MOLA elevation, and filter between active, retired, inactive, and crashed missions."*
- **1:30–2:15 (Education & Live NASA Media):**
  *"On **Why Left Behind**, students can move the mass slider to see the rocket equation penalty—explaining why bringing back a 1,025 kg rover like Perseverance would require hundreds of metric tons of extra Earth launch mass. And in **NASA Image Gallery**, anyone can search NASA's live Image Library API with proper credits and original source links."*
- **2:15–2:45 (Transparency & Wrap-Up):**
  *"Every dataset, coordinate precision tag, open-source license, and AI disclosure is documented on our **About & References** page, ensuring judges and students alike can trust the science behind every story."*

---

## 8. License

Original source code is licensed under the **Apache License 2.0** (see `LICENSE`). NASA imagery and datasets remain subject to NASA Media Usage Guidelines and U.S. Government Public Domain terms.
