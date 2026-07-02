import BASE from "./fakeenv";

let _token = null;

export function setCachedToken(token) {
  _token = token;
}

function getToken() {
  if (_token === null) {
    _token = localStorage.getItem('bellezza_token');
  }
  return _token;
}

const getHeaders = (auth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// Products
export const api = {
  // Products
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/products${q ? `?${q}` : ''}`).then(handleResponse);
  },
  getProductBySlug: (slug) =>
    fetch(`${BASE}/products/${slug}`).then(handleResponse),
  getRelatedProducts: (id) =>
    fetch(`${BASE}/products/related/${id}`).then(handleResponse),
  getAdminProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE}/products/admin/all${q ? `?${q}` : ''}`, {
      headers: getHeaders(true),
    }).then(handleResponse);
  },
  getStats: () =>
    fetch(`${BASE}/products/stats`, { headers: getHeaders(true) }).then(handleResponse),
  createProduct: (data) =>
    fetch(`${BASE}/products`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateProduct: (id, data) =>
    fetch(`${BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteProduct: (id) =>
    fetch(`${BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    }).then(handleResponse),
  deleteProducts: (ids) =>
    fetch(`${BASE}/products/bulk-delete`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ ids }),
    }).then(handleResponse),

  // Categories
  getCategories: () =>
    fetch(`${BASE}/categories`).then(handleResponse),
  createCategory: (data) =>
    fetch(`${BASE}/categories`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateCategory: (id, data) =>
    fetch(`${BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteCategory: (id) =>
    fetch(`${BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    }).then(handleResponse),

  // Tags
  getTags: () =>
    fetch(`${BASE}/tags`).then(handleResponse),
  createTag: (data) =>
    fetch(`${BASE}/tags`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateTag: (id, data) =>
    fetch(`${BASE}/tags/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteTag: (id) =>
    fetch(`${BASE}/tags/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    }).then(handleResponse),

  // Auth
  login: (credentials) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(credentials),
    }).then(handleResponse),
  getMe: () =>
    fetch(`${BASE}/auth/me`, { headers: getHeaders(true) }).then(handleResponse),
  updateProfile: (data) =>
    fetch(`${BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Upload ─────────────────────────────────────────────────────────────────
  // Server-side upload via backend (more reliable, no signature issues)
  uploadToCloudinary: async (file, folder = 'bellezza/products') => {
    const token = getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const form = new FormData();
    form.append('image', file);
    
    const res = await fetch(`${BASE}/upload/product-image`, {
      method: 'POST',
      headers,
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return { url: data.image.url, publicId: data.image.publicId };
  },

  uploadMultipleToCloudinary: async (files, folder = 'bellezza/products') => {
    const token = getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const form = new FormData();
    Array.from(files).forEach(file => form.append('images', file));
    
    const res = await fetch(`${BASE}/upload/product-images`, {
      method: 'POST',
      headers,
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data.images.map(img => ({ url: img.url, publicId: img.publicId }));
  },

  uploadImage: async (file, type = 'category') => {
    const token = getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const form = new FormData();
    const endpoint = type === 'icon' ? '/upload/category-icon' : '/upload/category-image';
    form.append('image', file);
    
    const res = await fetch(`${BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return { url: data.image.url, publicId: data.image.publicId };
  },

  deleteFromCloudinary: (publicId) => {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(`${BASE}/upload/${publicId}`, { method: 'DELETE', headers }).then(handleResponse);
  },

  // Newsletter
  subscribe: (email) =>
    fetch(`${BASE}/newsletter`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email }),
    }).then(handleResponse),

  // Site Settings
  getSiteSettings: () =>
    fetch(`${BASE}/settings`).then(handleResponse),
  updateSiteSettings: (data) =>
    fetch(`${BASE}/settings`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
};