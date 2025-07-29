import axios from 'axios';
import { useAppStore } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAppStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface SessionData {
  name?: string;
  chat_history?: ChatMessage[];
  generated_code?: {
    tsx: string;
    css: string;
  };
  ui_editor_state?: Record<string, unknown>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export const api = {
  // Authentication
  login: async (data: LoginData) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Sessions
  getSessions: async () => {
    const response = await apiClient.get('/sessions');
    return response.data;
  },

  getSession: async (id: string) => {
    const response = await apiClient.get(`/sessions/${id}`);
    return response.data;
  },

  createSession: async (data: { name?: string } = {}) => {
    const response = await apiClient.post('/sessions', data);
    return response.data;
  },

  updateSession: async (id: string, data: SessionData) => {
    const response = await apiClient.patch(`/sessions/${id}`, data);
    return response.data;
  },

  deleteSession: async (id: string) => {
    const response = await apiClient.delete(`/sessions/${id}`);
    return response.data;
  },

  downloadSession: async (id: string) => {
    const response = await apiClient.get(`/sessions/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // AI Streaming
  streamGeneration: (sessionId: string, prompt: string) => {
    const token = useAppStore.getState().token;
    
    if (!token) {
      throw new Error('Authentication token is missing. Please log in again.');
    }
    
    const url = `${API_BASE_URL}/ai/stream/${sessionId}?prompt=${encodeURIComponent(prompt)}&token=${encodeURIComponent(token)}`;
    
    console.log('Creating EventSource for URL:', url.replace(token, '***')); // Log URL without exposing token
    
    const eventSource = new EventSource(url);
    
    // Add connection timeout
    setTimeout(() => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        console.error('EventSource connection timeout');
        eventSource.close();
      }
    }, 10000); // 10 second timeout
    
    return eventSource;
  },

  // Health check
  health: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;
