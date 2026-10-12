import {
  Waves,
  Brain,
  Database,
  AlertTriangle,
  ArrowDown,
  Target
} from "lucide-react";

function About() {

  return (
    <div className="page">

      <div className="page-header">

        <div>

          <span className="page-label">
            ABOUT THE PROJECT
          </span>

          <h1>AlgalGuard AI</h1>

          <p>
            AI-powered environmental monitoring and
            algal bloom risk prediction.
          </p>

        </div>

      </div>


      {/* INTRODUCTION */}

      <section className="about-intro">

        <div className="about-icon">
          <Waves size={42} />
        </div>

        <div>

          <h2>
            What are algal blooms?
          </h2>

          <p>
            An algal bloom is a rapid increase in the
            population of algae in a waterbody. Some blooms
            can negatively affect water quality, aquatic
            ecosystems and human activities.
          </p>

          <p>
            Harmful algal blooms can produce toxins or
            reduce oxygen levels in water, creating risks
            for aquatic organisms and surrounding
            ecosystems.
          </p>

        </div>

      </section>


      {/* WHY PREDICT */}

      <section className="about-section">

        <div className="about-section-heading">

          <span>WHY PREDICT?</span>

          <h2>
            Early detection can support better monitoring
          </h2>

        </div>


        <div className="about-feature-grid">

          <div className="about-feature">

            <AlertTriangle />

            <h3>Identify Risk</h3>

            <p>
              Identify environmental conditions that may
              indicate increased bloom risk.
            </p>

          </div>


          <div className="about-feature">

            <Brain />

            <h3>Use Machine Learning</h3>

            <p>
              Machine learning can identify patterns in
              historical environmental observations.
            </p>

          </div>


          <div className="about-feature">

            <Target />

            <h3>Support Decisions</h3>

            <p>
              Risk predictions can help guide monitoring
              and environmental response.
            </p>

          </div>

        </div>

      </section>


      {/* WORKFLOW */}

      <section className="workflow-section">

        <div className="about-section-heading">

          <span>PROJECT WORKFLOW</span>

          <h2>
            From environmental data to risk prediction
          </h2>

        </div>


        <div className="workflow">

          <div className="workflow-step">

            <div className="workflow-number">
              01
            </div>

            <Database />

            <h3>Environmental Data</h3>

            <p>
              Collect waterbody and environmental
              observations.
            </p>

          </div>


          <ArrowDown className="workflow-arrow" />


          <div className="workflow-step">

            <div className="workflow-number">
              02
            </div>

            <Database />

            <h3>Data Processing</h3>

            <p>
              Prepare and process observations for the
              prediction model.
            </p>

          </div>


          <ArrowDown className="workflow-arrow" />


          <div className="workflow-step">

            <div className="workflow-number">
              03
            </div>

            <Brain />

            <h3>Machine Learning</h3>

            <p>
              Analyze patterns and estimate algal bloom
              risk.
            </p>

          </div>


          <ArrowDown className="workflow-arrow" />


          <div className="workflow-step">

            <div className="workflow-number">
              04
            </div>

            <Target />

            <h3>Risk Prediction</h3>

            <p>
              Display the predicted risk and recommended
              monitoring action.
            </p>

          </div>

        </div>

      </section>


      {/* SDG */}

      <section className="sdg-section about-sdg">

        <div>

          <span className="section-tag">
            SUSTAINABLE DEVELOPMENT
          </span>

          <h2>
            Supporting environmental sustainability
          </h2>

          <p>
            The project explores how artificial
            intelligence can support water-quality
            monitoring and environmental decision-making.
          </p>

        </div>


        <div className="sdg-cards">

          <div>
            <strong>SDG 6</strong>
            <span>Clean Water and Sanitation</span>
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

export default About;