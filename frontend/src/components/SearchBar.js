// /components/SearchBar.js - Navigation Client avec filtres et recherche
// Architecture modulaire Afroboost

import { useState, useCallback, useEffect } from 'react';

// Icône de recherche SVG
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// Icône de fermeture SVG
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// Configuration des filtres
const FILTER_OPTIONS = [
  { id: 'all', label: '🔥 Tout', icon: '🔥' },
  { id: 'sessions', label: '📅 Sessions', icon: '📅' },
  { id: 'offers', label: '🎁 Offres', icon: '🎁' },
  { id: 'shop', label: '🛍️ Shop', icon: '🛍️' }
];

/**
 * Barre de navigation avec filtres chips néon et recherche textuelle
 * @param {Object} props
 * @param {string} props.activeFilter - Filtre actif ('all', 'sessions', 'offers', 'shop')
 * @param {Function} props.onFilterChange - Callback quand le filtre change
 * @param {string} props.searchQuery - Terme de recherche actuel
 * @param {Function} props.onSearchChange - Callback quand la recherche change
 * @param {boolean} props.showSearch - Afficher ou non la barre de recherche
 */
export const NavigationBar = ({ 
  activeFilter = 'all', 
  onFilterChange, 
  searchQuery = '', 
  onSearchChange,
  showSearch = true 
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  // Synchroniser si la prop change de l'extérieur
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleFilterClick = useCallback((filterId) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  }, [onFilterChange]);

  const clearSearch = useCallback(() => {
    setLocalSearch('');
    if (onSearchChange) {
      onSearchChange('');
    }
  }, [onSearchChange]);

  return (
    <div className="navigation-bar mb-6" data-testid="navigation-bar">
      {/* Filtres chips néon */}
      <div 
        className="filter-chips-container mb-4"
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            data-testid={`filter-${filter.id}`}
            className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: activeFilter === filter.id 
                ? '2px solid #d91cd2' 
                : '2px solid rgba(139, 92, 246, 0.4)',
              background: activeFilter === filter.id 
                ? 'linear-gradient(135deg, rgba(217, 28, 210, 0.3), rgba(139, 92, 246, 0.3))' 
                : 'rgba(0, 0, 0, 0.6)',
              color: activeFilter === filter.id ? '#fff' : 'rgba(255, 255, 255, 0.8)',
              boxShadow: activeFilter === filter.id 
                ? '0 0 20px rgba(217, 28, 210, 0.5), 0 0 40px rgba(217, 28, 210, 0.2)' 
                : 'none'
            }}
          >
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Barre de recherche */}
      {showSearch && (
        <div 
          className="search-bar-container"
          style={{
            position: 'relative',
            width: '100%'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.5)',
              pointerEvents: 'none'
            }}
          >
            <SearchIcon />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Rechercher une offre..."
            data-testid="search-input"
            className="search-input"
            style={{
              width: '100%',
              padding: '12px 40px 12px 44px',
              borderRadius: '12px',
              border: '2px solid rgba(139, 92, 246, 0.4)',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
          {localSearch && (
            <button
              onClick={clearSearch}
              data-testid="clear-search"
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CloseIcon />
            </button>
          )}
        </div>
      )}

      {/* Styles pour le focus et hover */}
      <style>{`
        .filter-chip:hover {
          border-color: rgba(217, 28, 210, 0.7) !important;
          transform: scale(1.02);
        }
        .filter-chip.active:hover {
          transform: scale(1.02);
        }
        .filter-chips-container::-webkit-scrollbar {
          display: none;
        }
        .search-input:focus {
          border-color: #d91cd2 !important;
          box-shadow: 0 0 15px rgba(217, 28, 210, 0.3);
        }
        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

/**
 * Hook pour gérer la logique de filtrage et recherche
 * @param {Array} offers - Liste des offres
 * @param {Array} courses - Liste des cours
 * @param {string} defaultSection - Section par défaut à afficher
 */
export const useNavigation = (offers = [], courses = [], defaultSection = 'all') => {
  const [activeFilter, setActiveFilter] = useState(defaultSection);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les offres selon le filtre actif et la recherche
  const filteredOffers = offers.filter(offer => {
    // Filtre par catégorie
    let categoryMatch = true;
    if (activeFilter === 'sessions') {
      categoryMatch = !offer.isProduct;
    } else if (activeFilter === 'offers') {
      categoryMatch = !offer.isProduct && (offer.name?.toLowerCase().includes('carte') || offer.name?.toLowerCase().includes('abonnement'));
    } else if (activeFilter === 'shop') {
      categoryMatch = offer.isProduct === true;
    }

    // Filtre par recherche textuelle
    let searchMatch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      searchMatch = (
        (offer.name?.toLowerCase() || '').includes(query) ||
        (offer.description?.toLowerCase() || '').includes(query)
      );
    }

    return categoryMatch && searchMatch;
  });

  // Filtrer les cours si nécessaire
  const filteredCourses = courses.filter(course => {
    if (activeFilter === 'shop' || activeFilter === 'offers') {
      return false; // Masquer les cours sur Shop et Offres
    }
    
    // Filtre par recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return (
        (course.name?.toLowerCase() || '').includes(query) ||
        (course.locationName?.toLowerCase() || '').includes(query)
      );
    }
    
    return true;
  });

  // Déterminer quelle section scroller au chargement
  const getSectionToScroll = useCallback(() => {
    switch (activeFilter) {
      case 'sessions':
        return 'sessions-section';
      case 'offers':
      case 'shop':
        return 'offers-section';
      default:
        return null;
    }
  }, [activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    filteredOffers,
    filteredCourses,
    getSectionToScroll,
    hasResults: filteredOffers.length > 0 || filteredCourses.length > 0
  };
};

/**
 * Sélecteur de section d'atterrissage pour le Mode Coach
 * @param {Object} props
 * @param {string} props.value - Valeur actuelle
 * @param {Function} props.onChange - Callback au changement
 */
export const LandingSectionSelector = ({ value = 'sessions', onChange }) => {
  const options = [
    { id: 'sessions', label: '📅 Sessions', description: 'Les cours disponibles' },
    { id: 'offers', label: '🎁 Offres', description: 'Les cartes et abonnements' },
    { id: 'shop', label: '🛍️ Shop', description: 'Les produits physiques' }
  ];

  return (
    <div className="landing-section-selector" data-testid="landing-section-selector">
      <label className="block mb-2 text-white text-sm">📍 Section d'atterrissage par défaut</label>
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg neon-input"
        data-testid="landing-section-select"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.label} - {option.description}
          </option>
        ))}
      </select>
      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Cette section sera affichée en premier lors du chargement de l'application côté client.
      </p>
    </div>
  );
};

// Export par défaut
export default NavigationBar;
