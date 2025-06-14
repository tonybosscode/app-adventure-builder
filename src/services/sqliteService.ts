
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

export interface Post {
  id: number;
  title: string;
  content: string;
  category: 'love-stories' | 'marriage-life' | 'zodiac-relationships' | 'work-relationships';
  language: 'en' | 'sw';
  isPremium: boolean;
  likes: number;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  preferredLanguage: 'en' | 'sw';
  isPremium: boolean;
}

class SQLiteService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isInitialized = false;
  private isWeb = false;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.isWeb = Capacitor.getPlatform() === 'web';
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (this.isWeb) {
        // For web browsers, use localStorage
        console.log('Running on web, using localStorage fallback');
        await this.initializeWebStorage();
      } else {
        // For mobile devices, use SQLite
        const isAvailable = await CapacitorSQLite.checkConnectionsConsistency({ dbNames: [] });
        if (!isAvailable.result) {
          throw new Error('SQLite is not available on this platform');
        }

        this.db = await this.sqlite.createConnection('relationship_app', false, 'no-encryption', 1, false);
        await this.db.open();
        await this.createTables();
      }
      
      await this.insertSampleData();
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SQLite:', error);
      throw error;
    }
  }

  private async initializeWebStorage(): Promise<void> {
    // Initialize localStorage structure if not exists
    if (!localStorage.getItem('storyDaily_posts')) {
      localStorage.setItem('storyDaily_posts', JSON.stringify([]));
    }
    if (!localStorage.getItem('storyDaily_users')) {
      localStorage.setItem('storyDaily_users', JSON.stringify([]));
    }
    if (!localStorage.getItem('storyDaily_likes')) {
      localStorage.setItem('storyDaily_likes', JSON.stringify([]));
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        preferredLanguage TEXT DEFAULT 'en',
        isPremium INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createPostsTable = `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        language TEXT NOT NULL,
        isPremium INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createUserLikesTable = `
      CREATE TABLE IF NOT EXISTS user_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        postId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (postId) REFERENCES posts (id),
        UNIQUE(userId, postId)
      );
    `;

    await this.db.execute(createUsersTable);
    await this.db.execute(createPostsTable);
    await this.db.execute(createUserLikesTable);
  }

  private async insertSampleData(): Promise<void> {
    if (this.isWeb) {
      // Check if data already exists in localStorage
      const existingPosts = JSON.parse(localStorage.getItem('storyDaily_posts') || '[]');
      if (existingPosts.length > 0) {
        return; // Data already exists
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      // Check if data already exists in SQLite
      const existingPosts = await this.db.query('SELECT COUNT(*) as count FROM posts');
      if (existingPosts.values && existingPosts.values[0].count > 0) {
        return; // Data already exists
      }
    }

    const samplePosts = [
      // English Content
      {
        id: 1,
        title: 'Finding True Love in Modern Times',
        content: 'Love stories have evolved with technology, but the essence remains the same...',
        category: 'love-stories',
        language: 'en',
        isPremium: false,
        likes: 15,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Building a Strong Marriage Foundation',
        content: 'Marriage requires continuous effort from both partners...',
        category: 'marriage-life',
        language: 'en',
        isPremium: true,
        likes: 23,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Zodiac Compatibility in Relationships',
        content: 'Understanding how star signs interact can help...',
        category: 'zodiac-relationships',
        language: 'en',
        isPremium: false,
        likes: 8,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Managing Office Romance',
        content: 'Workplace relationships require special consideration...',
        category: 'work-relationships',
        language: 'en',
        isPremium: true,
        likes: 12,
        createdAt: new Date().toISOString()
      },
      
      // Swahili Content
      {
        id: 5,
        title: 'Kupata Upendo wa Kweli Wakati Huu',
        content: 'Hadithi za mapenzi zimebadilika na teknolojia, lakini msingi unabaki...',
        category: 'love-stories',
        language: 'sw',
        isPremium: false,
        likes: 18,
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Kujenga Msingi Imara wa Ndoa',
        content: 'Ndoa inahitaji juhudi za kila wakati kutoka kwa wachumba wote...',
        category: 'marriage-life',
        language: 'sw',
        isPremium: true,
        likes: 27,
        createdAt: new Date().toISOString()
      },
      {
        id: 7,
        title: 'Ulinganifu wa Nyota katika Mahusiano',
        content: 'Kuelewa jinsi dalili za anga zinavyoungana kunaweza kusaidia...',
        category: 'zodiac-relationships',
        language: 'sw',
        isPremium: false,
        likes: 11,
        createdAt: new Date().toISOString()
      },
      {
        id: 8,
        title: 'Kusimamia Mapenzi Kazini',
        content: 'Mahusiano ya kazini yanahitaji utunzaji maalum...',
        category: 'work-relationships',
        language: 'sw',
        isPremium: true,
        likes: 9,
        createdAt: new Date().toISOString()
      }
    ];

    if (this.isWeb) {
      localStorage.setItem('storyDaily_posts', JSON.stringify(samplePosts));
    } else {
      for (const post of samplePosts) {
        await this.db!.execute(
          'INSERT INTO posts (title, content, category, language, isPremium, likes) VALUES (?, ?, ?, ?, ?, ?)',
          [post.title, post.content, post.category, post.language, post.isPremium ? 1 : 0, post.likes]
        );
      }
    }
  }

  async getPosts(language: 'en' | 'sw', category?: string): Promise<Post[]> {
    if (this.isWeb) {
      const posts = JSON.parse(localStorage.getItem('storyDaily_posts') || '[]') as Post[];
      let filteredPosts = posts.filter(post => post.language === language);
      
      if (category) {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }
      
      return filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      if (!this.db) throw new Error('Database not initialized');

      let query = 'SELECT * FROM posts WHERE language = ?';
      const params: any[] = [language];

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      query += ' ORDER BY createdAt DESC';

      const result = await this.db.query(query, params);
      return result.values || [];
    }
  }

  async likePost(postId: number, userId: number): Promise<void> {
    if (this.isWeb) {
      const posts = JSON.parse(localStorage.getItem('storyDaily_posts') || '[]') as Post[];
      const likes = JSON.parse(localStorage.getItem('storyDaily_likes') || '[]') as Array<{userId: number, postId: number}>;
      
      // Check if user already liked this post
      const existingLike = likes.find(like => like.userId === userId && like.postId === postId);
      if (existingLike) return;
      
      // Add like record
      likes.push({ userId, postId });
      localStorage.setItem('storyDaily_likes', JSON.stringify(likes));
      
      // Update post likes count
      const postIndex = posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        posts[postIndex].likes += 1;
        localStorage.setItem('storyDaily_posts', JSON.stringify(posts));
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');

      try {
        await this.db.execute(
          'INSERT OR IGNORE INTO user_likes (userId, postId) VALUES (?, ?)',
          [userId, postId]
        );

        await this.db.execute(
          'UPDATE posts SET likes = likes + 1 WHERE id = ?',
          [postId]
        );
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
  }

  async createUser(username: string, email: string, preferredLanguage: 'en' | 'sw'): Promise<number> {
    if (this.isWeb) {
      const users = JSON.parse(localStorage.getItem('storyDaily_users') || '[]') as User[];
      const newUser: User = {
        id: users.length + 1,
        username,
        email,
        preferredLanguage,
        isPremium: false
      };
      users.push(newUser);
      localStorage.setItem('storyDaily_users', JSON.stringify(users));
      return newUser.id;
    } else {
      if (!this.db) throw new Error('Database not initialized');

      const result = await this.db.execute(
        'INSERT INTO users (username, email, preferredLanguage) VALUES (?, ?, ?)',
        [username, email, preferredLanguage]
      );

      return result.changes?.lastId || 0;
    }
  }

  async getUser(email: string): Promise<User | null> {
    if (this.isWeb) {
      const users = JSON.parse(localStorage.getItem('storyDaily_users') || '[]') as User[];
      return users.find(user => user.email === email) || null;
    } else {
      if (!this.db) throw new Error('Database not initialized');

      const result = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
      return result.values?.[0] || null;
    }
  }

  async updateUserLanguage(userId: number, language: 'en' | 'sw'): Promise<void> {
    if (this.isWeb) {
      const users = JSON.parse(localStorage.getItem('storyDaily_users') || '[]') as User[];
      const userIndex = users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        users[userIndex].preferredLanguage = language;
        localStorage.setItem('storyDaily_users', JSON.stringify(users));
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');

      await this.db.execute(
        'UPDATE users SET preferredLanguage = ? WHERE id = ?',
        [language, userId]
      );
    }
  }

  async close(): Promise<void> {
    if (this.db && !this.isWeb) {
      await this.db.close();
      await this.sqlite.closeConnection('relationship_app', false);
    }
  }
}

export const sqliteService = new SQLiteService();
