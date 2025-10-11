const API_BASE_URL = 'http://172.16.38.91:5001/api';

interface RegisterData {
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  password: string;
  is_private?: boolean;
  interests: string[];
}

export const apiService = {
  async login(credential: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  async register(userData: RegisterData) {
    // Clean phone number - remove spaces and non-digit characters except +
    const cleanedUserData = {
      ...userData,
      phone_number: userData.phone_number.replace(/\s+/g, '').replace(/[^\d+]/g, '')
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedUserData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Log detailed error for debugging
      console.log('Registration error response:', data);
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  async getGames(category?: string) {
    const url = category ? `${API_BASE_URL}/games?category=${category}` : `${API_BASE_URL}/games`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch games');
    }

    return data;
  },

  async getGameCategories() {
    const response = await fetch(`${API_BASE_URL}/games/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch game categories');
    }

    return data;
  },

  async verifyToken(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Token verification failed');
    }

    return data;
  },

  async getFeed(page: number = 1, limit: number = 10) {
    const token = await import('@react-native-async-storage/async-storage').then(m => 
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/posts/feed?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch feed');
    }

    return data;
  },

  async likePost(postId: string) {
    const token = await import('@react-native-async-storage/async-storage').then(m => 
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to like post');
    }

    return data;
  },

  async addComment(postId: string, content: string) {
    const token = await import('@react-native-async-storage/async-storage').then(m => 
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add comment');
    }

    return data;
  },

  async createPost(content: string, sport: string) {
    const token = await import('@react-native-async-storage/async-storage').then(m => 
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, sport }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create post');
    }

    return data;
  },
};

export default apiService;
