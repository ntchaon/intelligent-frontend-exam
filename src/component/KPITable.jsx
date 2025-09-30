import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem("token");

const KPITable = ({ filter }) => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filter?.user) params.append("user", filter.user);
      if (filter?.status) params.append("status", filter.status);

      const res = await fetch(`${API}/dashboard/table?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });

      const data = await res.json();
      setKpis(data || []);
    } catch (err) {
      console.error("Error loading KPIs:", err);
      setKpis([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
      <h2 className="font-semibold mb-2">KPI Tracking</h2>

      {loading ? (
        <div className="text-gray-500 text-center py-4">Loading…</div>
      ) : (
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">KPI</th>
              <th className="p-2">Owner</th>
              <th className="p-2">Category</th>
              <th className="p-2">Target</th>
              <th className="p-2">Progress</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {kpis.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No KPIs found.
                </td>
              </tr>
            ) : (
              kpis.map((kpi) => (
                <tr key={kpi._id} className="border-t">
                  <td className="p-2">{kpi.name}</td>
                  <td className="p-2">{kpi.owner}</td>
                  <td className="p-2">{kpi.category}</td>
                  <td className="p-2">{kpi.target}</td>
                  <td className="p-2">{kpi.progress}</td>
                  <td className="p-2">{kpi.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KPITable;
