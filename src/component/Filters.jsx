import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem("token");

const Filters = ({ value, onChange }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch(`${API}/users/list`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      }
    }
    loadUsers();
  }, []);

  function handleChange(e) {
    const { name, value: val } = e.target;
    onChange({ ...value, [name]: val });
  }

  return (
    <div className="grid grid-cols-12 gap-4 mb-6 p-6 rounded-2xl shadow bg-white">
      <select
        name="user"
        value={value.user}
        onChange={handleChange}
        className="col-span-3 border rounded px-2 py-1"
      >
        <option value="">All Users</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <select
        name="status"
        value={value.status}
        onChange={handleChange}
        className="col-span-3 border rounded px-2 py-1"
      >
        <option value="">All Status</option>
        <option value="On Track">On Track</option>
        <option value="At Risk">At Risk</option>
        <option value="Off Track">Off Track</option>
      </select>
    </div>
  );
};

export default Filters;
