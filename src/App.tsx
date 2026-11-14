import { useState, useEffect } from 'react';
import { EquipmentItem, FeaturedMachineId, PageId } from './types/equipment';
import { ExperienceProvider } from './context/ExperienceContext';
import { StarfieldBackground } from './components/StarfieldBackground';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UtilityDock } from './components/UtilityDock';
import { EquipmentDetailModal } from './components/EquipmentDetailModal';
import { FeaturedDossierModal } from './components/FeaturedDossierModal';
import { HomePage } from './pages/HomePage';
import { MachinesPage } from './pages/MachinesPage';
import { MoonPage } from './pages/MoonPage';
import { MarsPage } from './pages/MarsPage';
import { PlanetaryMapPage } from './pages/PlanetaryMapPage';
import { TimelinePage } from './pages/TimelinePage';
import { WhyLeftBehindPage } from './pages/WhyLeftBehindPage';
import { DiscoveriesPage, DiscoveriesTabId } from './pages/DiscoveriesPage';
import { LearningLabPage } from './pages/LearningLabPage';
import { MediaCenterPage } from './pages/MediaCenterPage';
import { AboutPage } from './pages/AboutPage';
import { MissionsExperiencePage } from './pages/MissionsExperiencePage';
import { SpaceHistoryPage } from './pages/SpaceHistoryPage';
import { EngineeringLabPage } from './pages/EngineeringLabPage';
import { AIHistorianPage } from './pages/AIHistorianPage';
import { ExplorerPassportPage } from './pages/ExplorerPassportPage';

const VALID_PAGES: PageId[] = [
  'home',
  'machines',
  'moon',
  'mars',
  'map',
  'timeline',
  'why',
  'discoveries',
  'learn',
  'media',
  'gallery',
  'about',
  'missions',
  'history',
  'engineering',
  'historian',
  'passport',
];

function getInitialPage(): PageId {
  const hash = window.location.hash.replace('#', '') as PageId;
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [discoveriesTab, setDiscoveriesTab] =
    useState<DiscoveriesTabId>('investigate');
  const [modalItem, setModalItem] = useState<EquipmentItem | null>(null);
  const [featuredModalId, setFeaturedModalId] =
    useState<FeaturedMachineId | null>(null);
  const [mapFocusItem, setMapFocusItem] = useState<EquipmentItem | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState(null, '', `#${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateDiscoveries = (tab: DiscoveriesTabId) => {
    setDiscoveriesTab(tab);
    navigate('discoveries');
  };

  const handleOpenItem = (item: EquipmentItem) => {
    if (item.featuredStoryId) {
      setFeaturedModalId(item.featuredStoryId);
    } else {
      setModalItem(item);
    }
  };

  const handleLocateOnMap = (item: EquipmentItem) => {
    setModalItem(null);
    setFeaturedModalId(null);
    setMapFocusItem(item);
    navigate('map');
  };

  return (
    <ExperienceProvider>
      <div className="relative min-h-screen flex flex-col bg-[#07090E] text-slate-100">
        <StarfieldBackground />
        <Navbar
          currentPage={currentPage}
          onNavigate={navigate}
          onNavigateDiscoveries={navigateDiscoveries}
        />

        <main className="flex-1">
          {currentPage === 'home' && (
            <HomePage
              onNavigate={navigate}
              onNavigateDiscoveries={navigateDiscoveries}
              onSelectItem={setModalItem}
              onOpenFeaturedDossier={setFeaturedModalId}
              onLocateOnMap={handleLocateOnMap}
            />
          )}
          {currentPage === 'machines' && (
            <MachinesPage
              onSelectItem={handleOpenItem}
              onOpenFeaturedDossier={setFeaturedModalId}
              onLocateOnMap={handleLocateOnMap}
            />
          )}
          {currentPage === 'moon' && (
            <MoonPage
              onSelectItem={handleOpenItem}
              onLocateOnMap={handleLocateOnMap}
            />
          )}
          {currentPage === 'mars' && (
            <MarsPage
              onSelectItem={handleOpenItem}
              onLocateOnMap={handleLocateOnMap}
            />
          )}
          {currentPage === 'map' && (
            <PlanetaryMapPage
              initialItem={mapFocusItem}
              onOpenStoryModal={handleOpenItem}
            />
          )}
          {currentPage === 'discoveries' && (
            <DiscoveriesPage
              initialTab={discoveriesTab}
              onOpenMachine={handleOpenItem}
              onOpenFeaturedDossier={setFeaturedModalId}
            />
          )}
          {currentPage === 'timeline' && (
            <TimelinePage
              onOpenStoryModal={handleOpenItem}
              onLocateOnMap={handleLocateOnMap}
            />
          )}
          {currentPage === 'why' && <WhyLeftBehindPage />}
          {currentPage === 'learn' && <LearningLabPage />}
          {(currentPage === 'media' || currentPage === 'gallery') && (
            <MediaCenterPage defaultTab="images" />
          )}
          {currentPage === 'about' && <AboutPage onNavigate={navigate} />}
          {currentPage === 'missions' && (
            <MissionsExperiencePage
              onOpenMachine={handleOpenItem}
              onLocateOnMap={handleLocateOnMap}
            />
          )}
          {currentPage === 'history' && (
            <SpaceHistoryPage
              onOpenMachine={handleOpenItem}
              onNavigate={navigate}
            />
          )}
          {currentPage === 'engineering' && <EngineeringLabPage />}
          {currentPage === 'historian' && <AIHistorianPage />}
          {currentPage === 'passport' && (
            <ExplorerPassportPage onOpenMachine={handleOpenItem} />
          )}
        </main>

        <Footer onNavigate={navigate} />

        <UtilityDock />

        <EquipmentDetailModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onViewOnMap={handleLocateOnMap}
          onOpenFeaturedDossier={setFeaturedModalId}
        />

        <FeaturedDossierModal
          machineId={featuredModalId}
          onClose={() => setFeaturedModalId(null)}
          onLocateOnMap={handleLocateOnMap}
        />
      </div>
    </ExperienceProvider>
  );
}
