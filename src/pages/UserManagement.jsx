import { useEffect, useState } from "react";
import "../App.css";
import Modal from "../component/Modal";
import AlertModal from "../component/AlertModal";
import { useAuth } from "../auth/AuthContext";

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem("token");

export default function UserManagement() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertCfg, setAlertCfg] = useState({
    title: "",
    message: "",
    mode: "info",
    confirmText: "OK",
    cancelText: "Cancel",
    onConfirm: () => {},
  });

  const openInfo = (title, message) => {
    setAlertCfg({
      title,
      message,
      mode: "info",
      confirmText: "OK",
      onConfirm: () => setAlertOpen(false),
    });
    setAlertOpen(true);
  };

  const api = async (path, opts = {}) => {
    const res = await fetch(`${API}${path}`, {
      ...opts,
      headers: {
        "Content-Type": "application/json",
        ...(opts.headers || {}),
        Authorization: `Bearer ${token()}`,
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api("/users");
      setUsers(data || []);
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const emptyForm = { username: "", email: "", password: "", roleName: "user" };
  const [form, setForm] = useState(emptyForm);
  const handleChange = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const openCreate = () => {
    if (!isAdmin)
      return openInfo("Permission denied", "Only admin can create.");
    setForm(emptyForm);
    setEditingId(null);
    setIsOpen(true);
  };

  const openEdit = (u) => {
    if (!isAdmin) return openInfo("Permission denied", "Only admin can edit.");
    setForm({
      username: u.username,
      email: u.email,
      password: "",
      roleName: u.roleName || "user",
    });
    setEditingId(u._id);
    setIsOpen(true);
  };

  const askDelete = (id) => {
    if (!isAdmin)
      return openInfo("Permission denied", "Only admin can delete.");
    setAlertCfg({
      title: "Delete User",
      message: "Are you sure you want to delete this user?",
      mode: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await api(`/users/${id}`, { method: "DELETE" });
          setAlertOpen(false);
          await loadUsers();
          openInfo("Deleted", "User has been deleted.");
        } catch (e) {
          setAlertOpen(false);
          openInfo("Error", e.message);
        }
      },
    });
    setAlertOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin)
      return openInfo("Permission denied", "Only admin can do this.");

    if (!form.username.trim())
      return openInfo("Validation", "Please enter Username");
    if (!form.email.trim()) return openInfo("Validation", "Please enter Email");
    if (!form.roleName) return openInfo("Validation", "Please select Role");

    try {
      if (editingId == null) {
        await api("/users", {
          method: "POST",
          body: JSON.stringify(form),
        });
        openInfo("Saved", "User has been created.");
      } else {
        await api(`/users/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        openInfo("Saved", "User has been updated.");
      }
      setIsOpen(false);
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      openInfo("Error", err.message);
    }
  };

  const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : "-");
  const roleDisplay = (u) => u.roleName || u.role?.name || u.role || "-";

  return (
    <div className="p-10 h-screen overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        {isAdmin && (
          <button className="btn btn-create-submit" onClick={openCreate}>
            <img className="me-2 w-[15px]" src="images/icon-plus.png" alt="" />
            Create
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading…</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-[20%]">Username</th>
              <th className="w-[25%]">Email</th>
              <th className="w-[15%]">Role</th>
              <th className="w-[20%]">Created At</th>
              <th className="w-[20%]"></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td className="truncate">{u.email}</td>
                  <td className="text-center">{roleDisplay(u)}</td>
                  <td>{fmt(u.createdAt)}</td>
                  <td>
                    {isAdmin && (
                      <div className="manage-tools flex gap-2">
                        <button className="edit" onClick={() => openEdit(u)}>
                          <img src="images/icon-edit.png" alt="edit" />
                        </button>
                        <button
                          className="del"
                          onClick={() => askDelete(u._id)}
                        >
                          <img src="images/icon-del.png" alt="delete" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingId(null);
        }}
        title={editingId == null ? "Create User" : "Edit User"}
        size="max-w-lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setEditingId(null);
              }}
              className="px-4 py-2 btn btn-cancel"
            >
              Cancel
            </button>
            <button
              form="user-form"
              type="submit"
              className="px-4 py-2 btn btn-create-submit"
            >
              {editingId == null ? "Save" : "Update"}
            </button>
          </div>
        }
      >
        <form id="user-form" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold">Username</label>
            <input
              type="text"
              className="w-full"
              value={form.username}
              onChange={handleChange("username")}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              className="w-full"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              className="w-full"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="••••••"
              disabled={editingId}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Role</label>
            <select
              className="w-full"
              value={form.roleName}
              onChange={handleChange("roleName")}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
        </form>
      </Modal>

      <AlertModal
        open={alertOpen}
        title={alertCfg.title}
        message={alertCfg.message}
        mode={alertCfg.mode}
        confirmText={alertCfg.confirmText}
        cancelText={alertCfg.cancelText}
        onConfirm={alertCfg.onConfirm}
        onCancel={() => setAlertOpen(false)}
      />
    </div>
  );
}
