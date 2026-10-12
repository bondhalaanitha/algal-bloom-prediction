
const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "API request failed.");
  }

  return result;
}

export async function predictBloom(data) {
  return request("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      waterbody: data.waterbody,
      site: data.site,
      notes: data.notes || "",
      time: data.time || "",
      Temperature: Number(data.Temperature),
      Specific_Conductivity: Number(data.Specific_Conductivity),
      DO_Saturation: Number(data.DO_Saturation),
      Dissolved_Oxygen: Number(data.Dissolved_Oxygen),
      Chlorophyll: Number(data.Chlorophyll),
      Turbidity: Number(data.Turbidity),
      Phycocyanin: Number(data.Phycocyanin),
      pH: Number(data.pH),
    }),
  });
}

export async function getPredictionHistory() {
  return request("/history");
}

export async function getDashboardData() {
  return request("/dashboard");
}