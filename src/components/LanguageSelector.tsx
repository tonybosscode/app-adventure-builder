
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  onLanguageSelected: (language: 'en' | 'sw') => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelected }) => {
  const { language, setLanguage, translations } = useLanguage();

  const handleLanguageSelect = (selectedLanguage: 'en' | 'sw') => {
    setLanguage(selectedLanguage);
    onLanguageSelected(selectedLanguage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {translations['language.title']}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {translations['language.subtitle']}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            className={`w-full justify-between text-left h-16 ${
              language === 'en' 
                ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleLanguageSelect('en')}
          >
            <div>
              <div className="font-semibold">English</div>
              <div className="text-sm opacity-75">Choose English content</div>
            </div>
            {language === 'en' && <Check className="w-5 h-5" />}
          </Button>

          <Button
            variant={language === 'sw' ? 'default' : 'outline'}
            className={`w-full justify-between text-left h-16 ${
              language === 'sw' 
                ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleLanguageSelect('sw')}
          >
            <div>
              <div className="font-semibold">Kiswahili</div>
              <div className="text-sm opacity-75">Chagua maudhui ya Kiswahili</div>
            </div>
            {language === 'sw' && <Check className="w-5 h-5" />}
          </Button>

          <Button 
            className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            onClick={() => onLanguageSelected(language)}
          >
            {translations['language.continue']}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSelector;
