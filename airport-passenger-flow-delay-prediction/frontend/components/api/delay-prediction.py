from rest_framework.views import APIView
from rest_framework.response import Response
import joblib
import os
import pandas as pd
import xgboost as xgb
import numpy as np

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

            # Prepare input as DataFrame
            input_df = np.array([[flight_id, airline, origin, destination, delay_minutes, status]])
            input_df = preprocessor.transform(input_df)

            # Predict
            prediction = model.predict(input_df)
            probability = model.predict_proba(input_df)[0][1]  # Probability of delay

            return Response({
                "is_delayed": int(prediction[0]),
                "delay_probability": float(probability)
            })
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)