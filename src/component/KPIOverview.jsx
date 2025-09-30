import { useEffect, useState } from "react";
import KPICard from "./KPICard";

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem("token");

const KPIOverview = () => {
  const [data, setData] = useState({ ontrack: 0, atrisk: 0, offtrack: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">
      <KPICard color="ontrack" title="On Track" value={data.ontrack} />
      <KPICard color="atrisk" title="At Risk" value={data.atrisk} />
      <KPICard color="offtrack" title="Off Track" value={data.offtrack} />
    </div>
  );
};

export default KPIOverview;
