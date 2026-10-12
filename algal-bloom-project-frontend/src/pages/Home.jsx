import { Link } from "react-router-dom";
import {
  Brain,
  Waves,
  ShieldCheck,
  Activity,
  ArrowRight
} from "lucide-react";

function Home() {

  return (
    <div className="page">

      {/* Hero */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            <Waves size={16} />
            AI + Environmental Monitoring
          </div>

          <h1>
            AI-Powered
            <span> Algal Bloom Prediction</span>
          </h1>

          <p>
            Monitor environmental conditions and use
            machine learning to identify potential algal
            bloom risks before they become a serious
            environmental problem.
          </p>

          <div className="hero-buttons">

            <Link
              to="/prediction"
              className="primary-button"
            >
              Predict Bloom Risk
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/dashboard"
              className="secondary-button"
            >
              View Dashboard
            </Link>

          </div>

        </div>


        <div className="hero-visual">

          <div className="water-card">

            <Waves size={70} />

            <h3>Water Health</h3>

            <p>
              Intelligent environmental monitoring
            </p>

            <div className="health-indicator">
              <span></span>
              Monitoring Active
            </div>

          </div>

        </div>

      </section>


      {/* Features */}

      <section className="section">

        <div className="section-heading">
          <span>WHY THIS MATTERS</span>

          <h2>
            Protecting water through early prediction
          </h2>

          <p>
            Algal blooms can negatively affect aquatic
            ecosystems, water quality and human activities.
            Early prediction can support timely monitoring
            and intervention.
          </p>
        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              <Brain />
            </div>

            <h3>AI Risk Prediction</h3>

            <p>
              Machine learning analyzes environmental
              observations to estimate algal bloom risk.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <Activity />
            </div>

            <h3>Environmental Monitoring</h3>

            <p>
              Monitor waterbody and site-level
              environmental observations.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <ShieldCheck />
            </div>

            <h3>Early Warning</h3>

            <p>
              Identify potentially high-risk conditions
              so monitoring can be increased.
            </p>

          </div>

        </div>

      </section>


      {/* SDG */}

      <section className="sdg-section">

        <div>
          <span className="section-tag">
            SUSTAINABLE DEVELOPMENT
          </span>

          <h2>
            Technology for healthier aquatic ecosystems
          </h2>

          <p>
            This project demonstrates how artificial
            intelligence and environmental data can support
            water-quality monitoring and sustainable
            environmental decision-making.
          </p>
        </div>

        <div className="sdg-cards">

          <div>
            <strong>SDG 6</strong>
            <span>Clean Water</span>
          </div>

          <div>
            <strong>SDG 13</strong>
            <span>Climate Action</span>
          </div>

          <div>
            <strong>SDG 14</strong>
            <span>Life Below Water</span>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;