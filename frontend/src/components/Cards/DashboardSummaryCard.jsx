const DashboardSummaryCard = ({ icon, label, value, color, highlight }) => {
  return (
    <div
      className={`p-3 flex flex-col gap-3 ${highlight ? "bg-blue-500" : "bg-blue-50"} rounded-lg`}
    >
      <section className="w-full flex items-center justify-between">
        <h1 className={`${highlight ? "text-white" : ""} font-medium`}>
          {label}
        </h1>
        <div
          className={`w-10 h-10 flex text-lg bg-white items-center justify-center ${color} rounded-full `}
        >
          {icon}
        </div>
      </section>
      <span
        className={`text-start text-5xl ${highlight ? "text-white" : color} font-semibold`}
      >
        {value}
      </span>{" "}
    </div>
  );
};

export default DashboardSummaryCard;
