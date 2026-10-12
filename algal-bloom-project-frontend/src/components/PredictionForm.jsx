
import { useState } from "react";

const initialForm = {
  waterbody: "",
  site: "",
  Temperature: "",
  Specific_Conductivity: "",
  DO_Saturation: "",
  Dissolved_Oxygen: "",
  Chlorophyll: "",
  Turbidity: "",
  Phycocyanin: "",
  pH: "",
  time: "",
  notes: ""
};

const fields = [
  { name: "Temperature", label: "Temperature (°C)" },
  { name: "Specific_Conductivity", label: "Specific Conductivity" },
  { name: "DO_Saturation", label: "DO Saturation (%)" },
  { name: "Dissolved_Oxygen", label: "Dissolved Oxygen (mg/L)" },
  { name: "Chlorophyll", label: "Chlorophyll" },
  { name: "Turbidity", label: "Turbidity (NTU)" },
  { name: "Phycocyanin", label: "Phycocyanin" },
  { name: "pH", label: "pH" }
];

function validateMeasurement(name, value) {
  if (!Number.isFinite(value)) {
    return "Please enter a valid number.";
  }

  if (name === "Temperature" && (value < -10 || value > 60)) {
    return "Temperature must be between -10°C and 60°C.";
  }

  if (name === "pH" && (value < 0 || value > 14)) {
    return "pH must be between 0 and 14.";
  }

  if (
    [
      "Specific_Conductivity",
      "DO_Saturation",
      "Dissolved_Oxygen",
      "Chlorophyll",
      "Turbidity",
      "Phycocyanin"
    ].includes(name) &&
    value < 0
  ) {
    return `${fields.find(field => field.name === name)?.label || name} cannot be negative.`;
  }

  if (name === "DO_Saturation" && value > 200) {
    return "DO Saturation must be between 0% and 200%.";
  }

  return "";
}

function PredictionForm({ onPredict, loading }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData(previous => ({
      ...previous,
      [name]: value
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.waterbody.trim() || !formData.site.trim()) {
      setError("Please enter the waterbody and site.");
      return;
    }

    for (const field of fields) {
      const rawValue = formData[field.name];

      if (rawValue.trim() === "") {
        setError(`Please enter ${field.label}.`);
        return;
      }

      const value = Number(rawValue);
      const validationMessage = validateMeasurement(
        field.name,
        value
      );

      if (validationMessage) {
        setError(`${field.label}: ${validationMessage}`);
        return;
      }
    }

    const measurements = {};

    for (const field of fields) {
      measurements[field.name] = Number(formData[field.name]);
    }

    onPredict({
      ...measurements,
      waterbody: formData.waterbody.trim(),
      site: formData.site.trim(),
      time: formData.time,
      notes: formData.notes.trim()
    });
  }

  return (
    <form className="prediction-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="waterbody">Waterbody *</label>
          <input
            id="waterbody"
            name="waterbody"
            type="text"
            value={formData.waterbody}
            onChange={handleChange}
            placeholder="Example: Krishna River"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="site">Site *</label>
          <input
            id="site"
            name="site"
            type="text"
            value={formData.site}
            onChange={handleChange}
            placeholder="Example: Vijayawada"
            required
          />
        </div>

        {fields.map(field => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>
              {field.label} *
            </label>

            <input
              id={field.name}
              type="number"
              step="any"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="time">Date &amp; Time</label>
          <input
            id="time"
            type="datetime-local"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows="4"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add additional observations..."
        />
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="primary-button"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Predict Algal Bloom Risk"}
      </button>
    </form>
  );
}

export default PredictionForm;