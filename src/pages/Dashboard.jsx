import { useState } from "react";
import Filters from "../component/Filters";
import KPIOverview from "../component/KPIOverview";
import KPICharts from "../component/KPICharts";
import KPITable from "../component/KPITable";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    user: "",
    status: "",
  });

  return (
    <div>
      {filters["status"]}
      <div className="p-10 space-y-10 h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div>
          <h2>KPI Overview</h2>
          <KPIOverview />
        </div>

        <div>
          <h2>Filters</h2>

          <Filters value={filters} onChange={setFilters} />
        </div>

        <div>
          <h2>Analytics</h2>

          <KPICharts filter={filters} />
        </div>

        <div>
          <h2>KPI Table</h2>

          <KPITable filter={filters} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
