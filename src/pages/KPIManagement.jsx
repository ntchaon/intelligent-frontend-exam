import { useEffect, useState, useMemo } from "react";
import "../App.css";
import Modal from "../component/Modal";
import AlertModal from "../component/AlertModal";
import { useAuth } from "../auth/AuthContext";

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem("token");

export default function KPIManagement() {
  const { isAdmin, isUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [kpis, setKpis] = useState([]);
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

  const emptyForm = {
    title: "",
    description: "",
    targetValue: "",
    actualValue: "",
    status: "",
    assignedUser: "",
    startDate: "",
    endDate: "",
  };
  const [form, setForm] = useState(emptyForm);

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
  const userNameById = useMemo(() => {
    const m = new Map();
    users.forEach((u) => m.set(u.id, u.name));
    return m;
  }, [users]);

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

  const loadKpis = async () => {
    try {
      setLoading(true);
      const data = await api("/kpis");
      setKpis(data);
    } catch (e) {
      openInfo("Error", e.message);
    } finally {
      setLoading(false);
    }
  };
  const loadUsers = async () => {
    try {
      const data = await api("/users/list");

      setUsers(data || []);
    } catch (e) {
      console.error("Load users list failed:", e);
      setUsers([]);
    }
  };
  useEffect(() => {
    loadKpis();
    loadUsers();
  }, []);

  const askDelete = (id) => {
    if (!isAdmin)
      return openInfo("Permission denied", "Only admin can delete.");
    setAlertCfg({
      title: "Delete KPI",
      message: "Are you sure you want to delete this KPI?",
      mode: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await api(`/kpis/${id}`, { method: "DELETE" });
          setAlertOpen(false);
          await loadKpis();
          openInfo("Deleted", "KPI has been deleted.");
        } catch (e) {
          setAlertOpen(false);
          openInfo("Error", e.message);
        }
      },
    });
    setAlertOpen(true);
  };

  const openCreate = () => {
    if (!isAdmin)
      return openInfo("Permission denied", "Only admin can create.");
    setEditingId(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row._id);

    const assigned =
      typeof row.assignedUser === "object" && row.assignedUser?._id
        ? row.assignedUser._id
        : row.assignedUser || "";

    setForm({
      title: row.title ?? "",
      description: row.description ?? "",
      targetValue: row.targetValue ?? "",
      actualValue: row.actualValue ?? "",
      status: row.status ?? "",
      assignedUser: assigned,
      startDate: row.startDate?.slice(0, 10) ?? "",
      endDate: row.endDate?.slice(0, 10) ?? "",
    });
    setIsOpen(true);
  };

  const handleChange = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAdmin) {
      if (!form.title?.trim())
        return openInfo("Validation", "Please enter Title");
      if (!form.status) return openInfo("Validation", "Please select Status");
      if (!form.startDate || !form.endDate)
        return openInfo("Validation", "Please select Start/End dates");
    } else if (isUser) {
      if (!form.status) return openInfo("Validation", "Please select Status");
    } else {
      return openInfo("Permission denied", "Please login.");
    }

    try {
      if (editingId == null) {
        await api("/kpis", {
          method: "POST",
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description?.trim() || "",
            targetValue: form.targetValue,
            actualValue: form.actualValue === "" ? 0 : form.actualValue,
            status: form.status,
            assignedUser: form.assignedUser || null,
            startDate: form.startDate,
            endDate: form.endDate,
          }),
        });
        setIsOpen(false);
        await loadKpis();
        openInfo("Saved", "KPI has been created.");
      } else {
        const payload = isAdmin
          ? {
              title: form.title.trim(),
              description: form.description?.trim() || "",
              targetValue: form.targetValue === "" ? null : form.targetValue,
              actualValue: form.actualValue === "" ? null : form.actualValue,
              status: form.status,
              assignedUser: form.assignedUser || null,
              startDate: form.startDate,
              endDate: form.endDate,
            }
          : { status: form.status };

        await api(`/kpis/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setIsOpen(false);
        setEditingId(null);
        await loadKpis();
        openInfo(
          "Saved",
          isAdmin ? "KPI has been updated." : "Status has been updated."
        );
      }
    } catch (err) {
      openInfo("Error", err.message);
    }
  };

  const statusClass = (status) => {
    if (!status) return "";
    const s = status.toLowerCase();
    if (s.includes("on")) return "ontrack";
    if (s.includes("risk")) return "atrisk";
    if (s.includes("off")) return "offtrack";
    return "";
  };

  const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString("en-GB") : "-");
  const disabled = !isAdmin;

  return (
    <div className="p-10 h-screen overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">KPI Management</h1>
      </div>

      <div className="flex justify-end">
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
              <th className="w-[20%]">Title</th>
              <th className="w-[25%]">Description</th>
              <th>Target value</th>
              <th>Actual value</th>
              <th>Status</th>
              <th>Assigned user</th>
              <th>Start date</th>
              <th>End date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {kpis.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No KPIs yet.
                </td>
              </tr>
            ) : (
              kpis.map((item) => {
                const ownerId =
                  typeof item.assignedUser === "object" &&
                  item.assignedUser?._id
                    ? item.assignedUser._id
                    : item.assignedUser;

                return (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td className="truncate">{item.description}</td>
                    <td className="text-center">{item.targetValue ?? "-"}</td>
                    <td className="text-center">{item.actualValue ?? "-"}</td>
                    <td>
                      <div className={`status-btn ${statusClass(item.status)}`}>
                        {item.status || "-"}
                      </div>
                    </td>
                    <td className="text-center">
                      {userNameById.get(ownerId) || "-"}
                    </td>
                    <td>{fmt(item.startDate)}</td>
                    <td>{fmt(item.endDate)}</td>
                    <td>
                      <div className="manage-tools">
                        <button
                          className="read"
                          title="View"
                          onClick={() =>
                            openInfo(
                              "KPI Detail",
                              JSON.stringify(item, null, 2)
                            )
                          }
                        >
                          <img src="images/icon-view.png" alt="" />
                        </button>
                        <button
                          className="edit"
                          title="Edit"
                          onClick={() => openEdit(item)}
                        >
                          <img src="images/icon-edit.png" alt="" />
                        </button>
                        {isAdmin && (
                          <button
                            className="del"
                            title="Delete"
                            onClick={() => askDelete(item._id)}
                          >
                            <img src="images/icon-del.png" alt="" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
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
        title={
          editingId == null ? "Add KPI" : isAdmin ? "Edit KPI" : "Edit Status"
        }
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
              form="kpi-form"
              type="submit"
              className="px-4 py-2 btn btn-create-submit"
            >
              {editingId == null ? "Save" : "Update"}
            </button>
          </div>
        }
      >
        <form id="kpi-form" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              className="w-full"
              value={form.title}
              onChange={handleChange("title")}
              disabled={disabled}
              data-autofocus={isAdmin || editingId == null}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              className="w-full"
              rows="3"
              value={form.description}
              onChange={handleChange("description")}
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Target Value</label>
              <input
                type="text"
                className="w-full"
                value={form.targetValue}
                onChange={handleChange("targetValue")}
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Actual Value</label>
              <input
                type="text"
                className="w-full"
                value={form.actualValue}
                onChange={handleChange("actualValue")}
                disabled={disabled}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Status</label>
            <select
              className="w-full"
              value={form.status}
              onChange={handleChange("status")}
            >
              <option value="">Status</option>
              <option>On Track</option>
              <option>At Risk</option>
              <option>Off Track</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Assigned User</label>
            <select
              className="w-full"
              value={form.assignedUser}
              onChange={handleChange("assignedUser")}
              disabled={!isAdmin}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Start Date</label>
              <input
                type="date"
                className="w-full"
                value={form.startDate}
                onChange={handleChange("startDate")}
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">End Date</label>
              <input
                type="date"
                className="w-full"
                value={form.endDate}
                onChange={handleChange("endDate")}
                disabled={disabled}
              />
            </div>
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
