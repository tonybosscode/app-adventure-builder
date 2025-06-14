
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, BookOpen, Users, Briefcase, Crown, Menu, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { sqliteService, Post } from '@/services/sqliteService';
import { toast } from "@/hooks/use-toast";

const ContentPage: React.FC = () => {
  const { language, translations } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      id: 'all',
      name: 'All',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-gray-50 border-gray-200'
    },
    {
      id: 'love-stories',
      name: translations['category.love-stories'],
      icon: <Heart className="w-5 h-5 text-red-500" />,
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 'marriage-life',
      name: translations['category.marriage-life'],
      icon: <Users className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'zodiac-relationships',
      name: translations['category.zodiac-relationships'],
      icon: <Star className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'work-relationships',
      name: translations['category.work-relationships'],
      icon: <Briefcase className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50 border-green-200'
    }
  ];

  useEffect(() => {
    loadPosts();
  }, [language, selectedCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      await sqliteService.initialize();
      const categoryFilter = selectedCategory === 'all' ? undefined : selectedCategory;
      const fetchedPosts = await sqliteService.getPosts(language, categoryFilter);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      // For demo purposes, using a mock user ID
      await sqliteService.likePost(postId, 1);
      // Reload posts to update like counts
      loadPosts();
      toast({
        title: "Liked! ❤️",
        description: "Post has been liked successfully.",
      });
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {translations['app.title']}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {language === 'en' ? 'EN' : 'SW'}
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {translations['nav.categories']}
          </h2>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`flex-shrink-0 h-auto p-4 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex flex-col items-center space-y-1">
                  {category.icon}
                  <span className="text-xs font-medium">{category.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading content...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No content available for this category.</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {post.isPremium ? (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            <Crown className="w-3 h-3 mr-1" />
                            {translations['content.premium']}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {translations['content.free']}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.id === post.category)?.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-gray-700 mb-4 line-clamp-3">
                    {post.content}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes} {translations['content.likes']}
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      {translations['content.readMore']}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ContentPage;
