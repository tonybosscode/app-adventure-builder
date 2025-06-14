
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'sw';
  setLanguage: (lang: 'en' | 'sw') => void;
  translations: Record<string, string>;
}

const translations = {
  en: {
    // Navigation
    'app.title': 'Relationship Hub',
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.profile': 'Profile',
    
    // Categories
    'category.love-stories': 'Love Stories',
    'category.marriage-life': 'Marriage Life',
    'category.zodiac-relationships': 'Zodiac & Relationships',
    'category.work-relationships': 'Work & Relationships',
    
    // Content
    'content.premium': 'Premium',
    'content.free': 'Free',
    'content.like': 'Like',
    'content.likes': 'Likes',
    'content.readMore': 'Read More',
    
    // Language Selection
    'language.title': 'Choose Your Language',
    'language.subtitle': 'Select your preferred language for content',
    'language.english': 'English',
    'language.swahili': 'Swahili',
    'language.continue': 'Continue',
    
    // Onboarding
    'onboarding.welcome': 'Welcome to Relationship Hub',
    'onboarding.description': 'Discover amazing content about love, relationships, and life',
  },
  sw: {
    // Navigation
    'app.title': 'Kituo cha Mahusiano',
    'nav.home': 'Nyumbani',
    'nav.categories': 'Makundi',
    'nav.profile': 'Wasifu',
    
    // Categories
    'category.love-stories': 'Hadithi za Mapenzi',
    'category.marriage-life': 'Maisha ya Ndoa',
    'category.zodiac-relationships': 'Nyota na Mahusiano',
    'category.work-relationships': 'Mahusiano ya Kazi',
    
    // Content
    'content.premium': 'Makusudi',
    'content.free': 'Bure',
    'content.like': 'Penda',
    'content.likes': 'Mapendekezo',
    'content.readMore': 'Soma Zaidi',
    
    // Language Selection
    'language.title': 'Chagua Lugha Yako',
    'language.subtitle': 'Chagua lugha unayopendelea kwa maudhui',
    'language.english': 'Kiingereza',
    'language.swahili': 'Kiswahili',
    'language.continue': 'Endelea',
    
    // Onboarding
    'onboarding.welcome': 'Karibu Kituo cha Mahusiano',
    'onboarding.description': 'Gundua maudhui ya ajabu kuhusu mapenzi, mahusiano, na maisha',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') as 'en' | 'sw';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'sw') => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    translations: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
