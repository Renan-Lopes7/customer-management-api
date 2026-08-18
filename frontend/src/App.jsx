import { useState, useEffect, useCallback } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
  Link,
} from "react-router-dom";
import { api } from "./api.js";

function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, login, logout };
}

function RequireAuth({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user, token } = await api.login(form);
      onLogin(user, token);
      navigate("/customers");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-mark">CRM</span>
          <h1>Entrar</h1>
          <p className="auth-subtitle">Acesse para gerenciar seus clientes</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span>e-mail</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="voce@email.com"
            />
          </label>
          <label className="field">
            <span>senha</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </label>

          {error && <div className="alert-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Aguarde..." : "Entrar"}
          </button>
        </form>

        <Link to="/register" className="link-btn">
          Não tem conta? Cadastre-se
        </Link>
      </div>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register(form);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-mark">CRM</span>
          <h1>Criar conta</h1>
          <p className="auth-subtitle">Cadastre-se para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span>nome</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Seu nome"
            />
          </label>
          <label className="field">
            <span>e-mail</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="voce@email.com"
            />
          </label>
          <label className="field">
            <span>senha</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </label>

          {error && <div className="alert-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Aguarde..." : "Cadastrar"}
          </button>
        </form>

        <Link to="/login" className="link-btn">
          Já tem conta? Entrar
        </Link>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn-danger-solid" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Fechar">
        ×
      </button>
    </div>
  );
}
function CustomerFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api
      .getCustomer(id)
      .then((customer) => setForm({ name: customer.name, email: customer.email }))
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await api.updateCustomer(id, form);
      } else {
        await api.createCustomer(form);
      }
      navigate("/customers", {
        state: { toast: isEdit ? "Cliente atualizado." : "Cliente criado." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-mark">CRM</span>
          <h1>{isEdit ? "Editar cliente" : "Novo cliente"}</h1>
          <p className="auth-subtitle">
            {isEdit ? "Atualize os dados do cliente" : "Cadastre um novo cliente"}
          </p>
        </div>

        {fetching ? (
          <p style={{ padding: "0 32px 24px", color: "var(--text-dim)", fontSize: "0.85rem" }}>
            Carregando...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field">
              <span>nome</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                placeholder="Nome do cliente"
              />
            </label>
            <label className="field">
              <span>e-mail</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                placeholder="cliente@email.com"
              />
            </label>

            {error && <div className="alert-error">{error}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate("/customers")}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function CustomersPage({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);

  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(location.state?.toast || "");

  useEffect(() => {
    if (location.state?.toast) {
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.listCustomers({ page, limit: 8, search });
      setCustomers(result.data || result);
      if (result.pagination) setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const goToPage = (nextPage) => {
    const params = { page: String(nextPage) };
    if (search) params.search = search;
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = { page: "1" };
    if (searchInput) params.search = searchInput;
    setSearchParams(params);
  };

  const handleDeleteClick = (customer) => {
    setConfirmDelete(customer);
  };

  const handleConfirmDelete = async () => {
    const customer = confirmDelete;
    setConfirmDelete(null);
    try {
      await api.deleteCustomer(customer.id);
      setToast(`Cliente "${customer.name}" excluído.`);
      loadCustomers();
    } catch (err) {
      setToast(err.message);
    }
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-mark">CRM</span>
          <span className="topbar-title">Clientes</span>
        </div>
        <div className="topbar-user">
          <span>Olá, {user?.name}</span>
          <button className="btn-ghost" onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="content">
        <div className="content-toolbar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              placeholder="Buscar por nome ou e-mail..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn-ghost">
              Buscar
            </button>
            {search && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setSearchInput("");
                  setSearchParams({ page: "1" });
                }}
              >
                Limpar
              </button>
            )}
          </form>
          <button className="btn-primary" onClick={() => navigate("/customers/new")}>
            + Novo cliente
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Carregando...</div>
        ) : customers.length === 0 ? (
          <div className="empty-state">Nenhum cliente encontrado.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th>Cadastrado por</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>
                      <span className={`badge ${c.status ? "badge-on" : "badge-off"}`}>
                        {c.status ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-dim)" }}>{c.user?.name || "—"}</td>
                    <td className="row-actions">
                      <button
                        className="btn-ghost"
                        onClick={() => navigate(`/customers/${c.id}/edit`)}
                      >
                        Editar
                      </button>
                      <button className="btn-danger" onClick={() => handleDeleteClick(c)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn-ghost"
              disabled={pagination.page <= 1}
              onClick={() => goToPage(pagination.page - 1)}
            >
              ← Anterior
            </button>
            <span>
              Página {pagination.page} de {pagination.totalPages} ({pagination.total} clientes)
            </span>
            <button
              className="btn-ghost"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => goToPage(pagination.page + 1)}
            >
              Próxima →
            </button>
          </div>
        )}
      </main>

      {confirmDelete && (
        <ConfirmDialog
          title="Excluir cliente"
          message={`Tem certeza que deseja excluir "${confirmDelete.name}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}

export default function App() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/customers" replace /> : <LoginPage onLogin={login} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/customers" replace /> : <RegisterPage />}
      />
      <Route
        path="/customers"
        element={
          <RequireAuth user={user}>
            <CustomersPage user={user} onLogout={handleLogout} />
          </RequireAuth>
        }
      />
      <Route
        path="/customers/new"
        element={
          <RequireAuth user={user}>
            <CustomerFormPage mode="create" />
          </RequireAuth>
        }
      />
      <Route
        path="/customers/:id/edit"
        element={
          <RequireAuth user={user}>
            <CustomerFormPage mode="edit" />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to={user ? "/customers" : "/login"} replace />} />
    </Routes>
  );
}
