
export function validatePredictionForm(data) {
  const errors = {};

  // Waterbody
  if (!data.waterbody?.trim()) {
    errors.waterbody = "Waterbody is required";
  }

  // Site
  if (!data.site?.trim()) {
    errors.site = "Site is required";
  }

  // Depth
  if (data.depth === "") {
    errors.depth = "Depth is required";
  } else {
    const depth = Number(data.depth);

    if (!Number.isFinite(depth)) {
      errors.depth = "Depth must be a valid number";
    } else if (depth < 0) {
      errors.depth = "Depth cannot be negative";
    }
  }

  // Environmental variable
  if (!data.variable) {
    errors.variable = "Please select a variable";
  }

  // Units
  if (!data.units) {
    errors.units = "Please select units";
  }

  // Measurement value
  if (data.value === "" || data.value == null) {
    errors.value = "Measurement value is required";
  } else {
    const value = Number(data.value);

    if (!Number.isFinite(value)) {
      errors.value = "Value must be a valid number";
    } else {
      const variable = data.variable?.toLowerCase();

      if (variable === "temperature") {
        // Plausibility check for water temperature in Celsius.
        if (value < -10 || value > 60) {
          errors.value =
            "Temperature must be between -10°C and 60°C";
        }
      } else if (variable === "ph") {
        if (value < 0 || value > 14) {
          errors.value = "pH must be between 0 and 14";
        }
      } else if (
        [
          "dissolved oxygen",
          "nitrate",
          "phosphate",
          "chlorophyll-a",
        ].includes(variable)
      ) {
        if (value < 0) {
          errors.value =
            "This measurement cannot be negative";
        }
      }
    }
  }

  return errors;
}