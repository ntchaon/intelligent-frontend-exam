
const KPICard = ({ title, value, color }) => (
  <div className={`p-6 rounded-2xl shadow bg-white`}>
    <div className={`status-btn text-base ${color}`}>{title}</div>
    <p className="text-3xl font-semibold mt-4 text-center">{value}</p>
  </div>
);

export default KPICard;
