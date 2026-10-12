
import { useEffect, useState } from "react";
import { History as HistoryIcon, Search, RefreshCw } from "lucide-react";

import RiskBadge from "../components/RiskBadge";
import { getPredictionHistory } from "../services/api";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function History() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    setLoading(true);
    setError("");

    try {
      const data = await getPredictionHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("History loading error:", err);
      setError(err.message || "Unable to load prediction history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const searchText = search.trim().toLowerCase();

  const filteredHistory = history.filter((item) => {
    const matchesRisk =
      filter === "ALL" ||
      String(item.risk || "").toUpperCase() === filter;

    const matchesSearch =
      String(item.waterbody || "").toLowerCase().includes(searchText) ||
      String(item.site || "").toLowerCase().includes(searchText);

    return matchesRisk && matchesSearch;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="page-label">PREDICTION RECORDS</span>
          <h1>Prediction History</h1>
          <p>Review previous algal bloom risk assessments.</p>
        </div>
      </div>

      <div className="history-card">
        <div className="history-controls">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search waterbody or site..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search predictions by waterbody or site"
            />
          </div>

          <div className="filter-buttons">
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((value) => (
              <button
                key={value}
                type="button"
                className={filter === value ? "filter active" : "filter"}
                onClick={() => setFilter(value)}
              >
                {value === "ALL"
                  ? "All"
                  : value.charAt(0) + value.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="empty-history">
            <HistoryIcon size={36} />
            <h3>Loading predictions...</h3>
            <p>Please wait while saved records are retrieved.</p>
          </div>
        ) : error ? (
          <div className="empty-history">
            <h3>Couldn't load prediction history</h3>
            <p>{error}</p>

            <button
              type="button"
              className="filter"
              onClick={loadHistory}
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="empty-history">
            <HistoryIcon size={40} />
            <h3>No predictions found</h3>
            <p>Try changing your search or risk filter.</p>
          </div>
        ) : (
          <div className="prediction-table-wrapper">
            <table className="prediction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Waterbody</th>
                  <th>Site</th>
                  <th>Risk</th>
                  <th>Probability</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.timestamp || item.date)}</td>

                    <td>
                      <strong>{item.waterbody || "—"}</strong>
                    </td>

                    <td>{item.site || "—"}</td>

                    <td>
                      <RiskBadge
                        risk={String(item.risk || "").toUpperCase()}
                      />
                    </td>

                    <td>
                      {typeof item.probability === "number"
                        ? `${Math.round(item.probability * 100)}%`
                        : "—"}
                    </td>

                    <td>
                      <span className="status-pill">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <p className="history-count">
            Showing {filteredHistory.length} of {history.length} predictions
          </p>
        )}
      </div>
    </div>
  );
}

export default History;