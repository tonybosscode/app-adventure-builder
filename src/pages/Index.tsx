
import React, { useState, useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import ContentPage from '@/components/ContentPage';

const Index = () => {
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

  useEffect(() => {
    // Check if user has already selected a language
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setHasSelectedLanguage(true);
    }
  }, []);

  const handleLanguageSelected = (language: 'en' | 'sw') => {
    setHasSelectedLanguage(true);
    localStorage.setItem('preferredLanguage', language);
  };

  return (
    <LanguageProvider>
      {!hasSelectedLanguage ? (
        <LanguageSelector onLanguageSelected={handleLanguageSelected} />
      ) : (
        <ContentPage />
      )}
    </LanguageProvider>
  );
};

export default Index;
