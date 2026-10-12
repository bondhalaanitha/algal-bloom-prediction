import { useState } from "react";
import { Brain, RotateCcw } from "lucide-react";

import PredictionForm from "../components/PredictionForm";
import PredictionResult from "../components/PredictionResult";
import Loading from "../components/Loading";
import { predictBloom } from "../services/api";

function Prediction() {

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handlePrediction(data) {

    setLoading(true);
    setResult(null);

    try {

      const prediction = await predictBloom(data);

      setResult(prediction);

    } catch (error) {

      console.error("Prediction error:", error);

      alert("Something went wrong while generating the prediction.");

    } finally {

      setLoading(false);

    }
  }


  function handleReset() {
    setResult(null);
  }


  return (
    <div className="page">

      <div className="page-header">

        <div>

          <div className="page-title-icon">
            <Brain size={24} />
          </div>

          <h1>Predict Algal Bloom Risk</h1>

          <p>
            Enter environmental observations to estimate
            the potential risk of algal bloom formation.
          </p>

        </div>

      </div>


      <div className="prediction-layout">

        {/* FORM */}

        <div className="prediction-form-card">

          <div className="card-heading">

            <h2>Environmental Data</h2>

            <p>
              Enter the observed water-quality information
              below.
            </p>

          </div>

          <PredictionForm
            onPredict={handlePrediction}
            loading={loading}
          />

        </div>


        {/* RESULT */}

        <div className="prediction-result-container">

          {loading && <Loading />}

          {!loading && !result && (
            <div className="empty-result">

              <div className="empty-result-icon">
                <Brain size={42} />
              </div>

              <h3>
                Prediction will appear here
              </h3>

              <p>
                Submit the environmental data to generate
                an algal bloom risk assessment.
              </p>

            </div>
          )}


          {!loading && result && (
            <>
              <PredictionResult result={result} />

              <button
                className="reset-button"
                onClick={handleReset}
              >
                <RotateCcw size={17} />
                Make Another Prediction
              </button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default Prediction;