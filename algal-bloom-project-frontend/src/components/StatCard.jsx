function StatCard({ title, value, icon, description }) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">
        <div className="stat-icon">
          {icon}
        </div>
      </div>

      <h3>{title}</h3>

      <div className="stat-value">
        {value}
      </div>

      {description && (
        <p>{description}</p>
      )}

    </div>
  );
}

export default StatCard;