import { useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Droplets,
  MapPin
} from "lucide-react";

import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";

import {
  getDashboardData,
  getPredictionHistory
} from "../services/api";

function Dashboard() {

  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {

    async function loadDashboard() {

      const dashboardData = await getDashboardData();
      const predictionHistory = await getPredictionHistory();

      setData(dashboardData);
      setHistory(predictionHistory);

    }

    loadDashboard();

  }, []);


  if (!data) {

    return (
      <div className="page">

        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading environmental dashboard...</p>
        </div>

      </div>
    );

  }


  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="page-label">
            ENVIRONMENTAL MONITORING
          </span>

          <h1>Dashboard</h1>

          <p>
            Overview of algal bloom monitoring and
            prediction activity.
          </p>

        </div>

        <div className="monitoring-status">

          <span className="status-dot"></span>

          Monitoring Active

        </div>

      </div>


      {/* STAT CARDS */}

      <div className="stats-grid">

        <StatCard
          title="Total Observations"
          value={data.totalObservations.toLocaleString()}
          description="Recorded observations"
          icon={<Activity size={24} />}
        />

        <StatCard
          title="High Risk"
          value={data.highRisk}
          description="Requires attention"
          icon={<AlertTriangle size={24} />}
        />

        <StatCard
          title="Medium Risk"
          value={data.mediumRisk}
          description="Continue monitoring"
          icon={<Droplets size={24} />}
        />

        <StatCard
          title="Low Risk"
          value={data.lowRisk}
          description="Normal conditions"
          icon={<CheckCircle size={24} />}
        />

      </div>


      {/* SECOND ROW */}

      <div className="dashboard-grid">

        {/* RECENT PREDICTIONS */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>
              <h2>Recent Predictions</h2>

              <p>
                Latest environmental risk assessments
              </p>
            </div>

          </div>


          <div className="prediction-table-wrapper">

            <table className="prediction-table">

              <thead>

                <tr>
                  <th>Date</th>
                  <th>Waterbody</th>
                  <th>Site</th>
                  <th>Risk</th>
                  <th>Probability</th>
                </tr>

              </thead>

              <tbody>

                {history.map((item) => (

                  <tr key={item.id}>

                    <td>{item.date}</td>

                    <td>
                      <strong>
                        {item.waterbody}
                      </strong>
                    </td>

                    <td>
                      <span className="site-name">
                        <MapPin size={14} />
                        {item.site}
                      </span>
                    </td>

                    <td>
                      <RiskBadge risk={item.risk} />
                    </td>

                    <td>
                      {Math.round(item.probability * 100)}%
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* MONITORING SUMMARY */}

        <div className="dashboard-card">

          <div className="dashboard-card-header">

            <div>
              <h2>Monitoring Summary</h2>

              <p>
                Current system status
              </p>
            </div>

          </div>


          <div className="summary-list">

            <div className="summary-item">

              <div className="summary-icon">
                <Activity size={20} />
              </div>

              <div>
                <span>System Status</span>
                <strong>Active</strong>
              </div>

            </div>


            <div className="summary-item">

              <div className="summary-icon">
                <MapPin size={20} />
              </div>

              <div>
                <span>Sites Monitored</span>
                <strong>{data.sitesMonitored}</strong>
              </div>

            </div>


            <div className="summary-item">

              <div className="summary-icon">
                <Droplets size={20} />
              </div>

              <div>
                <span>Water Observations</span>
                <strong>
                  {data.totalObservations}
                </strong>
              </div>

            </div>


            <div className="summary-item">

              <div className="summary-icon">
                <CheckCircle size={20} />
              </div>

              <div>
                <span>Last Updated</span>
                <strong>Today</strong>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* RISK OVERVIEW */}

      <div className="dashboard-card risk-overview">

        <div className="dashboard-card-header">

          <div>

            <h2>Risk Distribution</h2>

            <p>
              Current distribution of environmental
              observations
            </p>

          </div>

        </div>


        <div className="risk-bars">

          <div className="risk-bar-item">

            <div className="risk-bar-label">
              <span>High Risk</span>
              <strong>{data.highRisk}</strong>
            </div>

            <div className="bar">
              <div
                className="bar-fill high"
                style={{
                  width: `${Math.min(
                    (data.highRisk / data.totalObservations) * 100,
                    100
                  )}%`
                }}
              ></div>
            </div>

          </div>


          <div className="risk-bar-item">

            <div className="risk-bar-label">
              <span>Medium Risk</span>
              <strong>{data.mediumRisk}</strong>
            </div>

            <div className="bar">
              <div
                className="bar-fill medium"
                style={{
                  width: `${Math.min(
                    (data.mediumRisk / data.totalObservations) * 100,
                    100
                  )}%`
                }}
              ></div>
            </div>

          </div>


          <div className="risk-bar-item">

            <div className="risk-bar-label">
              <span>Low Risk</span>
              <strong>{data.lowRisk}</strong>
            </div>

            <div className="bar">
              <div
                className="bar-fill low"
                style={{
                  width: `${Math.min(
                    (data.lowRisk / data.totalObservations) * 100,
                    100
                  )}%`
                }}
              ></div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;