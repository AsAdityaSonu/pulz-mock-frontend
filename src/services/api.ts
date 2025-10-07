const API_BASE_URL = 'http://172.16.37.17:5001/api';

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
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
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
};

export default apiService;
