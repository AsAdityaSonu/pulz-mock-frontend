const API_BASE_URL = 'http://172.16.36.43:5001/api';

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
      phone_number: userData.phone_number.replace(/\s+/g, '').replace(/[^\d+]/g, ''),
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
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
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
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
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
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
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
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
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

  async getMyStreak() {
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/streaks/my-streak`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch streak data');
    }

    return data;
  },

  async recordActivity(activityType: 'post' | 'comment' | 'like' | 'share') {
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/streaks/record-activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activityType }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to record activity');
    }

    return data;
  },

  async getAchievements() {
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/streaks/achievements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch achievements');
    }

    return data;
  },

  async getAchievementStats() {
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/streaks/achievement-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch achievement stats');
    }

    return data;
  },

  async claimAchievement(achievementId: string) {
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/streaks/claim-achievement/${achievementId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to claim achievement');
    }

    return data;
  },

  async getUserProfile() {
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }

    return data;
  },

  async updateUserProfile(profileData: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    is_private?: boolean;
    interests?: string[];
  }) {
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  },

  async getUserStats() {
    const token = await import('@react-native-async-storage/async-storage').then((m) =>
      m.default.getItem('authToken')
    );

    const response = await fetch(`${API_BASE_URL}/user/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user stats');
    }

    return data;
  },
};

export default apiService;
