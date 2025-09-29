# Airport Passenger Flow and Delay Prediction System

This project aims to develop a system for predicting airport passenger flow and flight delays using machine learning techniques. The system is divided into two main components: a backend built with Django and a frontend built with Next.js.

## Project Structure

The project is organized into two main directories: `backend` and `frontend`.

### Backend

- **manage.py**: Command-line utility for managing the Django project.
- **requirements.txt**: Lists the Python packages required for the backend.
- **airport_api/**: Contains the main Django application files.
  - **settings.py**: Configuration settings for the Django project.
  - **urls.py**: URL routing for the Django application.
  - **wsgi.py**: Entry point for WSGI-compatible web servers.
- **core/**: Contains the core application logic.
  - **models.py**: Database models for the application.
  - **views.py**: View functions or classes that handle requests.
  - **serializers.py**: Serializers for converting complex data types to JSON.
  - **urls.py**: URL routing for the core application.
  - **ml/**: Contains machine learning model implementations.
    - **passenger_flow_model.py**: Model for predicting passenger flow.
    - **delay_prediction_model.py**: Model for predicting flight delays.
    - **utils.py**: Utility functions for machine learning models.
- **db.sqlite3**: SQLite database file for local development.

### Frontend

- **next.config.js**: Configuration settings for the Next.js application.
- **package.json**: Lists dependencies and scripts for the frontend.
- **tailwind.config.js**: Configuration for Tailwind CSS.
- **public/**: Contains static assets such as images and icons.
- **pages/**: Contains the main entry points for the Next.js application.
  - **index.tsx**: Main entry point rendering the homepage.
  - **api/**: Directory for API routes in Next.js.
- **components/**: Contains React components for visualizations.
  - **PassengerFlowChart.tsx**: Component for visualizing passenger flow data.
  - **DelayPredictionChart.tsx**: Component for visualizing flight delay predictions.
  - **Layout.tsx**: Layout component for the application structure.
- **styles/**: Contains global CSS styles.
  - **globals.css**: Global CSS styles for the application.
- **utils/**: Contains utility functions for making API calls.
  - **api.ts**: Utility functions for Axios API calls.

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory.
2. Install the required packages using:
   ```
   pip install -r requirements.txt
   ```
3. Run the Django server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install the required packages using:
   ```
   npm install
   ```
3. Start the Next.js application:
   ```
   npm run dev
   ```

## Usage

Once both the backend and frontend are running, you can access the application in your web browser. The frontend will communicate with the backend to fetch data and display visualizations for passenger flow and flight delays.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.