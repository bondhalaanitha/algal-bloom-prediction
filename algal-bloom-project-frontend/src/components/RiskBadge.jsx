function RiskBadge({ risk }) {

  const normalizedRisk = risk?.toUpperCase();

  return (
    <span className={`risk-badge ${normalizedRisk?.toLowerCase()}`}>
      {normalizedRisk}
    </span>
  );
}

export default RiskBadge;