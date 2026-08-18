const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.msg)) || "Algo deu errado. Tente novamente.";
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (payload) => request("/user", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/user/login", { method: "POST", body: payload, auth: false }),
  listCustomers: ({ page = 1, limit = 10, search = "" }) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.set("search", search);
    return request(`/customers?${params.toString()}`);
  },
  getCustomer: (id) => request(`/customer/${id}`),
  createCustomer: (payload) => request("/customer", { method: "POST", body: payload }),
  updateCustomer: (id, payload) => request(`/customer/${id}`, { method: "PATCH", body: payload }),
  deleteCustomer: (id) => request(`/customer/${id}`, { method: "DELETE" }),
};
