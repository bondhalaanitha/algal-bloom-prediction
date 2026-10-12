# 🌿 Algal Bloom Prediction System

### Machine Learning-Based Water Quality Monitoring and Algal Bloom Risk Prediction

## 📌 Project Overview

The **Algal Bloom Prediction System** is a web-based application that uses Machine Learning to estimate the risk of algal blooms based on water quality measurements.

The system analyzes environmental parameters and classifies the predicted bloom risk into three categories: **LOW, MEDIUM, and HIGH**. It also provides a dashboard for monitoring predictions and a history page for reviewing previous results.

This project aims to support water quality monitoring and demonstrate how machine learning can be applied to environmental data analysis.

## 🎯 Objectives

* Predict algal bloom risk using water quality parameters.
* Apply a Random Forest classification model to environmental data.
* Provide a simple and user-friendly web interface.
* Store and track previous prediction results.
* Display prediction summaries through a dashboard.
* Demonstrate the application of machine learning in environmental monitoring.

## ✨ Features

* **Bloom Risk Prediction:** Estimates LOW, MEDIUM, or HIGH algal bloom risk.
* **Water Quality Inputs:** Accepts eight environmental measurements.
* **Prediction Results:** Displays the predicted risk and model probability.
* **Dashboard:** Shows prediction statistics and risk summaries.
* **Prediction History:** Stores and displays previous predictions.
* **Input Validation:** Checks required fields and measurement ranges.
* **Database Integration:** Uses SQLite to store prediction records.

## 🧪 Water Quality Parameters

The model uses the following eight features:

| Parameter             | Description                                           |
| --------------------- | ----------------------------------------------------- |
| Temperature           | Water temperature in °C                               |
| Specific Conductivity | Indicates the water's ability to conduct electricity  |
| DO Saturation         | Dissolved oxygen saturation percentage                |
| Dissolved Oxygen      | Oxygen dissolved in water, typically measured in mg/L |
| Chlorophyll           | Indicator associated with photosynthetic organisms    |
| Turbidity             | Measure of water cloudiness                           |
| Phycocyanin           | Pigment associated with cyanobacteria                 |
| pH                    | Indicates acidity or alkalinity                       |

## 🛠️ Technologies Used

| Component           | Technology                   |
| ------------------- | ---------------------------- |
| Frontend            | React, Vite, JavaScript, CSS |
| Backend             | Python, Flask                |
| Machine Learning    | Scikit-learn, Random Forest  |
| Data Processing     | Pandas, NumPy                |
| Model Serialization | Joblib                       |
| Database            | SQLite                       |
| Version Control     | Git and GitHub               |

## 🤖 Machine Learning Model

The project uses a **Random Forest Classifier** to classify algal bloom risk.

The training pipeline includes:

1. Loading and validating the dataset.
2. Selecting the eight water quality features.
3. Splitting the dataset into training and testing sets.
4. Handling missing measurements using median imputation.
5. Training the Random Forest classifier.
6. Evaluating performance using accuracy, precision, recall, F1-score, and a confusion matrix.
7. Saving the trained model for use by the Flask backend.

### Model Evaluation

The current model achieved **99.48% accuracy** on a held-out test split of 7,547 samples from the available dataset.

This is an initial evaluation result. It does not guarantee the same performance on new water samples. Further validation on independent, real-world measurements is needed.

## 🏗️ System Architecture

```text
User
 |
 v
React Frontend
 |
 | HTTP API Requests
 v
Flask Backend
 |
 +----------------------+
 |                      |
 v                      v
Trained ML Model     SQLite Database
 |                      |
 v                      v
Risk Prediction     History & Dashboard
 |
 v
LOW / MEDIUM / HIGH
```

## 📂 Project Structure

```text
algal-bloom-project/
|
|-- algal-bloom-project-frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- utils/
|   |-- package.json
|   |-- vite.config.js
|   |
|-- algal-bloom-backend/
|   |-- app.py
|   |-- requirements.txt
|
|-- algal-bloom-ml/
|   |-- data/
|   |   |-- bloom_dataset.csv
|   |-- models/
|   |   |-- bloom_model.pkl
|   |   |-- features.json
|   |   |-- evaluation_report.json
|   |-- src/
|   |   |-- train_model.py
|   |-- requirements.txt
|
|-- .gitignore
|-- README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

* Python 3.10 or a compatible version for the project's dependencies
* Node.js and npm
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/bondhalaanitha/algal-bloom-prediction.git
cd algal-bloom-prediction
```

### 2. Set Up the Backend

Open a terminal in the backend folder:

```bash
cd algal-bloom-backend
py -m venv .venv
```

Activate the virtual environment in Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
py app.py
```

The backend is expected to run at:

`http://127.0.0.1:8000`

Keep this terminal running.

### 3. Set Up the Frontend

Open another terminal from the project root:

```bash
cd algal-bloom-project-frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your browser. It is commonly:

`http://localhost:5173`

Ensure the frontend API configuration points to the running Flask backend.

### 4. Machine Learning Model

The backend requires the trained model and feature list:

* `algal-bloom-ml/models/bloom_model.pkl`
* `algal-bloom-ml/models/features.json`

The backend must be configured to load these files from the correct location. If retraining the model, install the ML dependencies and run the training script from the repository root:

```bash
cd algal-bloom-ml
py -m pip install -r requirements.txt
py src/train_model.py
```

## 📊 Application Modules

### 1. Dashboard

Displays prediction statistics and summaries of observed bloom risk.

### 2. Prediction

Allows users to enter water quality measurements and obtain an estimated bloom risk.

### 3. Prediction History

Displays previously saved prediction records.

### 4. About

Provides information about the project and its purpose.

## 🔮 Future Enhancements

* Validate predictions using independent field measurements.
* Integrate live water quality sensors or external data sources.
* Add location-based water monitoring and interactive maps.
* Visualize changes in water quality over time.
* Improve model validation using data grouped by sampling site or collection date.
* Deploy the application to a cloud platform.
* Add user authentication and role-based access if required.

## ⚠️ Limitations and Disclaimer

This project is intended for academic and demonstration purposes. Prediction quality depends on the training dataset, its labels, and the quality of the input measurements.

The model's reported test accuracy should not be interpreted as guaranteed real-world performance. Predictions are not a substitute for laboratory testing, expert assessment, or official environmental monitoring.

## 👩‍💻 Author

**Anitha Bondhala**

GitHub: [@bondhalaanitha](https://github.com/bondhalaanitha)

## 📄 License

No license has been specified yet. If you want others to reuse or modify this project, consider adding an appropriate open-source license.
