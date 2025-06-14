
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Zap, Globe, Star, Menu, X } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFeatureClick = (feature: string) => {
    toast({
      title: "Feature Activated! 🚀",
      description: `You tapped on ${feature}. This would open the ${feature.toLowerCase()} section in a real app.`,
    });
  };

  const features = [
    {
      icon: <Smartphone className="w-8 h-8 text-blue-500" />,
      title: "Mobile First",
      description: "Built with mobile users in mind",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Optimized for performance",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: <Globe className="w-8 h-8 text-green-500" />,
      title: "Cross Platform",
      description: "Works on iOS and Android",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Star className="w-8 h-8 text-purple-500" />,
      title: "Amazing UX",
      description: "Delightful user experience",
      color: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MobileApp
            </h1>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-white border-t border-gray-200 p-4 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              <Button variant="ghost" className="justify-start">Home</Button>
              <Button variant="ghost" className="justify-start">Features</Button>
              <Button variant="ghost" className="justify-start">About</Button>
              <Button variant="ghost" className="justify-start">Contact</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
            Now Available on Mobile 📱
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Your Amazing
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Mobile App
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the power of modern web technology in a native mobile app. 
            Built with React and Capacitor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
              onClick={() => handleFeatureClick("Get Started")}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleFeatureClick("Learn More")}
            >
              Learn More
            </Button>
          </div>

          {/* Time Display */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 inline-block border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Current Time</p>
            <p className="text-2xl font-mono font-bold text-gray-900">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`${feature.color} border-2 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg`}
              onClick={() => handleFeatureClick(feature.title)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Go Mobile?</h3>
          <p className="text-indigo-100 mb-6 max-w-md mx-auto">
            Transform your web experience into a powerful mobile application with just a few taps.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-indigo-600 hover:bg-indigo-50"
            onClick={() => handleFeatureClick("Download App")}
          >
            Download App
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            Built with ❤️ using React, Capacitor, and Lovable
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2024 Your Mobile App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
