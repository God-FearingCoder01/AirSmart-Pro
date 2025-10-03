from rest_framework.views import APIView
from rest_framework.response import Response
import joblib
import os
import pandas as pd
import xgboost as xgb
import numpy as np
from sqlalchemy import create_engine   # Make sure SQLAlchemy is installed

class DashboardStatsView(APIView):
    def get(self, request):
        # Dummy data for now; to be replaced with real DB queries and calculations
        passengerStats = {"count": 1248}
        flightStats = {"count": 42, "onTimePercent": 87}
        waitTime = {"value": 18, "change": "+3 min from avg"}
        delayStats = {"count": 7, "confidence": "High confidence"}

        return Response({
            "passengerStats": passengerStats,
            "flightStats": flightStats,
            "waitTime": waitTime,
            "delayStats": delayStats,
        })

class FlightDelayPredictionView(APIView):
    def get(self, request):
        try:
            # Load preprocessor and model
            preprocessor_path = os.path.join(os.path.dirname(__file__), 'ml', 'flight_preprocessor.joblib')
            model_path = os.path.join(os.path.dirname(__file__), 'ml', 'xgb_delay.json')

            if not os.path.exists(preprocessor_path) or not os.path.exists(model_path):
                return Response({"error": "Model or preprocessor file not found."}, status=500)

            preprocessor = joblib.load(preprocessor_path)
            model = xgb.XGBClassifier()
            model.load_model(model_path)

            # Example: Get input data from query params (customize as needed)
            # You can also use POST and request.data for more complex input
            flight_id = int(request.query_params.get('flight_id', 1))
            airline = request.query_params.get('airline', 'FastJet')
            origin = request.query_params.get('origin', 'BUQ')
            destination = request.query_params.get('destination', 'HR')
            delay_minutes = float(request.query_params.get('delay_minutes', 0))
            status = request.query_params.get('status', 'Scheduled')

            # Define column names (must match what your preprocessor expects)
            columns = ['flight_id', 'airline', 'origin', 'destination', 'delay_minutes', 'status']

            # Create DataFrame
            input_df = pd.DataFrame([[flight_id, airline, origin, destination, delay_minutes, status]], columns=columns)

            # Transform
            input_df_transformed = preprocessor.transform(input_df)

            # Predict
            prediction = model.predict(input_df_transformed)
            probability = model.predict_proba(input_df_transformed)[0][1]

            return Response({
                "is_delayed": int(prediction[0]),
                "delay_probability": float(probability)
            })
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)

class PassengerFlowView(APIView):
    def get(self, request):
        try:
            # -------------------
            # Load model & scaler
            # -------------------
            base_dir = os.path.dirname(__file__)
            model_path = os.path.join(base_dir, 'ml', 'passenger_flow_model.joblib')
            scaler_path = os.path.join(base_dir, 'ml', 'passenger_flow_scaler.joblib')

            if not os.path.exists(model_path) or not os.path.exists(scaler_path):
                return Response({"error": "Model or scaler file not found."}, status=500)

            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)

            # -------------------
            # Fetch data from DB
            # -------------------
            engine = create_engine('mysql+pymysql://root:Oneafternoon1*@localhost:3306/airport_db')

            query = """
                SELECT record_id, passenger_count, terminal, timestamp
                FROM passenger_flow
                ORDER BY timestamp DESC
                LIMIT 24
            """
            df = pd.read_sql(query, engine)

            if df.empty:
                return Response([], status=200)  # instead of returning {"error": "..."}    
                
            # Make sure data is ordered oldest → newest
            df = df.sort_values('timestamp')

            # -------------------
            # Preprocess & Predict
            # -------------------
            X = scaler.transform(df[['passenger_count', 'record_id']].values)
            predictions = model.predict(X)

            # -------------------
            # Build response JSON
            # -------------------
            response_data = [
                {
                    "time": row["timestamp"].strftime("%H:%M"),  # or row["timestamp"].isoformat()
                    "passengerCount": int(pred)
                }
                for row, pred in zip(df.to_dict(orient="records"), predictions.tolist())
            ]

            return Response(response_data, status=200)

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)
