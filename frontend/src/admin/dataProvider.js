const API_URL = "http://localhost:8080";

// Ресурсы Refine -> реальные эндпоинты Spring
const resourceMap = {
  universities: "/api/vuz/admin-list",
  // spheres: "/api/spheres", — добавишь, когда появятся эндпоинты для сфер
};

const urlFor = (resource, id = null) => {
  const base = API_URL + (resourceMap[resource] ?? `/api/${resource}`);
  return id == null ? base : `${base}/${id}`;
};

export const customDataProvider = {
  getList: async ({ resource }) => {
    const response = await fetch(urlFor(resource));
    const data = await response.json();
    const items = Array.isArray(data) ? data : (data[resource] || data.data || []);

    return {
      data: items,
      total: items.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const response = await fetch(urlFor(resource, id));
    const data = await response.json();
    const item = Array.isArray(data) ? data[0] : data;
    return { data: item };
  },

  create: async ({ resource, variables }) => {
    const response = await fetch(urlFor(resource), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variables),
    });
    const data = await response.json();
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const response = await fetch(urlFor(resource, id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variables),
    });
    const data = await response.json();
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await fetch(urlFor(resource, id), {
      method: "DELETE",
    });
    const data = await response.json();
    return { data };
  },

  getApiUrl: () => API_URL,
};
