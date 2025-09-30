import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem("token");

export default function KPICharts({ filter = {} }) {
  const [pieData, setPieData] = useState(null);
  const [lineData, setLineData] = useState(null);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams(filter).toString();

      const pieRes = await fetch(`${API}/dashboard/pie?${params}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const pieJson = await pieRes.json();

      setPieData({
        labels: ["On Track", "At Risk", "Off Track"],
        datasets: [
          {
            data: [
              pieJson["On Track"] || 0,
              pieJson["At Risk"] || 0,
              pieJson["Off Track"] || 0,
            ],
            backgroundColor: ["#22c55e", "#eab308", "#ef4444"], // เขียว / เหลือง / แดง
          },
        ],
      });

      const lineRes = await fetch(`${API}/dashboard/line?${params}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const lineJson = await lineRes.json();

      setLineData({
        labels: lineJson.labels,
        datasets: [
          {
            label: "KPI Achieved",
            data: lineJson.data,
            borderColor: "#22c55e",
            fill: false,
          },
        ],
      });
    } catch (err) {
      console.error("Fetch dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filter)]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px]">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-semibold mb-2">KPI Status Distribution</h3>
        {pieData ? <Pie data={pieData} /> : <div>Loading...</div>}
      </div>
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-semibold mb-2">KPI Trend Over Time</h3>
        {lineData ? <Line data={lineData} /> : <div>Loading...</div>}
      </div>
    </div>
  );
}
