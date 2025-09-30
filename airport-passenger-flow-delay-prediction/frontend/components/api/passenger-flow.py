from rest_framework.views import APIView
from rest_framework.response import Response
import joblib
import os

class PassengerFlowView(APIView):
    def get(self, request):
        # Load your trained model (ensure the path is correct)
        model_path = os.path.join(os.path.dirname(__file__), 'ml', 'passenger_flow_model.pkl')
        model = joblib.load(model_path)
        
        # Example: Predict for next 7 days (replace with real input/features)
        import pandas as pd
        future_dates = pd.date_range(start=pd.Timestamp.today(), periods=7)
        # Replace with actual feature engineering
        features = pd.DataFrame({'date': future_dates})
        predictions = model.predict(features)
        
        data = [
            {"date": str(date.date()), "predicted_passengers": int(pred)}
            for date, pred in zip(future_dates, predictions)
        ]
        return Response(data)