"use client";

import { useState } from 'react';
import {
  Home,  // Icône pour l'accueil
  Scan,  // Icône pour le scan
  PlusSquare, // Icône pour ajouter un prix
  User, // Icône pour le profil
} from 'lucide-react'; // Bibliothèque d'icônes SVG légères

const TabBar = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // Ici, vous ajouterez la logique de navigation, par exemple avec Next.js Router
  };

  return (
    <div style={styles.tabBarContainer}>
      <div style={styles.tabBar}>
        <div
          style={activeTab === 'home' ? styles.activeTabItem : styles.tabItem}
          onClick={() => handleTabClick('home')}
        >
          <Home color={activeTab === 'home' ? '#FF6F61' : '#888'} />
          <span style={activeTab === 'home' ? styles.activeLabel : styles.label}>
            Accueil
          </span>
        </div>

        <div
          style={activeTab === 'scan' ? styles.activeTabItem : styles.tabItem}
          onClick={() => handleTabClick('scan')}
        >
          <Scan color={activeTab === 'scan' ? '#FF6F61' : '#888'} />
          <span style={activeTab === 'scan' ? styles.activeLabel : styles.label}>
            Scan
          </span>
        </div>

        <div
          style={styles.addTabItem} // Style spécifique pour le bouton central
          onClick={() => handleTabClick('add')}
        >
          <PlusSquare color="white" size={32} />
        </div>

        <div
          style={activeTab === 'profile' ? styles.activeTabItem : styles.tabItem}
          onClick={() => handleTabClick('profile')}
        >
          <User color={activeTab === 'profile' ? '#FF6F61' : '#888'} />
          <span style={activeTab === 'profile' ? styles.activeLabel : styles.label}>
            Profil
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  tabBarContainer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #EEEEEE',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
    paddingBottom: 'env(safe-area-inset-bottom)', // Pour la compatibilité avec les iPhones modernes
  },
  tabBar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '60px',
  },
  tabItem: {
    display: 'flex',
    flexDirection: 'column', // Change la direction en colonne
    alignItems: 'center',
    color: '#888',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  activeTabItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#FF6F61', // Couleur de l'onglet actif
    cursor: 'pointer',
  },
  label: {
    fontSize: '12px',
    marginTop: '4px',
  },
  activeLabel: {
    fontSize: '12px',
    marginTop: '4px',
    color: '#FF6F61', // Couleur du texte actif
  },
  addTabItem: {
    backgroundColor: '#FF6F61', // Couleur de fond du bouton central
    borderRadius: '16px', // Arrondi
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(255, 111, 97, 0.4)', // Ombre portée
    transform: 'translateY(-20px)', // Déplace le bouton vers le haut
    cursor: 'pointer',
  },
};

export default TabBar;
