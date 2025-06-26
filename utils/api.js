import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 секунд таймаут
});

// Добавляем перехватчик для запросов (для отладки)
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      config.data
    );
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Добавляем перехватчик для ответов
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API Response: ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message,
    });

    // Показываем пользователю понятные ошибки
    if (error.response?.status === 404) {
      console.error("🔍 Ресурс не найден");
    } else if (error.response?.status === 500) {
      console.error("💥 Ошибка сервера");
    } else if (error.code === "ECONNABORTED") {
      console.error("⏰ Таймаут запроса");
    } else if (error.code === "NETWORK_ERROR") {
      console.error("🌐 Ошибка сети");
    }

    return Promise.reject(error);
  }
);

export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const achievementsAPI = {
  getAll: () => api.get("/achievements"),
  getById: (id) => api.get(`/achievements/${id}`),
  create: (data) => api.post("/achievements", data),
  update: (id, data) => api.patch(`/achievements/${id}`, data),
  delete: (id) => api.delete(`/achievements/${id}`),
};

export const rewardsAPI = {
  getAll: () => api.get("/rewards"),
  getById: (id) => api.get(`/rewards/${id}`),
  create: (data) => api.post("/rewards", data),
  update: (id, data) => api.patch(`/rewards/${id}`, data),
  delete: (id) => api.delete(`/rewards/${id}`),
};

export const progressAPI = {
  getAll: () => api.get("/progress"),
  getByUserId: (userId) => api.get(`/progress/user/${userId}`),
  create: (data) => api.post("/progress", data),
  update: (id, data) => api.patch(`/progress/${id}`, data),
  delete: (id) => api.delete(`/progress/${id}`),
};

export const statsAPI = {
  getStats: () => api.get("/api/stats"),
};

export default api;
