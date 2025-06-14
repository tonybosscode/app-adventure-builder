
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

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if platform supports SQLite
      const isAvailable = await CapacitorSQLite.isAvailable();
      if (!isAvailable.result) {
        throw new Error('SQLite is not available on this platform');
      }

      // Create connection
      this.db = await this.sqlite.createConnection('relationship_app', false, 'no-encryption', 1, false);
      
      // Open database
      await this.db.open();

      // Create tables
      await this.createTables();
      
      // Insert sample data
      await this.insertSampleData();

      this.isInitialized = true;
      console.log('SQLite database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SQLite:', error);
      throw error;
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
    if (!this.db) throw new Error('Database not initialized');

    // Check if data already exists
    const existingPosts = await this.db.query('SELECT COUNT(*) as count FROM posts');
    if (existingPosts.values && existingPosts.values[0].count > 0) {
      return; // Data already exists
    }

    const samplePosts = [
      // English Content
      {
        title: 'Finding True Love in Modern Times',
        content: 'Love stories have evolved with technology, but the essence remains the same...',
        category: 'love-stories',
        language: 'en',
        isPremium: 0,
        likes: 15
      },
      {
        title: 'Building a Strong Marriage Foundation',
        content: 'Marriage requires continuous effort from both partners...',
        category: 'marriage-life',
        language: 'en',
        isPremium: 1,
        likes: 23
      },
      {
        title: 'Zodiac Compatibility in Relationships',
        content: 'Understanding how star signs interact can help...',
        category: 'zodiac-relationships',
        language: 'en',
        isPremium: 0,
        likes: 8
      },
      {
        title: 'Managing Office Romance',
        content: 'Workplace relationships require special consideration...',
        category: 'work-relationships',
        language: 'en',
        isPremium: 1,
        likes: 12
      },
      
      // Swahili Content
      {
        title: 'Kupata Upendo wa Kweli Wakati Huu',
        content: 'Hadithi za mapenzi zimebadilika na teknolojia, lakini msingi unabaki...',
        category: 'love-stories',
        language: 'sw',
        isPremium: 0,
        likes: 18
      },
      {
        title: 'Kujenga Msingi Imara wa Ndoa',
        content: 'Ndoa inahitaji juhudi za kila wakati kutoka kwa wachumba wote...',
        category: 'marriage-life',
        language: 'sw',
        isPremium: 1,
        likes: 27
      },
      {
        title: 'Ulinganifu wa Nyota katika Mahusiano',
        content: 'Kuelewa jinsi dalili za anga zinavyoungana kunaweza kusaidia...',
        category: 'zodiac-relationships',
        language: 'sw',
        isPremium: 0,
        likes: 11
      },
      {
        title: 'Kusimamia Mapenzi Kazini',
        content: 'Mahusiano ya kazini yanahitaji utunzaji maalum...',
        category: 'work-relationships',
        language: 'sw',
        isPremium: 1,
        likes: 9
      }
    ];

    for (const post of samplePosts) {
      await this.db.execute(
        'INSERT INTO posts (title, content, category, language, isPremium, likes) VALUES (?, ?, ?, ?, ?, ?)',
        [post.title, post.content, post.category, post.language, post.isPremium, post.likes]
      );
    }
  }

  async getPosts(language: 'en' | 'sw', category?: string): Promise<Post[]> {
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

  async likePost(postId: number, userId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Insert like record
      await this.db.execute(
        'INSERT OR IGNORE INTO user_likes (userId, postId) VALUES (?, ?)',
        [userId, postId]
      );

      // Update likes count
      await this.db.execute(
        'UPDATE posts SET likes = likes + 1 WHERE id = ?',
        [postId]
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }

  async createUser(username: string, email: string, preferredLanguage: 'en' | 'sw'): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.execute(
      'INSERT INTO users (username, email, preferredLanguage) VALUES (?, ?, ?)',
      [username, email, preferredLanguage]
    );

    return result.changes?.lastId || 0;
  }

  async getUser(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    return result.values?.[0] || null;
  }

  async updateUserLanguage(userId: number, language: 'en' | 'sw'): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(
      'UPDATE users SET preferredLanguage = ? WHERE id = ?',
      [language, userId]
    );
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      await this.sqlite.closeConnection('relationship_app', false);
    }
  }
}

export const sqliteService = new SQLiteService();
