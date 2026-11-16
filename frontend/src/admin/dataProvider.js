const API_URL = "http://localhost:3001";

export const customDataProvider = {
  getList: async ({ resource }) => {
    const response = await fetch(`${API_URL}/${resource}`);
    const data = await response.json();
    const items = Array.isArray(data) ? data : (data[resource] || data.data || []);

    return {
      data: items,
      total: items.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`);
    const data = await response.json();
    const item = Array.isArray(data) ? data[0] : data; // <-- Вот эта проверка решит проблему
    return { data: item };
  },

  create: async ({ resource, variables }) => {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variables),
    });
    const data = await response.json();
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variables),
    });
    const data = await response.json();
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return { data };
  },

  getApiUrl: () => API_URL,
};