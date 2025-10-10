# Airport Passenger Flow and Delay Prediction System - Backend

This document provides an overview of the backend setup and usage for the Airport Passenger Flow and Delay Prediction System.

## Project Structure

The backend is structured as follows:

```
backend/
├── manage.py                # Command-line utility for managing the Django project
├── requirements.txt         # Python packages required for the backend
├── airport_api/             # Main Django application
│   ├── __init__.py
│   ├── settings.py          # Django settings and configurations
│   ├── urls.py              # URL routing for the Django application
│   └── wsgi.py              # WSGI entry point for serving the application
├── core/                    # Core application logic
│   ├── __init__.py
│   ├── models.py            # Database models
│   ├── views.py             # View functions or classes
│   ├── serializers.py       # Serializers for data conversion
│   ├── urls.py              # URL routing for the core application
│   └── ml/                  # Machine learning models
│       ├── __init__.py
│       ├── passenger_flow_model.py  # Model for predicting passenger flow
│       ├── delay_prediction_model.py # Model for predicting flight delays
│       └── utils.py         # Utility functions for ML models
└── db.sqlite3               # SQLite database file for local development
```

## Setup Instructions

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd airport-passenger-flow-delay-prediction/backend
   ```

2. **Create a Virtual Environment**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Requirements**
   ```
   pip install -r requirements.txt
   ```

4. **Run Migrations**
   ```
   python manage.py migrate
   ```

5. **Start the Development Server**
   ```
   python manage.py runserver
   ```

## Usage

- The backend provides RESTful APIs for the frontend to interact with.
- Access the API documentation at `http://127.0.0.1:8000/api/` (if using Django REST Framework's built-in documentation).

## Machine Learning Models

- The `ml` directory contains the implementations of the machine learning models used for predicting passenger flow and flight delays.
- Ensure that the necessary data is available for training and testing these models.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.