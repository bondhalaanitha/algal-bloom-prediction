
import { CheckCircle, AlertTriangle } from "lucide-react";
import RiskBadge from "./RiskBadge";

function PredictionResult({ result }) {
  if (!result) return null;

  const risk = String(result.risk || "").toUpperCase();
  const hasProbability =
    typeof result.probability === "number" &&
    Number.isFinite(result.probability);

  const percentage = hasProbability
    ? Math.round(result.probability * 100)
    : null;

  const Icon =
    risk === "LOW" ? CheckCircle : AlertTriangle;

  const factors = Array.isArray(result.contributingFactors)
    ? result.contributingFactors
    : [];

  return (
    <div className="prediction-result">
      <div className="result-header">
        <div>
          <span className="result-label">ALGAL BLOOM RISK</span>
          <h2>
            <RiskBadge risk={risk} />
          </h2>
        </div>

        <div className="result-icon">
          <Icon size={36} />
        </div>
      </div>

      <div className="probability-section">
        <div className="probability-header">
          <span>Prediction Probability</span>
          <strong>
            {percentage === null ? "Unavailable" : `${percentage}%`}
          </strong>
        </div>

        {percentage !== null && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            />
          </div>
        )}
      </div>

      <div className="result-section">
        <h3>Why this prediction?</h3>
        <p>
          {result.explanation ||
            "Risk estimated from the submitted water-quality measurements."}
        </p>
      </div>

      <div className="result-section">
        <h3>Contributing Factors</h3>

        {factors.length > 0 ? (
          <ul className="factor-list">
            {factors.map((factor, index) => (
              <li key={index}>
                <CheckCircle size={17} />
                {factor}
              </li>
            ))}
          </ul>
        ) : (
          <p>
            The model does not provide individual contributing factors.
          </p>
        )}
      </div>

      <div className="recommendation">
        <h3>Recommended Action</h3>
        <p>
          {result.recommendation ||
            "Continue monitoring water quality and review the model result."}
        </p>
      </div>

      <div className="prediction-time">
        Prediction generated at{" "}
        {result.timestamp
          ? new Date(result.timestamp).toLocaleString()
          : "time unavailable"}
      </div>
    </div>
  );
}

export default PredictionResult;